# Hospital Resource Optimization System
## Day 2: System Requirements & Frontend Scope Analysis

**Project Title:** Hospital Resource Optimization System Using Predictive Analytics Under Emergency Surges  
**Date:** January 30, 2026  
**Phase:** Requirements Analysis & Frontend Planning

---

## 1. System Requirements Analysis

### 1.1 Functional Requirements

#### FR-01: User Authentication
- User login with email and password
- Role-based access (Admin, Doctor, Nurse, Resource Manager)
- JWT token-based session management
- Secure logout functionality

#### FR-02: Dashboard Module
- Display real-time resource availability summary
- Show key metrics: Total Beds, ICU Capacity, Available Staff, Equipment Status
- Emergency occupancy status indicator
- Quick navigation to all modules

#### FR-03: Analytics Module
- Historical patient inflow visualization (Line Chart)
- Resource utilization trends (Bar Chart)
- Emergency vs Non-Emergency case distribution (Pie Chart)
- Date range and resource type filters
- Predictive analytics display (future scope)

#### FR-04: Resource Management Module
- Tabular view of all hospital resources
- Categories: Beds (General, ICU, Emergency), Staff, Equipment
- Real-time status indicators (Available, Occupied, Critical, Maintenance)
- Filter and search functionality
- Resource allocation interface

#### FR-05: Emergency Status Module
- Current surge risk level display (Low, Moderate, High, Critical)
- Alert banners for predicted surges
- Historical surge data visualization
- Emergency response team status

---

### 1.2 Non-Functional Requirements

| Requirement | Description |
|-------------|-------------|
| **Responsiveness** | UI must adapt to desktop, tablet, and mobile screens |
| **Performance** | Dashboard should load within 2 seconds |
| **Usability** | Intuitive navigation with minimal learning curve |
| **Accessibility** | Color-coded indicators with text labels |
| **Scalability** | Modular architecture for future enhancements |

---

## 2. Frontend Scope & User Flow

### 2.1 Pages & Components Structure

```
src/
├── pages/
│   ├── Login.jsx           ✅ Implemented
│   ├── Dashboard.jsx       🔄 Basic (needs enhancement)
│   ├── Analytics.jsx       ⬜ To be implemented
│   ├── ResourceManagement.jsx  ⬜ To be implemented
│   └── EmergencyStatus.jsx     ⬜ To be implemented
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Card.jsx
│   ├── dashboard/
│   │   ├── StatCard.jsx
│   │   ├── OccupancyIndicator.jsx
│   │   └── QuickActions.jsx
│   ├── analytics/
│   │   ├── LineChart.jsx
│   │   ├── BarChart.jsx
│   │   └── PieChart.jsx
│   └── resources/
│       ├── ResourceTable.jsx
│       └── StatusBadge.jsx
├── services/
│   └── api.js              (Mock API calls)
├── data/
│   └── mockData.js         (Dummy JSON data)
└── utils/
    └── helpers.js
```

### 2.2 User Flow Diagram

```
┌─────────────┐
│   Login     │
│    Page     │
└──────┬──────┘
       │ Valid Credentials
       ▼
┌─────────────────────────────────────────────────────┐
│                    DASHBOARD                         │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐         │
│  │   Beds    │ │    ICU    │ │   Staff   │         │
│  │  Status   │ │  Status   │ │  On Duty  │         │
│  └───────────┘ └───────────┘ └───────────┘         │
│                                                      │
│  ┌────────────────────────────────────────┐         │
│  │     Emergency Occupancy Indicator      │         │
│  └────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────┘
       │
       ├──────────────┬──────────────┬──────────────┐
       ▼              ▼              ▼              ▼
┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
│ Analytics │  │ Resource  │  │ Emergency │  │  Logout   │
│   Page    │  │ Mgmt Page │  │  Status   │  │           │
└───────────┘  └───────────┘  └───────────┘  └───────────┘
```

---

## 3. Key Resources to Track

### 3.1 Hospital Resources Matrix

| Resource Category | Sub-Types | Tracking Metrics |
|-------------------|-----------|------------------|
| **Beds** | General Ward, ICU, Emergency, Pediatric, Maternity | Total, Available, Occupied, Reserved |
| **Staff** | Doctors, Nurses, Technicians, Support Staff | On-Duty, Available, On-Leave |
| **Equipment** | Ventilators, Oxygen Cylinders, Monitors, Defibrillators | Available, In-Use, Under Maintenance |
| **Supplies** | PPE Kits, Medicines, Blood Units | Stock Level, Critical Threshold |

### 3.2 Emergency Surge Levels

| Level | Color | Occupancy % | Action Required |
|-------|-------|-------------|-----------------|
| **Low** | 🟢 Green | 0-50% | Normal operations |
| **Moderate** | 🟡 Yellow | 51-70% | Monitor closely |
| **High** | 🟠 Orange | 71-85% | Prepare contingency |
| **Critical** | 🔴 Red | 86-100% | Emergency protocols |

---

## 4. Technology Stack (Frontend)

| Technology | Purpose | Version |
|------------|---------|---------|
| **React.js** | UI Framework | 19.x |
| **React Router DOM** | Navigation | 7.x |
| **Tailwind CSS** | Styling | 4.x |
| **React Icons** | Icon Library | 5.x |
| **Recharts** | Data Visualization | (To be added) |
| **Axios** | HTTP Client | (To be added) |

---

## 5. Similar Hospital Dashboard Systems Studied

### 5.1 Reference Systems

1. **Epic Systems Dashboard**
   - Real-time bed management
   - Patient flow visualization
   - Integration with EHR

2. **Cerner Command Center**
   - Predictive analytics for patient surges
   - Resource allocation optimization
   - Emergency department tracking

3. **Philips Hospital Patient Flow**
   - Visual bed board
   - Capacity planning tools
   - Staff scheduling integration

### 5.2 Key Insights Applied

- **Card-based metrics** for quick overview
- **Color-coded indicators** for immediate status recognition
- **Sidebar navigation** for easy module switching
- **Responsive charts** for trend analysis
- **Alert banners** for critical notifications

---

## 6. Day 2 Deliverables Checklist

- [x] System requirements documented
- [x] Functional modules identified
- [x] Frontend scope finalized
- [x] User flow defined
- [x] Hospital resources categorized
- [x] Technology stack confirmed
- [x] Reference systems studied

---

## 7. Next Steps (Day 3)

- [ ] Design high-level system architecture diagram
- [ ] Define frontend–backend interaction flow
- [ ] Create detailed wireframe for dashboard page
- [ ] Prepare component hierarchy diagram

---

*Document prepared as part of Semester VI Project*
