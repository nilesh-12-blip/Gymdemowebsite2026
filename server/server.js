const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/bookings', require('./routes/bookings'));

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'APEX GYM API v1.0 — Running 💪' });
});

// Serve frontend index.html for all unmatched routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MongoDB Connection + Admin Seeding
async function startServer() {
  try {
    await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/apexgym');
    console.log('✅ MongoDB Connected: apexgym');

    // Auto-seed admin user if not exists
    const User = require('./models/User');
    const adminExists = await User.findOne({ email: 'admin@apexgym.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'APEX Admin',
        email: 'admin@apexgym.com',
        password: 'admin123',
        isAdmin: true,
        plan: 'elite'
      });
      await admin.save();
      console.log('✅ Admin user seeded (admin / admin123)');
    } else {
      console.log('✅ Admin user exists');
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 APEX GYM Server running on http://localhost:${PORT}`);
      console.log(`📁 Frontend served from: ${path.join(__dirname, 'public')}`);
      console.log(`🔑 Admin login: admin / admin123`);
    });
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('');
    console.log('💡 Make sure MongoDB is running. Options:');
    console.log('   1. Install MongoDB Community: https://www.mongodb.com/try/download/community');
    console.log('   2. Use MongoDB Atlas (cloud): Update DB_URI in .env');
    console.log('   3. Run: mongod --dbpath ./data');
    process.exit(1);
  }
}

startServer();
