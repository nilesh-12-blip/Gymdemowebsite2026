const express = require('express');
const Review = require('../models/Review');
const router = express.Router();

// @route   POST /api/reviews
// @desc    Add new review (public)
router.post('/', async (req, res) => {
  try {
    const { name, rating, text } = req.body;
    
    const review = new Review({ name, rating, text });
    await review.save();

    // Return recent reviews
    const recent = await Review.find().sort({ createdAt: -1 }).limit(10);
    res.status(201).json({ message: 'Review added', reviews: recent });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews
// @desc    Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(20);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

