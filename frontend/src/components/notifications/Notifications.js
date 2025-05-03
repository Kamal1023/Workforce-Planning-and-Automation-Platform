import React, { useState, useEffect } from 'react';
import { Badge, ListGroup, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchNotifications();
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setError(null);
      const response = await axios.get(`${apiUrl}/api/notifications`);
      setNotifications(response.data);
    } catch (error) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      setError(null);
      await axios.put(`${apiUrl}/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      setError('Failed to mark notification as read');
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'BENCH_ALERT':
        return 'warning';
      case 'LEAVE_APPROVAL':
        return 'info';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <h3 className="mb-3">Notifications</h3>
      
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <ListGroup>
        {notifications.map((notification) => (
          <ListGroup.Item
            key={notification.id}
            action
            onClick={() => handleNotificationClick(notification)}
            className={!notification.is_read ? 'fw-bold' : ''}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Badge bg={getBadgeVariant(notification.type)} className="me-2">
                  {notification.type.replace('_', ' ')}
                </Badge>
                {notification.message}
              </div>
              <small className="text-muted">
                {new Date(notification.created_at).toLocaleString()}
              </small>
            </div>
          </ListGroup.Item>
        ))}
        {notifications.length === 0 && (
          <ListGroup.Item>No notifications</ListGroup.Item>
        )}
      </ListGroup>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notification Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNotification && (
            <>
              <p><strong>Type:</strong> {selectedNotification.type.replace('_', ' ')}</p>
              <p><strong>Message:</strong> {selectedNotification.message}</p>
              <p><strong>Date:</strong> {new Date(selectedNotification.created_at).toLocaleString()}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Notifications; 