// Mock Data for Hospital Resource Optimization System
// This data structure is API-ready and can be replaced with actual API calls

export const dashboardData = {
    // Summary Statistics
    stats: {
        totalBeds: {
            total: 500,
            available: 127,
            occupied: 373,
            icon: "FaBed",
            label: "Total Beds Available",
            color: "blue"
        },
        icuBeds: {
            total: 50,
            available: 12,
            occupied: 38,
            icon: "FaHeartbeat",
            label: "ICU Beds Available",
            color: "red"
        },
        emergencyWards: {
            total: 8,
            active: 6,
            inactive: 2,
            icon: "FaAmbulance",
            label: "Emergency Wards Active",
            color: "orange"
        },
        doctorsOnDuty: {
            total: 120,
            onDuty: 45,
            available: 15,
            icon: "FaUserMd",
            label: "Doctors On Duty",
            color: "green"
        },
        nursesOnDuty: {
            total: 300,
            onDuty: 156,
            available: 44,
            icon: "FaUserNurse",
            label: "Nurses On Duty",
            color: "purple"
        },
        ventilators: {
            total: 75,
            available: 23,
            inUse: 52,
            icon: "FaLungs",
            label: "Ventilators Available",
            color: "cyan"
        },
        oxygenCylinders: {
            total: 200,
            available: 89,
            inUse: 111,
            icon: "FaWind",
            label: "Oxygen Cylinders",
            color: "teal"
        }
    },

    // Emergency Occupancy Status
    emergencyOccupancy: {
        currentOccupancy: 78,
        maxCapacity: 100,
        status: "High", // Low, Moderate, High, Critical
        trend: "increasing", // increasing, stable, decreasing
        lastUpdated: new Date().toISOString()
    },

    // Recent Alerts
    recentAlerts: [
        {
            id: 1,
            type: "warning",
            message: "ICU capacity reaching 80%",
            timestamp: "2026-01-30T14:00:00"
        },
        {
            id: 2,
            type: "info",
            message: "New shift started - 45 doctors on duty",
            timestamp: "2026-01-30T08:00:00"
        },
        {
            id: 3,
            type: "critical",
            message: "Ventilator shortage predicted in 24 hours",
            timestamp: "2026-01-30T12:30:00"
        }
    ],

    // Quick Stats for Charts
    weeklyPatientInflow: [
        { day: "Mon", patients: 145 },
        { day: "Tue", patients: 132 },
        { day: "Wed", patients: 168 },
        { day: "Thu", patients: 156 },
        { day: "Fri", patients: 189 },
        { day: "Sat", patients: 201 },
        { day: "Sun", patients: 178 }
    ]
};

// Hospital Information
export const hospitalInfo = {
    name: "City General Hospital",
    location: "Downtown Medical District",
    totalCapacity: 500,
    departments: 12,
    establishedYear: 1985
};

// User Roles
export const userRoles = {
    admin: "Administrator",
    doctor: "Medical Staff",
    nurse: "Nursing Staff",
    manager: "Resource Manager"
};

