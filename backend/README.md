# Hospital Resource Management System — Backend

> Node.js + Express + MongoDB Atlas backend with Python ML predictions.

---

## 📁 Folder Structure

```
server/
├── config/
│   └── db.js                  # MongoDB Atlas connection
├── models/
│   ├── User.js                # Users (Admin / Receptionist)
│   ├── Resource.js            # Hospital resources
│   ├── EmergencyCase.js       # Emergency case tracking
│   └── DailyData.js           # Historical data (ML training)
├── controllers/
│   ├── authController.js
│   ├── dashboardController.js
│   ├── resourceController.js
│   ├── emergencyController.js
│   └── analyticsController.js
├── routes/
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── resourceRoutes.js
│   ├── emergencyRoutes.js
│   └── analyticsRoutes.js
├── middleware/
│   ├── authMiddleware.js      # JWT verify + role guard
│   ├── validate.js            # express-validator chains
│   ├── errorHandler.js        # Global error handler
│   └── logger.js              # Winston + Morgan
├── ml/
│   ├── predict.py             # scikit-learn regression model
│   └── requirements.txt
├── utils/
│   └── pythonBridge.js        # child_process.spawn wrapper
├── swagger/
│   └── swagger.js             # OpenAPI 3.0 docs
├── scripts/
│   └── seed.js                # DB seed script
├── logs/                      # Auto-created on first run
├── .env                       # ← Edit this!
├── .env.example
├── package.json
└── index.js                   # Entry point
```

---

## ⚙️ Step 1 — Configure MongoDB Atlas

Edit **`server/.env`** and replace the placeholder:

```env
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/hospitalDB?retryWrites=true&w=majority
```

**How to get your connection string:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click your cluster → **Connect** → **Drivers**
3. Select **Node.js** → Copy the connection string
4. Replace `<USERNAME>` and `<PASSWORD>` with your credentials
5. Replace `<CLUSTER>` with your cluster name

> ⚠️ Add your **IP address** to the Atlas Network Access list (or use `0.0.0.0/0` for any IP during development).

---

## 🚀 Step 2 — Start the Backend

```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB Atlas Connected: cluster0.xxxxx.mongodb.net
🚀 Hospital Resource API running on http://localhost:5000
📚 Swagger Docs: http://localhost:5000/api-docs
```

---

## 🌱 Step 3 — Seed the Database

```bash
cd server
npm run seed
```

This creates:
- ✅ **2 users** (Admin + Receptionist)
- ✅ **8 resources** (beds, ICU, ventilators, staff, etc.)
- ✅ **5 emergency cases**
- ✅ **60 days of historical data** (for ML model training)

**Demo credentials after seeding:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | Admin@123 |
| Receptionist | receptionist@hospital.com | Recept@123 |

---

## 📚 Step 4 — Explore the API

Open Swagger UI: **http://localhost:5000/api-docs**

Click **Authorize** → paste the JWT token from login.

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | 🔒 Any | Get current user |

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/summary` | 🔒 Any | Aggregated stats |

### Resources
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/resources` | 🔒 Any | List all resources |
| POST | `/api/resources` | 🔒 Admin | Create resource |
| PUT | `/api/resources/:id` | 🔒 Any | Update resource |
| DELETE | `/api/resources/:id` | 🔒 Admin | Delete resource |

### Emergency
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/emergency` | 🔒 Any | List cases (paginated) |
| POST | `/api/emergency` | 🔒 Any | Create emergency case |
| PUT | `/api/emergency/:id/status` | 🔒 Any | Update case status |

### Analytics
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/analytics/predict` | 🔒 Any | ML prediction (5 days) |
| GET | `/api/analytics/daily` | 🔒 Any | Historical daily data |
| POST | `/api/analytics/daily` | 🔒 Admin | Save daily record |

---

## 🤖 ML Prediction

**Endpoint:** `POST /api/analytics/predict`

**Request:**
```json
{ "patients": 150 }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "inputPatients": 150,
    "predictions": [
      { "day": 1, "date": "2026-04-02", "expectedPatients": 150, "bedsRequired": 98, "icuRequired": 18, "ventilatorsRequired": 12 },
      ...
    ],
    "summary": {
      "avgBedsRequired": 97,
      "avgIcuRequired": 18,
      "avgVentilatorsRequired": 11,
      "peakBedsRequired": 102
    },
    "modelInfo": {
      "algorithm": "Polynomial Regression (degree 2)",
      "trainingSamples": 60
    }
  }
}
```

> ⚠️ Run `npm run seed` first — the ML model needs at least 5 days of historical data.

---

## 🧪 Quick Test (Postman / curl)

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"Admin@123"}'

# 2. Use returned token for protected routes
curl http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer <TOKEN>"

# 3. Get resources
curl http://localhost:5000/api/resources \
  -H "Authorization: Bearer <TOKEN>"

# 4. ML Prediction
curl -X POST http://localhost:5000/api/analytics/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"patients": 150}'
```

---

## 🎨 Frontend

The Vite/React frontend runs on **port 5173**:
```bash
# From project root
npm run dev
```

The frontend's `src/services/api.js` is already wired to the backend — no further changes needed.

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED` on MongoDB | Check `MONGODB_URI` in `server/.env`; verify Atlas IP whitelist |
| `python not found` | Set `PYTHON_PATH=python3` (or full path) in `server/.env` |
| `Not enough historical data` | Run `npm run seed` first |
| CORS error from frontend | Ensure `FRONTEND_URL=http://localhost:5173` in `server/.env` |
| Port 5000 in use | Change `PORT=5001` in `server/.env` and `VITE_API_URL` in root `.env` |
