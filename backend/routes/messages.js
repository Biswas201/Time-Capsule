const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

// Rate limiting
const messageLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'You can only send 5 messages per day',
});

// @route   POST api/messages
// @desc    Create a new time capsule message
// @access  Private
router.post(
  '/',
  [
    auth,
    messageLimiter,
    [
      check('recipientEmail', 'Please include a valid email').isEmail(),
      check('subject', 'Subject is required').not().isEmpty(),
      check('body', 'Message body is required').not().isEmpty(),
      check('deliveryDate', 'Please include a valid delivery date').isISO8601(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipientEmail, subject, body, deliveryDate } = req.body;

    try {
      // Check if delivery date is in the future
      const deliveryDateObj = new Date(deliveryDate);
      if (deliveryDateObj <= new Date()) {
        return res.status(400).json({ msg: 'Delivery date must be in the future' });
      }

      const newMessage = new Message({
        sender: req.user.id,
        recipientEmail,
        subject,
        body,
        deliveryDate: deliveryDateObj,
      });

      const message = await newMessage.save();

      // Log this activity
      await logActivity(req.user.id, 'message_created', `Created message ${message._id}`);

      res.json(message);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/messages/sent
// @desc    Get all sent messages by user
// @access  Private
router.get('/sent', auth, async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user.id })
      .sort({ createdAt: -1 })
      .populate('sender', ['name', 'email']);
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/messages/received
// @desc    Get all received messages by user
// @access  Private
router.get('/received', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const messages = await Message.find({ 
      recipientEmail: user.email,
      isDelivered: true
    })
      .sort({ deliveredAt: -1 })
      .populate('sender', ['name', 'email']);
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// Helper function to log activities
async function logActivity(userId, action, details) {
  const ActivityLog = require('../models/ActivityLog');
  const log = new ActivityLog({
    user: userId,
    action,
    details,
  });
  await log.save();
}

module.exports = router;