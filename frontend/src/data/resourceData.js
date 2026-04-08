// Resource Management Data
export const resourceData = {
    // Beds Data
    beds: [
        { id: 1, type: "General Ward", floor: "1st Floor", room: "101-A", status: "Available", patient: null, lastUpdated: "2026-01-30T14:00:00" },
        { id: 2, type: "General Ward", floor: "1st Floor", room: "101-B", status: "Occupied", patient: "John Smith", lastUpdated: "2026-01-30T08:30:00" },
        { id: 3, type: "General Ward", floor: "1st Floor", room: "102-A", status: "Occupied", patient: "Mary Johnson", lastUpdated: "2026-01-29T22:15:00" },
        { id: 4, type: "ICU", floor: "2nd Floor", room: "ICU-01", status: "Critical", patient: "Robert Davis", lastUpdated: "2026-01-30T13:45:00" },
        { id: 5, type: "ICU", floor: "2nd Floor", room: "ICU-02", status: "Occupied", patient: "Sarah Wilson", lastUpdated: "2026-01-30T10:00:00" },
        { id: 6, type: "ICU", floor: "2nd Floor", room: "ICU-03", status: "Available", patient: null, lastUpdated: "2026-01-30T14:30:00" },
        { id: 7, type: "Emergency", floor: "Ground Floor", room: "ER-01", status: "Occupied", patient: "Michael Brown", lastUpdated: "2026-01-30T14:15:00" },
        { id: 8, type: "Emergency", floor: "Ground Floor", room: "ER-02", status: "Critical", patient: "Emily Taylor", lastUpdated: "2026-01-30T13:00:00" },
        { id: 9, type: "Pediatric", floor: "3rd Floor", room: "PED-01", status: "Available", patient: null, lastUpdated: "2026-01-30T09:00:00" },
        { id: 10, type: "Pediatric", floor: "3rd Floor", room: "PED-02", status: "Occupied", patient: "Tommy Anderson", lastUpdated: "2026-01-30T11:30:00" },
        { id: 11, type: "Maternity", floor: "4th Floor", room: "MAT-01", status: "Occupied", patient: "Jessica Martinez", lastUpdated: "2026-01-30T06:00:00" },
        { id: 12, type: "Maternity", floor: "4th Floor", room: "MAT-02", status: "Available", patient: null, lastUpdated: "2026-01-30T12:00:00" }
    ],

    // Staff Data
    staff: [
        { id: 1, name: "Dr. James Wilson", role: "Senior Cardiologist", department: "Cardiology", status: "On Duty", shift: "Day", phone: "555-0101" },
        { id: 2, name: "Dr. Sarah Chen", role: "Neurologist", department: "Neurology", status: "On Duty", shift: "Day", phone: "555-0102" },
        { id: 3, name: "Dr. Michael Brown", role: "Emergency Physician", department: "Emergency", status: "On Duty", shift: "Day", phone: "555-0103" },
        { id: 4, name: "Dr. Emily Davis", role: "Pediatrician", department: "Pediatrics", status: "Available", shift: "Day", phone: "555-0104" },
        { id: 5, name: "Dr. Robert Johnson", role: "Surgeon", department: "Surgery", status: "In Surgery", shift: "Day", phone: "555-0105" },
        { id: 6, name: "Nurse Lisa Anderson", role: "Head Nurse", department: "ICU", status: "On Duty", shift: "Day", phone: "555-0201" },
        { id: 7, name: "Nurse Mark Thompson", role: "ICU Nurse", department: "ICU", status: "On Duty", shift: "Day", phone: "555-0202" },
        { id: 8, name: "Nurse Jennifer White", role: "ER Nurse", department: "Emergency", status: "On Duty", shift: "Day", phone: "555-0203" },
        { id: 9, name: "Nurse David Lee", role: "Pediatric Nurse", department: "Pediatrics", status: "On Break", shift: "Day", phone: "555-0204" },
        { id: 10, name: "Nurse Maria Garcia", role: "General Nurse", department: "General Ward", status: "On Duty", shift: "Day", phone: "555-0205" },
        { id: 11, name: "Dr. Anna Smith", role: "Oncologist", department: "Oncology", status: "On Leave", shift: "N/A", phone: "555-0106" },
        { id: 12, name: "Tech. John Miller", role: "Lab Technician", department: "Laboratory", status: "On Duty", shift: "Day", phone: "555-0301" }
    ],

    // Equipment Data
    equipment: [
        { id: 1, name: "Ventilator", model: "Philips V60", location: "ICU-01", status: "In Use", lastMaintenance: "2026-01-15", nextMaintenance: "2026-02-15" },
        { id: 2, name: "Ventilator", model: "Philips V60", location: "ICU-02", status: "In Use", lastMaintenance: "2026-01-15", nextMaintenance: "2026-02-15" },
        { id: 3, name: "Ventilator", model: "Drager Evita", location: "Storage", status: "Available", lastMaintenance: "2026-01-20", nextMaintenance: "2026-02-20" },
        { id: 4, name: "Cardiac Monitor", model: "GE CARESCAPE", location: "ICU-03", status: "Available", lastMaintenance: "2026-01-10", nextMaintenance: "2026-02-10" },
        { id: 5, name: "Cardiac Monitor", model: "GE CARESCAPE", location: "ER-01", status: "In Use", lastMaintenance: "2026-01-10", nextMaintenance: "2026-02-10" },
        { id: 6, name: "Defibrillator", model: "Zoll R Series", location: "ER Cart", status: "Available", lastMaintenance: "2026-01-25", nextMaintenance: "2026-02-25" },
        { id: 7, name: "Oxygen Cylinder", model: "Type D", location: "Storage A", status: "Available", lastMaintenance: "2026-01-01", nextMaintenance: "2026-04-01" },
        { id: 8, name: "Oxygen Cylinder", model: "Type D", location: "ICU-01", status: "In Use", lastMaintenance: "2026-01-01", nextMaintenance: "2026-04-01" },
        { id: 9, name: "Infusion Pump", model: "Baxter Sigma", location: "Pharmacy", status: "Maintenance", lastMaintenance: "2026-01-28", nextMaintenance: "2026-01-30" },
        { id: 10, name: "X-Ray Machine", model: "Siemens Ysio", location: "Radiology", status: "Available", lastMaintenance: "2026-01-05", nextMaintenance: "2026-02-05" },
        { id: 11, name: "MRI Scanner", model: "GE Signa", location: "Radiology", status: "In Use", lastMaintenance: "2026-01-12", nextMaintenance: "2026-02-12" },
        { id: 12, name: "Ultrasound", model: "Philips EPIQ", location: "OB/GYN", status: "Available", lastMaintenance: "2026-01-18", nextMaintenance: "2026-02-18" }
    ],

    // Summary Stats
    summary: {
        beds: { total: 500, available: 127, occupied: 335, critical: 38 },
        staff: { total: 420, onDuty: 201, available: 45, onLeave: 174 },
        equipment: { total: 350, available: 156, inUse: 178, maintenance: 16 }
    }
};
