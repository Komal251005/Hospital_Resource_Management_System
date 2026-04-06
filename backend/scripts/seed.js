/**
 * Database Seed Script
 * =====================
 * Populates MongoDB with:
 * - 1 Admin user and 1 Receptionist user
 * - 8 hospital resources (beds, ICU, ventilators, etc.)
 * - 60 days of historical DailyData (for ML training)
 * - 5 sample EmergencyCases
 *
 * Usage: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Resource = require('../models/Resource');
const EmergencyCase = require('../models/EmergencyCase');
const DailyData = require('../models/DailyData');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes('<USERNAME>')) {
  console.error('❌ Please set a valid MONGODB_URI in server/.env before seeding.');
  process.exit(1);
}

// ── Seed Data ────────────────────────────────────────────────────────────────

const users = [
  {
    name: 'Dr. Admin Singh',
    email: 'admin@hospital.com',
    password: 'Admin@123',
    role: 'Admin',
  },
  {
    name: 'Priya Receptionist',
    email: 'receptionist@hospital.com',
    password: 'Recept@123',
    role: 'Receptionist',
  },
];

const resources = [
  { resourceName: 'General Beds', category: 'Bed', total: 200, available: 80 },
  { resourceName: 'ICU Beds', category: 'Bed', total: 50, available: 15 },
  { resourceName: 'Emergency Beds', category: 'Bed', total: 30, available: 10 },
  { resourceName: 'Ventilators', category: 'Equipment', total: 40, available: 18 },
  { resourceName: 'Oxygen Cylinders', category: 'Equipment', total: 100, available: 45 },
  { resourceName: 'ECG Machines', category: 'Equipment', total: 20, available: 8 },
  { resourceName: 'Doctors (On Duty)', category: 'Staff', total: 60, available: 25 },
  { resourceName: 'Nurses (On Duty)', category: 'Staff', total: 120, available: 50 },
];

const emergencies = [
  {
    patientName: 'Rahul Kumar',
    age: 45,
    severity: 'Critical',
    requiredResources: ['ICU Beds', 'Ventilators'],
    status: 'Active',
    notes: 'Multiple organ failure',
  },
  {
    patientName: 'Sunita Patel',
    age: 62,
    severity: 'High',
    requiredResources: ['ICU Beds', 'Oxygen Cylinders'],
    status: 'Active',
    notes: 'Cardiac arrest, stabilized',
  },
  {
    patientName: 'Arjun Mehta',
    age: 28,
    severity: 'Medium',
    requiredResources: ['General Beds'],
    status: 'Resolved',
    notes: 'Fracture, treated and discharged',
  },
  {
    patientName: 'Kavya Sharma',
    age: 8,
    severity: 'High',
    requiredResources: ['Emergency Beds', 'Oxygen Cylinders'],
    status: 'Pending',
    notes: 'Severe asthma attack',
  },
  {
    patientName: 'Mohammed Ansari',
    age: 55,
    severity: 'Low',
    requiredResources: ['General Beds'],
    status: 'Resolved',
    notes: 'Mild fever, observation only',
  },
];

/**
 * Generate 60 days of realistic historical DailyData
 * using sine wave variation to simulate real patterns
 */
const generateDailyData = () => {
  const data = [];
  const today = new Date();

  for (let i = 60; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);

    // Simulate seasonal variation
    const basePatients = 120 + Math.round(30 * Math.sin(i / 10));
    const noise = Math.round((Math.random() - 0.5) * 20);
    const patients = Math.max(80, basePatients + noise);

    data.push({
      date,
      patients,
      bedsUsed: Math.round(patients * 0.65 + Math.random() * 10),
      icuUsed: Math.round(patients * 0.12 + Math.random() * 3),
      ventilatorsUsed: Math.round(patients * 0.08 + Math.random() * 2),
      emergencyCases: Math.round(patients * 0.05 + Math.random() * 3),
      discharges: Math.round(patients * 0.4 + Math.random() * 8),
    });
  }

  return data;
};

// ── Seed Function ─────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clean existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Resource.deleteMany({}),
      EmergencyCase.deleteMany({}),
      DailyData.deleteMany({}),
    ]);

    // Seed users
    console.log('👤 Seeding users...');
    const createdUsers = await User.create(users);
    const adminUser = createdUsers.find((u) => u.role === 'Admin');

    // Seed resources
    console.log('🏥 Seeding resources...');
    await Resource.create(
      resources.map((r) => ({ ...r, updatedBy: adminUser._id }))
    );

    // Seed emergencies
    console.log('🚨 Seeding emergency cases...');
    await EmergencyCase.create(
      emergencies.map((e) => ({ ...e, handledBy: adminUser._id }))
    );

    // Seed daily data
    console.log('📊 Seeding 60 days of historical data...');
    const dailyData = generateDailyData();
    await DailyData.insertMany(
      dailyData.map((d) => ({ ...d, recordedBy: adminUser._id }))
    );

    console.log('\n✅ Seed completed successfully!');
    console.log('─────────────────────────────────');
    console.log('🔑 Demo Credentials:');
    console.log('   Admin       → admin@hospital.com        / Admin@123');
    console.log('   Receptionist→ receptionist@hospital.com / Recept@123');
    console.log('📡 API Docs: http://localhost:5000/api-docs');
    console.log('─────────────────────────────────\n');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    if (error.message.includes('ECONNREFUSED') || error.message.includes('timed out')) {
      console.error('   → Check your MONGODB_URI in server/.env');
    }
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();
