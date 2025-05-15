const express = require('express');
const router = express.Router();
const { Employee } = require('../models');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Validation middleware
const validateEmployee = [
  body('employee_code').notEmpty().withMessage('Employee code is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('date_of_joining').isDate().withMessage('Valid date of joining is required'),
  body('status').isIn(['ACTIVE', 'BENCH', 'ON_LEAVE', 'TERMINATED']).withMessage('Invalid status'),
  body('phone_number').optional().isMobilePhone().withMessage('Invalid phone number')
];

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});

// Get single employee
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Failed to fetch employee' });
  }
});

// Create employee
router.post('/', validateEmployee, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingEmployee = await Employee.findOne({
      where: {
        [Op.or]: [
          { employee_code: req.body.employee_code },
          { email: req.body.email }
        ]
      }
    });

    if (existingEmployee) {
      return res.status(400).json({ 
        message: 'Employee with this code or email already exists' 
      });
    }

    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Failed to create employee' });
  }
});

// Update employee
router.put('/:id', validateEmployee, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check for duplicate email/employee_code
    const existingEmployee = await Employee.findOne({
      where: {
        [Op.or]: [
          { employee_code: req.body.employee_code },
          { email: req.body.email }
        ],
        id: { [Op.ne]: req.params.id }
      }
    });

    if (existingEmployee) {
      return res.status(400).json({ 
        message: 'Employee with this code or email already exists' 
      });
    }

    await employee.update(req.body);
    res.json(employee);
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Failed to update employee' });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.destroy();
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Failed to delete employee' });
  }
});

module.exports = router; 