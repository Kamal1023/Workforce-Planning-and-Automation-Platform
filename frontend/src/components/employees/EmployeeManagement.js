import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employee_code: '',
    skillset: '',
    location: '',
    date_of_joining: ''
  });

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/employees`);
      setEmployees(response.data);
    } catch (error) {
      setError('Failed to fetch employees');
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
      if (editingEmployee) {
        await axios.put(`${apiUrl}/api/employees/${editingEmployee.id}`, formData);
      } else {
        await axios.post(`${apiUrl}/api/employees`, formData);
      }
      setShowModal(false);
      fetchEmployees();
      resetForm();
    } catch (error) {
      setError('Failed to save employee');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      employee_code: employee.employee_code,
      skillset: employee.skillset,
      location: employee.location,
      date_of_joining: employee.date_of_joining
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${apiUrl}/api/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        setError('Failed to delete employee');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      employee_code: '',
      skillset: '',
      location: '',
      date_of_joining: ''
    });
    setEditingEmployee(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employee Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Employee
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Employee Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Skillset</th>
            <th>Location</th>
            <th>Date of Joining</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.employee_code}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.skillset}</td>
              <td>{employee.location}</td>
              <td>{new Date(employee.date_of_joining).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(employee)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(employee.id)}
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
          <Modal.Title>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Employee Code</Form.Label>
              <Form.Control
                type="text"
                name="employee_code"
                value={formData.employee_code}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Skillset</Form.Label>
              <Form.Control
                type="text"
                name="skillset"
                value={formData.skillset}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date of Joining</Form.Label>
              <Form.Control
                type="date"
                name="date_of_joining"
                value={formData.date_of_joining}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingEmployee ? 'Update' : 'Add'} Employee
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmployeeManagement; 