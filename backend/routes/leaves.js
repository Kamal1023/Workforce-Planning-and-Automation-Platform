const express = require('express');
const router = express.Router();
const { LeaveRequest, Employee } = require('../models');

// Get all leave requests
router.get('/', async (req, res) => {
  try {
    const leaves = await LeaveRequest.findAll({
      include: [Employee]
    });
    res.json(leaves);
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create leave request
router.post('/', async (req, res) => {
  try {
    const leave = await LeaveRequest.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    console.error('Create leave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve leave request
router.put('/:id/approve', async (req, res) => {
  try {
    const leave = await LeaveRequest.findByPk(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    await leave.update({
      status: 'APPROVED',
      approved_by: req.user.id
    });

    // Update employee status
    const employee = await Employee.findByPk(leave.employee_id);
    if (employee) {
      await employee.update({ status: 'ON_LEAVE' });
    }

    res.json(leave);
  } catch (error) {
    console.error('Approve leave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject leave request
router.put('/:id/reject', async (req, res) => {
  try {
    const leave = await LeaveRequest.findByPk(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    await leave.update({
      status: 'REJECTED',
      approved_by: req.user.id
    });

    res.json(leave);
  } catch (error) {
    console.error('Reject leave error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 