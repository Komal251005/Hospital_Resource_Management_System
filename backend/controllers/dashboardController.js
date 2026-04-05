const Resource = require('../models/Resource');
const EmergencyCase = require('../models/EmergencyCase');
const DailyData = require('../models/DailyData');

/**
 * GET /api/dashboard/summary
 * Returns aggregated stats for the dashboard
 */
const getSummary = async (req, res, next) => {
  try {
    // Run all queries in parallel for performance
    const [
      totalResources,
      resources,
      totalEmergencies,
      activeEmergencies,
      criticalEmergencies,
      today,
      yesterday,
    ] = await Promise.all([
      Resource.countDocuments(),
      Resource.find(),
      EmergencyCase.countDocuments(),
      EmergencyCase.countDocuments({ status: { $in: ['Pending', 'Active'] } }),
      EmergencyCase.countDocuments({ severity: 'Critical', status: { $in: ['Pending', 'Active'] } }),
      DailyData.findOne().sort({ date: -1 }),
      DailyData.findOne().sort({ date: -1 }).skip(1),
    ]);

    // Aggregate resources
    const resourceSummary = resources.reduce(
      (acc, r) => {
        acc.totalCapacity += r.total;
        acc.availableResources += r.available;
        return acc;
      },
      { totalCapacity: 0, availableResources: 0 }
    );

    // Calculate trends vs yesterday
    const patientTrend =
      today && yesterday
        ? (((today.patients - yesterday.patients) / (yesterday.patients || 1)) * 100).toFixed(1)
        : 0;

    // Low stock alerts (< 20% available)
    const lowStockAlerts = resources.filter(
      (r) => r.total > 0 && r.available / r.total < 0.2
    ).length;

    res.status(200).json({
      success: true,
      data: {
        totalPatients: today?.patients || 0,
        patientTrend: parseFloat(patientTrend),
        availableResources: resourceSummary.availableResources,
        totalCapacity: resourceSummary.totalCapacity,
        utilizationPercent:
          resourceSummary.totalCapacity > 0
            ? Math.round(
                ((resourceSummary.totalCapacity - resourceSummary.availableResources) /
                  resourceSummary.totalCapacity) *
                  100
              )
            : 0,
        totalEmergencies,
        activeEmergencies,
        criticalEmergencies,
        lowStockAlerts,
        bedsUsed: today?.bedsUsed || 0,
        icuUsed: today?.icuUsed || 0,
        ventilatorsUsed: today?.ventilatorsUsed || 0,
        lastUpdated: today?.date || new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary };
