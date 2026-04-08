// Emergency Data for surge monitoring
export const emergencyData = {
    // Current Status
    currentStatus: {
        level: "High", // Low, Moderate, High, Critical
        score: 78,
        trend: "increasing",
        lastUpdated: "2026-01-30T14:30:00",
        predictedPeak: "2026-01-30T18:00:00"
    },

    // Risk Factors
    riskFactors: [
        { factor: "ICU Occupancy", value: 84, threshold: 80, status: "warning" },
        { factor: "Emergency Room Queue", value: 23, threshold: 20, status: "warning" },
        { factor: "Available Ventilators", value: 17, threshold: 15, status: "normal" },
        { factor: "Staff Availability", value: 68, threshold: 60, status: "normal" },
        { factor: "Ambulance Response Time", value: 12, threshold: 10, status: "warning" },
        { factor: "Oxygen Supply Level", value: 45, threshold: 40, status: "normal" }
    ],

    // Alerts
    activeAlerts: [
        {
            id: 1,
            type: "critical",
            title: "ICU Capacity Critical",
            message: "ICU occupancy has exceeded 80%. Consider activating overflow protocols.",
            timestamp: "2026-01-30T14:15:00",
            acknowledged: false
        },
        {
            id: 2,
            type: "warning",
            title: "Predicted Surge at 6 PM",
            message: "ML model predicts 40% increase in ER admissions between 6-8 PM.",
            timestamp: "2026-01-30T13:00:00",
            acknowledged: true
        },
        {
            id: 3,
            type: "warning",
            title: "Staff Shortage in ER",
            message: "Only 3 doctors available for emergency shift. 2 more recommended.",
            timestamp: "2026-01-30T12:30:00",
            acknowledged: false
        },
        {
            id: 4,
            type: "info",
            title: "Ventilator Maintenance Complete",
            message: "2 ventilators returned to service after scheduled maintenance.",
            timestamp: "2026-01-30T11:00:00",
            acknowledged: true
        }
    ],

    // Surge History (Last 7 days)
    surgeHistory: [
        { date: "Jan 24", level: "Low", peakPatients: 145, avgWaitTime: 12 },
        { date: "Jan 25", level: "Moderate", peakPatients: 189, avgWaitTime: 18 },
        { date: "Jan 26", level: "Low", peakPatients: 156, avgWaitTime: 14 },
        { date: "Jan 27", level: "High", peakPatients: 234, avgWaitTime: 28 },
        { date: "Jan 28", level: "Critical", peakPatients: 287, avgWaitTime: 45 },
        { date: "Jan 29", level: "High", peakPatients: 245, avgWaitTime: 32 },
        { date: "Jan 30", level: "High", peakPatients: 212, avgWaitTime: 25 }
    ],

    // Emergency Response Teams
    responseTeams: [
        { id: 1, name: "Trauma Team Alpha", status: "Active", members: 6, currentCase: "MVA - Critical" },
        { id: 2, name: "Cardiac Response", status: "Standby", members: 4, currentCase: null },
        { id: 3, name: "Pediatric Emergency", status: "Active", members: 5, currentCase: "Respiratory Distress" },
        { id: 4, name: "Stroke Team", status: "Standby", members: 4, currentCase: null },
        { id: 5, name: "Mass Casualty Team", status: "Standby", members: 12, currentCase: null }
    ],

    // Capacity Overview
    capacityOverview: {
        emergencyRoom: { current: 23, max: 30, percentage: 77 },
        icu: { current: 42, max: 50, percentage: 84 },
        generalWard: { current: 312, max: 400, percentage: 78 },
        pediatric: { current: 45, max: 60, percentage: 75 },
        surgical: { current: 28, max: 35, percentage: 80 }
    },

    // Predictions (ML Placeholder)
    predictions: {
        nextHour: { expectedPatients: 28, confidence: 85 },
        next4Hours: { expectedPatients: 95, confidence: 78 },
        next24Hours: { expectedPatients: 420, confidence: 65 },
        surgeProbability: 72,
        recommendedAction: "Prepare additional staff for evening shift"
    }
};