// Analytics Data
export const analyticsData = {
    // Daily Patient Inflow (Last 30 days)
    dailyPatientInflow: [
        { date: "Jan 01", patients: 145, emergency: 32, regular: 113 },
        { date: "Jan 02", patients: 132, emergency: 28, regular: 104 },
        { date: "Jan 03", patients: 168, emergency: 45, regular: 123 },
        { date: "Jan 04", patients: 156, emergency: 38, regular: 118 },
        { date: "Jan 05", patients: 189, emergency: 52, regular: 137 },
        { date: "Jan 06", patients: 201, emergency: 61, regular: 140 },
        { date: "Jan 07", patients: 178, emergency: 48, regular: 130 },
        { date: "Jan 08", patients: 165, emergency: 42, regular: 123 },
        { date: "Jan 09", patients: 143, emergency: 35, regular: 108 },
        { date: "Jan 10", patients: 198, emergency: 55, regular: 143 },
        { date: "Jan 11", patients: 212, emergency: 68, regular: 144 },
        { date: "Jan 12", patients: 187, emergency: 51, regular: 136 },
        { date: "Jan 13", patients: 176, emergency: 46, regular: 130 },
        { date: "Jan 14", patients: 159, emergency: 39, regular: 120 },
        { date: "Jan 15", patients: 184, emergency: 49, regular: 135 },
        { date: "Jan 16", patients: 195, emergency: 58, regular: 137 },
        { date: "Jan 17", patients: 208, emergency: 64, regular: 144 },
        { date: "Jan 18", patients: 192, emergency: 53, regular: 139 },
        { date: "Jan 19", patients: 175, emergency: 44, regular: 131 },
        { date: "Jan 20", patients: 163, emergency: 40, regular: 123 },
        { date: "Jan 21", patients: 181, emergency: 47, regular: 134 },
        { date: "Jan 22", patients: 199, emergency: 59, regular: 140 },
        { date: "Jan 23", patients: 215, emergency: 71, regular: 144 },
        { date: "Jan 24", patients: 203, emergency: 62, regular: 141 },
        { date: "Jan 25", patients: 188, emergency: 50, regular: 138 },
        { date: "Jan 26", patients: 172, emergency: 43, regular: 129 },
        { date: "Jan 27", patients: 186, emergency: 48, regular: 138 },
        { date: "Jan 28", patients: 197, emergency: 56, regular: 141 },
        { date: "Jan 29", patients: 210, emergency: 67, regular: 143 },
        { date: "Jan 30", patients: 195, emergency: 54, regular: 141 }
    ],

    // Weekly Patient Inflow
    weeklyPatientInflow: [
        { week: "Week 1", patients: 1169, emergency: 304, regular: 865 },
        { week: "Week 2", patients: 1275, emergency: 356, regular: 919 },
        { week: "Week 3", points: 1318, emergency: 375, regular: 943 },
        { week: "Week 4", patients: 1348, emergency: 380, regular: 968 }
    ],

    // Resource Utilization
    resourceUtilization: [
        { resource: "General Beds", total: 400, used: 312, available: 88, utilization: 78 },
        { resource: "ICU Beds", total: 50, used: 42, available: 8, utilization: 84 },
        { resource: "Emergency Beds", total: 50, used: 38, available: 12, utilization: 76 },
        { resource: "Ventilators", total: 75, used: 58, available: 17, utilization: 77 },
        { resource: "Oxygen Supply", total: 200, used: 145, available: 55, utilization: 73 },
        { resource: "Operating Rooms", total: 12, used: 9, available: 3, utilization: 75 }
    ],

    // Case Distribution
    caseDistribution: [
        { name: "Emergency", value: 1847, color: "#ef4444" },
        { name: "Non-Emergency", value: 4289, color: "#22c55e" },
        { name: "Scheduled Surgery", value: 892, color: "#3b82f6" },
        { name: "Outpatient", value: 2156, color: "#f59e0b" }
    ],

    // Department-wise Patient Load
    departmentLoad: [
        { department: "Cardiology", patients: 245, capacity: 300 },
        { department: "Neurology", patients: 178, capacity: 200 },
        { department: "Orthopedics", patients: 156, capacity: 180 },
        { department: "Pediatrics", patients: 198, capacity: 250 },
        { department: "Oncology", patients: 134, capacity: 150 },
        { department: "General Medicine", patients: 312, capacity: 350 }
    ],

    // Monthly Trends
    monthlyTrends: [
        { month: "Aug", admissions: 4521, discharges: 4398, deaths: 89 },
        { month: "Sep", admissions: 4789, discharges: 4654, deaths: 95 },
        { month: "Oct", admissions: 5012, discharges: 4876, deaths: 102 },
        { month: "Nov", admissions: 5234, discharges: 5089, deaths: 108 },
        { month: "Dec", admissions: 5567, discharges: 5412, deaths: 115 },
        { month: "Jan", admissions: 5823, discharges: 5678, deaths: 112 }
    ]
};
