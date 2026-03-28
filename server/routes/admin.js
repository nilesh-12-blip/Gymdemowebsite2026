const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Review = require('../models/Review');
const Message = require('../models/Message');
const Booking = require('../models/Booking');
const router = express.Router();

// Middleware to verify admin JWT
const verifyAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'apexgym2024_supersecret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// @route   POST /api/admin/login
// @desc    Admin login (admin@apexgym.com / admin123)
router.post('/login', async (req, res) => {
  try {
    const { id, password } = req.body;
    if (id !== 'admin' || password !== 'admin123') {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Verify admin user exists
    let admin = await User.findOne({ email: 'admin@apexgym.com' });
    if (!admin) {
      return res.status(401).json({ message: 'Admin not seeded. Run /api/auth/admin/register first' });
    }

    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET || 'apexgym2024_supersecret', { expiresIn: '7d' });
    res.json({ token, message: 'Admin login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const members = await User.countDocuments();
    const bookings = await Booking.countDocuments();
    const reviews = await Review.countDocuments();
    const messages = await Message.countDocuments();

    // Membership distribution
    const planCounts = await User.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } }
    ]);

    // Bookings by class (sample classes)
    const classCounts = await Booking.aggregate([
      { $group: { _id: '$className', count: { $sum: 1 } } }
    ]);

    res.json({ 
      members, 
      bookings, 
      reviews, 
      messages,
      planCounts: Object.fromEntries(planCounts.map(p => [p._id, p.count])),
      classCounts: Object.fromEntries(classCounts.map(c => [c._id, c.count]))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/bookings
router.get('/bookings', verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId', 'name').sort({ createdAt: -1 }).limit(50);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE booking
router.delete('/bookings/:id', verifyAdmin, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Similar routes for members, reviews, messages...
router.get('/members', verifyAdmin, async (req, res) => {
  try {
    const members = await User.find({}, 'name email plan joinedAt').sort({ joinedAt: -1 }).limit(50);
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/reviews', verifyAdmin, async (req, res) => {
  try {
    const reviews = await Review.find().populate('userId', 'name').sort({ createdAt: -1 }).limit(50);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/reviews/:id', verifyAdmin, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/messages', verifyAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/messages/:id', verifyAdmin, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

