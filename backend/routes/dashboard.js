const express = require('express');
const router = express.Router();
const { Employee, Project, LeaveRequest } = require('../models');
const { Op } = require('sequelize');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total employees
    const totalEmployees = await Employee.count();

    // Get employees on bench
    const benchEmployees = await Employee.count({
      where: { status: 'BENCH' }
    });

    // Get ongoing projects
    const ongoingProjects = await Project.count({
      where: { status: 'ACTIVE' }
    });

    // Get project headcount distribution
    const projects = await Project.findAll({
      attributes: ['name', 'offshore_headcount', 'onsite_headcount']
    });

    const projectData = projects.map(project => ({
      name: project.name,
      offshore: project.offshore_headcount,
      onsite: project.onsite_headcount
    }));

    // Get employee status distribution
    const employeeStatuses = await Employee.findAll({
      attributes: ['status'],
      group: ['status']
    });

    const employeeStatusData = employeeStatuses.map(status => ({
      name: status.status,
      value: status.count
    }));

    // Get pending leave requests
    const pendingLeaves = await LeaveRequest.count({
      where: { status: 'PENDING' }
    });

    // Get employees on bench for more than 30 days
    const longBenchEmployees = await Employee.findAll({
      where: {
        status: 'BENCH',
        last_bench_date: {
          [Op.lte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    res.json({
      totalEmployees,
      benchEmployees,
      ongoingProjects,
      projectData,
      employeeStatusData,
      pendingLeaves,
      longBenchEmployees: longBenchEmployees.length
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 