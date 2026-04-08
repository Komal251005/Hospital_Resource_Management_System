# 🏥 Hospital Resource Management System with Predictive Analytics

A full-stack Hospital Resource Management System designed to efficiently
manage hospital resources such as beds, staff, and equipment. The system
also integrates Machine Learning to predict resource demand during
emergency situations.

------------------------------------------------------------------------

## 📌 Overview

This system helps hospitals to:

-   Track available resources in real-time
-   Manage patient and staff data
-   Predict future resource requirements
-   Improve decision-making during emergencies

------------------------------------------------------------------------

## 🚀 Features

### 🔹 Core Features

-   Add, update, and delete hospital resources
-   Real-time resource tracking
-   Interactive dashboard for monitoring
-   Secure authentication system

### 🔹 AI / ML Features

-   Predict resource demand using historical data
-   Analyze emergency surge patterns
-   Data-driven decision support system

------------------------------------------------------------------------

## 🛠 Tech Stack

-   Frontend: HTML, CSS, JavaScript (React)
-   Backend: Node.js, Express.js
-   Database: MongoDB Atlas
-   Machine Learning: Python (Pandas, NumPy, Scikit-learn)

------------------------------------------------------------------------

## 🔄 User Flow

Login Page → Dashboard → (Analytics \| Resource Management \| Emergency
Status \| Prediction \| Logout)

------------------------------------------------------------------------

## 📁 Project Structure
```
Hospital-Resource-Management/
│
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ ├── ml/
│ ├── config/
│ ├── utils/
│ ├── index.js
│ └── package.json
│
├── frontend/
│ ├── public/
│ │ └── index.html
│ │
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ │ ├── common/
│ │ │ ├── dashboard/
│ │ │
│ │ ├── pages/
│ │ ├── services/
│ │ ├── data/
│ │ ├── utils/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ ├── App.css
│ │ ├── index.css
│
├── .env
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```
------------------------------------------------------------------------

## ⚙️ Installation & Setup

### Clone the Repository
```
git clone
https://github.com/your-username/hospital-resource-management.git cd
hospital-resource-management
```
### Install Dependencies
```
cd backend npm install

pip install -r requirements.txt
```
### Setup Environment Variables
```
PORT=5000 MONGO_URI=your_mongodb_connection_string
```
### Run Project
```
npm start

python ml/model.py
```
------------------------------------------------------------------------

## 🔌 API Endpoints

| Endpoint          | Description               |
| ----------------- | ------------------------- |
| `/api/resources`  | Manage hospital resources |
| `/api/auth`       | Authentication            |
| `/api/prediction` | AI predictions            |
| `/api/dashboard`  | Analytics data            |


------------------------------------------------------------------------

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
------------------------------------------------------------------------

## 📜 License

Educational use only.

------------------------------------------------------------------------

## 👩‍💻 Author

Komal Mhaske
