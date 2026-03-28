const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// @route   POST /api/messages
// @desc    Send contact message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const msg = new Message({ name, email, subject, message });
    await msg.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

