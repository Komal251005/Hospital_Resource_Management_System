// Dashboard Page - Main dashboard with summary cards and emergency status
import { useState, useEffect } from 'react';
import { dashboardAPI, resourcesAPI, emergencyAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/dashboard/StatCard';
import OccupancyIndicator from '../components/dashboard/OccupancyIndicator';
import AlertCard from '../components/dashboard/AlertCard';
import { FaSync, FaClock } from 'react-icons/fa';

const Dashboard = () => {
    // State for dashboard data
    const [stats, setStats] = useState(null);
    const [occupancy, setOccupancy] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [error, setError] = useState('');

    // Build stats from the backend summary
    const buildStats = (data) => {
        // Find specific resources by name pattern
        const findResource = (name) => {
            // data has totalCapacity, availableResources, etc. but not per-resource breakdown
            // We'll use the overall summary for the stat cards
        };

        return {
            totalBeds: {
                total: data.totalCapacity || 0,
                available: data.availableResources || 0,
                icon: 'FaBed',
                label: 'Total Resources Available',
                color: 'blue',
            },
            icuBeds: {
                total: 50,
                available: 50 - (data.icuUsed || 0),
                icon: 'FaHeartbeat',
                label: 'ICU Beds Available',
                color: 'red',
            },
            emergencyWards: {
                total: data.totalEmergencies || 0,
                active: data.activeEmergencies || 0,
                icon: 'FaAmbulance',
                label: 'Emergency Cases Active',
                color: 'orange',
            },
            doctorsOnDuty: {
                total: data.totalCapacity || 0,
                onDuty: data.totalCapacity - data.availableResources || 0,
                icon: 'FaUserMd',
                label: 'Utilization',
                color: 'green',
            },
            nursesOnDuty: {
                total: data.totalEmergencies || 0,
                onDuty: data.criticalEmergencies || 0,
                icon: 'FaUserNurse',
                label: 'Critical Cases',
                color: 'purple',
            },
            ventilators: {
                total: 40,
                available: 40 - (data.ventilatorsUsed || 0),
                icon: 'FaLungs',
                label: 'Ventilators Available',
                color: 'cyan',
            },
            oxygenCylinders: {
                total: data.totalCapacity || 0,
                available: data.availableResources || 0,
                icon: 'FaWind',
                label: 'Resource Availability',
                color: 'teal',
            },
        };
    };

    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch summary, resources, and recent emergencies in parallel
            const [summaryRes, resourcesRes, emergencyRes] = await Promise.all([
                dashboardAPI.getSummary(),
                resourcesAPI.getAll().catch(() => ({ data: [] })),
                emergencyAPI.getAll({ limit: 5 }).catch(() => ({ data: [] })),
            ]);

            const summaryData = summaryRes.data;

            // Build resource-specific stats from the resources list
            const resources = resourcesRes.data || [];
            const bedResources = resources.filter(r => r.category === 'Bed');
            const equipResources = resources.filter(r => r.category === 'Equipment');
            const staffResources = resources.filter(r => r.category === 'Staff');

            const totalBeds = bedResources.reduce((sum, r) => sum + r.total, 0);
            const availBeds = bedResources.reduce((sum, r) => sum + r.available, 0);
            const totalEquip = equipResources.reduce((sum, r) => sum + r.total, 0);
            const availEquip = equipResources.reduce((sum, r) => sum + r.available, 0);
            const totalStaff = staffResources.reduce((sum, r) => sum + r.total, 0);
            const availStaff = staffResources.reduce((sum, r) => sum + r.available, 0);

            // Find specific resources
            const icuBed = resources.find(r => r.resourceName?.toLowerCase().includes('icu'));
            const ventilator = resources.find(r => r.resourceName?.toLowerCase().includes('ventilator'));
            const oxygen = resources.find(r => r.resourceName?.toLowerCase().includes('oxygen'));
            const doctorsRes = resources.find(r => r.resourceName?.toLowerCase().includes('doctor'));
            const nursesRes = resources.find(r => r.resourceName?.toLowerCase().includes('nurse'));

            const statsData = {
                totalBeds: {
                    total: totalBeds || summaryData.totalCapacity,
                    available: availBeds || summaryData.availableResources,
                    icon: 'FaBed',
                    label: 'Total Beds Available',
                    color: 'blue',
                },
                icuBeds: {
                    total: icuBed?.total || 50,
                    available: icuBed?.available || (50 - (summaryData.icuUsed || 0)),
                    icon: 'FaHeartbeat',
                    label: 'ICU Beds Available',
                    color: 'red',
                },
                emergencyWards: {
                    total: summaryData.totalEmergencies || 0,
                    active: summaryData.activeEmergencies || 0,
                    icon: 'FaAmbulance',
                    label: 'Emergency Cases',
                    color: 'orange',
                },
                doctorsOnDuty: {
                    total: doctorsRes?.total || totalStaff || 60,
                    onDuty: doctorsRes ? (doctorsRes.total - doctorsRes.available) : (totalStaff - availStaff),
                    icon: 'FaUserMd',
                    label: 'Staff On Duty',
                    color: 'green',
                },
                nursesOnDuty: {
                    total: nursesRes?.total || 120,
                    onDuty: nursesRes ? (nursesRes.total - nursesRes.available) : 0,
                    icon: 'FaUserNurse',
                    label: 'Nurses On Duty',
                    color: 'purple',
                },
                ventilators: {
                    total: ventilator?.total || 40,
                    available: ventilator?.available || (40 - (summaryData.ventilatorsUsed || 0)),
                    icon: 'FaLungs',
                    label: 'Ventilators Available',
                    color: 'cyan',
                },
                oxygenCylinders: {
                    total: oxygen?.total || 100,
                    available: oxygen?.available || 45,
                    icon: 'FaWind',
                    label: 'Oxygen Cylinders',
                    color: 'teal',
                },
            };

            setStats(statsData);

            // Set occupancy from utilization data
            const utilPercent = summaryData.utilizationPercent || 0;
            setOccupancy({
                currentOccupancy: utilPercent,
                maxCapacity: 100,
                status: utilPercent >= 85 ? 'Critical' : utilPercent >= 70 ? 'High' : utilPercent >= 50 ? 'Moderate' : 'Low',
                trend: summaryData.patientTrend > 0 ? 'increasing' : summaryData.patientTrend < 0 ? 'decreasing' : 'stable',
            });

            // Build alerts from emergency cases and low stock
            const emergencyCases = emergencyRes.data || [];
            const alertsList = [];

            if (summaryData.criticalEmergencies > 0) {
                alertsList.push({
                    id: 'crit-1',
                    type: 'critical',
                    message: `${summaryData.criticalEmergencies} critical emergency case(s) active`,
                    timestamp: new Date().toISOString(),
                });
            }
            if (summaryData.lowStockAlerts > 0) {
                alertsList.push({
                    id: 'low-1',
                    type: 'warning',
                    message: `${summaryData.lowStockAlerts} resource(s) running low (< 20% available)`,
                    timestamp: new Date().toISOString(),
                });
            }
            if (utilPercent >= 80) {
                alertsList.push({
                    id: 'util-1',
                    type: 'warning',
                    message: `Resource utilization at ${utilPercent}% - approaching capacity`,
                    timestamp: new Date().toISOString(),
                });
            }
            // Add recent emergency cases as info alerts
            emergencyCases.slice(0, 2).forEach((ec, i) => {
                alertsList.push({
                    id: `em-${ec._id || i}`,
                    type: ec.severity === 'Critical' ? 'critical' : ec.severity === 'High' ? 'warning' : 'info',
                    message: `${ec.patientName} - ${ec.severity} (${ec.status})`,
                    timestamp: ec.date || new Date().toISOString(),
                });
            });

            setAlerts(alertsList);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Refresh data handler
    const handleRefresh = () => {
        fetchDashboardData();
    };

    // Format last updated time
    const formatLastUpdated = () => {
        return lastUpdated.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex">
                <Sidebar />
                <div className="flex-1 ml-64">
                    <Navbar />
                    <main className="pt-16 p-6">
                        <div className="flex items-center justify-center h-96">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading dashboard data...</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !stats) {
        return (
            <div className="min-h-screen bg-gray-100 flex">
                <Sidebar />
                <div className="flex-1 ml-64">
                    <Navbar />
                    <main className="pt-16 p-6">
                        <div className="flex items-center justify-center h-96">
                            <div className="text-center">
                                <p className="text-red-600 mb-4">{error}</p>
                                <button onClick={handleRefresh} className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
                                    Retry
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-64">
                {/* Top Navbar */}
                <Navbar userRole="Administrator" />

                {/* Dashboard Content */}
                <main className="pt-20 p-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Real-time hospital resource monitoring
                            </p>
                        </div>

                        {/* Refresh Button & Last Updated */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <FaClock className="text-gray-400" />
                                <span>Last updated: {formatLastUpdated()}</span>
                            </div>
                            <button
                                onClick={handleRefresh}
                                className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors shadow-lg shadow-teal-500/30"
                            >
                                <FaSync className="text-sm" />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Summary Stats Cards - Grid */}
                    {stats && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                <StatCard
                                    icon={stats.totalBeds.icon}
                                    label={stats.totalBeds.label}
                                    value={stats.totalBeds.available}
                                    total={stats.totalBeds.total}
                                    color={stats.totalBeds.color}
                                />
                                <StatCard
                                    icon={stats.icuBeds.icon}
                                    label={stats.icuBeds.label}
                                    value={stats.icuBeds.available}
                                    total={stats.icuBeds.total}
                                    color={stats.icuBeds.color}
                                />
                                <StatCard
                                    icon={stats.emergencyWards.icon}
                                    label={stats.emergencyWards.label}
                                    value={stats.emergencyWards.active}
                                    total={stats.emergencyWards.total}
                                    color={stats.emergencyWards.color}
                                />
                                <StatCard
                                    icon={stats.doctorsOnDuty.icon}
                                    label={stats.doctorsOnDuty.label}
                                    value={stats.doctorsOnDuty.onDuty}
                                    total={stats.doctorsOnDuty.total}
                                    color={stats.doctorsOnDuty.color}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                <StatCard
                                    icon={stats.nursesOnDuty.icon}
                                    label={stats.nursesOnDuty.label}
                                    value={stats.nursesOnDuty.onDuty}
                                    total={stats.nursesOnDuty.total}
                                    color={stats.nursesOnDuty.color}
                                />
                                <StatCard
                                    icon={stats.ventilators.icon}
                                    label={stats.ventilators.label}
                                    value={stats.ventilators.available}
                                    total={stats.ventilators.total}
                                    color={stats.ventilators.color}
                                />
                                <StatCard
                                    icon={stats.oxygenCylinders.icon}
                                    label={stats.oxygenCylinders.label}
                                    value={stats.oxygenCylinders.available}
                                    total={stats.oxygenCylinders.total}
                                    color={stats.oxygenCylinders.color}
                                />
                            </div>
                        </>
                    )}

                    {/* Bottom Section - Occupancy & Alerts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {occupancy && (
                            <OccupancyIndicator
                                currentOccupancy={occupancy.currentOccupancy}
                                maxCapacity={occupancy.maxCapacity}
                                status={occupancy.status}
                                trend={occupancy.trend}
                            />
                        )}

                        <AlertCard alerts={alerts} />
                    </div>

                    {/* Quick Stats Footer */}
                    <div className="mt-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 shadow-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
                            <div className="text-center">
                                <p className="text-3xl font-bold">98.5%</p>
                                <p className="text-sm opacity-80">System Uptime</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{stats?.totalBeds?.total || 0}</p>
                                <p className="text-sm opacity-80">Total Capacity</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{stats?.emergencyWards?.active || 0}</p>
                                <p className="text-sm opacity-80">Active Emergencies</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{occupancy?.currentOccupancy || 0}%</p>
                                <p className="text-sm opacity-80">Utilization</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
