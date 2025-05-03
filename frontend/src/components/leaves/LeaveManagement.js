import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  });

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/leaves`);
      setLeaves(response.data);
    } catch (error) {
      setError('Failed to fetch leave requests');
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
      await axios.post(`${apiUrl}/api/leaves`, formData);
      setShowModal(false);
      fetchLeaves();
      resetForm();
    } catch (error) {
      setError('Failed to submit leave request');
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${apiUrl}/api/leaves/${id}/approve`);
      fetchLeaves();
    } catch (error) {
      setError('Failed to approve leave request');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`${apiUrl}/api/leaves/${id}/reject`);
      fetchLeaves();
    } catch (error) {
      setError('Failed to reject leave request');
    }
  };

  const resetForm = () => {
    setFormData({
      start_date: '',
      end_date: '',
      reason: ''
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge bg="warning">Pending</Badge>;
      case 'APPROVED':
        return <Badge bg="success">Approved</Badge>;
      case 'REJECTED':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Leave Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Apply for Leave
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td>{leave.employee.name}</td>
              <td>{new Date(leave.start_date).toLocaleDateString()}</td>
              <td>{new Date(leave.end_date).toLocaleDateString()}</td>
              <td>{leave.reason}</td>
              <td>{getStatusBadge(leave.status)}</td>
              <td>
                {leave.status === 'PENDING' && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleApprove(leave.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(leave.id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Apply for Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit Leave Request
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LeaveManagement; 