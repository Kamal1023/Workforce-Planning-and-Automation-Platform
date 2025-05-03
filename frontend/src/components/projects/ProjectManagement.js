import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    project_code: '',
    name: '',
    customer_name: '',
    offshore_headcount: 0,
    onsite_headcount: 0,
    status: 'ACTIVE'
  });

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/projects`);
      setProjects(response.data);
    } catch (error) {
      setError('Failed to fetch projects');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await axios.put(`${apiUrl}/api/projects/${editingProject.id}`, formData);
      } else {
        await axios.post(`${apiUrl}/api/projects`, formData);
      }
      setShowModal(false);
      fetchProjects();
      resetForm();
    } catch (error) {
      setError('Failed to save project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      project_code: project.project_code,
      name: project.name,
      customer_name: project.customer_name,
      offshore_headcount: project.offshore_headcount,
      onsite_headcount: project.onsite_headcount,
      status: project.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`${apiUrl}/api/projects/${id}`);
        fetchProjects();
      } catch (error) {
        setError('Failed to delete project');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      project_code: '',
      name: '',
      customer_name: '',
      offshore_headcount: 0,
      onsite_headcount: 0,
      status: 'ACTIVE'
    });
    setEditingProject(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Project Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Project
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Project Code</th>
            <th>Name</th>
            <th>Customer</th>
            <th>Offshore Headcount</th>
            <th>Onsite Headcount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.project_code}</td>
              <td>{project.name}</td>
              <td>{project.customer_name}</td>
              <td>{project.offshore_headcount}</td>
              <td>{project.onsite_headcount}</td>
              <td>{project.status}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProject ? 'Edit Project' : 'Add Project'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Project Code</Form.Label>
              <Form.Control
                type="text"
                name="project_code"
                value={formData.project_code}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Offshore Headcount</Form.Label>
              <Form.Control
                type="number"
                name="offshore_headcount"
                value={formData.offshore_headcount}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Onsite Headcount</Form.Label>
              <Form.Control
                type="number"
                name="onsite_headcount"
                value={formData.onsite_headcount}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingProject ? 'Update' : 'Add'} Project
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProjectManagement; 