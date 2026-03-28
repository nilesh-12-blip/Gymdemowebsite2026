const express = require('express');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify user JWT
const verifyUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.body.token;
  if (!token) return res.status(401).json({ message: 'Login required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'apexgym2024_supersecret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// @route   POST /api/bookings
// @desc    Book a class (requires login)
router.post('/', verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const { className, day, time } = req.body;
    const booking = new Booking({ 
      userId: req.userId, 
      userName: user.name, 
      className, 
      day, 
      time 
    });
    await booking.save();

    res.status(201).json({ message: `Booked ${className} successfully!` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

