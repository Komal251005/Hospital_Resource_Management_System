# Hospital Resource Management System with Predictive Analytics

This project is a Hospital Resource Management System designed to efficiently manage hospital resources such as beds, staff, and equipment. It also integrates Machine Learning (AI) to predict resource demand during emergency situations.

## The system helps hospitals:

Track available resources
Manage patient and staff data
Predict future resource requirements
Improve decision-making during high demand

## Features

🔹 Core Features
Add, update, and delete hospital resources
Real-time resource tracking
Dashboard for monitoring hospital data
Authentication system for secure access
🔹 AI / ML Features
Predict resource demand using historical data
Analyze emergency surge patterns
Data-driven decision support system

## Tech Stack
Frontend : HTML CSS JavaScript
Backend : Node.js Express.js
Database : MongoDB (Atlas)
Machine Learning : Python (Libraries: Pandas, NumPy, Scikit-learn)

## User Flow Diagram

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


## Project Structure

Hospital-Resource-Management/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── ml/                # ML prediction logic
│   ├── config/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
├── frontend/
|   ├── public/                     # Static files
│       └── index.html
├── src/
│   │
│   ├── assets/                # Images, icons, styles
│   │
│   ├── components/
│   │   ├── common/            # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── dashboard/         # Dashboard-specific components
│   │   │   ├── AlertCard.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── OccupancyIndicator.jsx
│   │   │   └── index.js
│   │
│   ├── pages/                 # Main pages (routing level)
│   │   ├── Dashboard.jsx
│   │   ├── Analytics.jsx
│   │   ├── EmergencyStatus.jsx
│   │   ├── Prediction.jsx
│   │   ├── ResourceManagement.jsx
│   │   └── Login.jsx
│   │
│   ├── services/              # API calls (VERY GOOD 👍 you already have this)
│   │   ├── api.js
│   │   ├── predictionService.js
│   │
│   ├── data/                  # Mock or static data
│   │   ├── mockData.js
│   │   ├── resourceData.js
│   │   ├── emergencyData.js
│   │
│   ├── utils/                 # Helper functions (ADD THIS 🔥)
│   │   └── formatters.js
│   │
│   ├── App.jsx                # Main app
│   ├── main.jsx               # Entry point
│   ├── App.css
│   ├── index.css
│
├── .env
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

## Installation & Setup

1️⃣ Clone the repository
git clone https://github.com/your-username/hospital-resource-management.git
cd hospital-resource-management

2️⃣ Install dependencies
Backend
cd backend
npm install
ML (Python)
pip install -r requirements.txt

3️⃣ Setup Environment Variables

Create a .env file in backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string

4️⃣ Run the project
Start Backend
npm start
Run ML Model (if separate)
python ml/model.py

5️⃣ API Endpoints (Sample)
/api/resources → Manage resources
/api/auth → Authentication
/api/prediction → AI predictions
/api/dashboard → Analytics data

## Contributing

Contributions are welcome!
Feel free to fork this repo and submit a pull request.

## License

This project is for educational purposes.

## Author

Komal Mhaske