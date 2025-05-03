const express = require('express');
const router = express.Router();
const { Project, ProjectResource, Employee } = require('../models');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: ProjectResource,
          include: [Employee]
        }
      ]
    });
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: ProjectResource,
          include: [Employee]
        }
      ]
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.update(req.body);
    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.destroy();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign resource to project
router.post('/:id/resources', async (req, res) => {
  try {
    const { employee_id, role, start_date, end_date } = req.body;
    const projectResource = await ProjectResource.create({
      project_id: req.params.id,
      employee_id,
      role,
      start_date,
      end_date
    });
    res.status(201).json(projectResource);
  } catch (error) {
    console.error('Assign resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 