const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const { Op } = require('sequelize');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// Validation middleware
const validateNotification = [
  check('type').isIn(['BENCH_ALERT', 'LEAVE_APPROVAL']).withMessage('Invalid notification type'),
  check('message').notEmpty().withMessage('Message is required')
];

// Get all notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({ is_read: true });
    res.json(notification);
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notification
router.post('/', [auth, validateNotification], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, message } = req.body;
    const notification = await Notification.create({
      type,
      message,
      is_read: false
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread notifications count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Notification.count({
      where: { is_read: false }
    });
    res.json({ count });
  } catch (error) {
    console.error('Get unread notifications count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 