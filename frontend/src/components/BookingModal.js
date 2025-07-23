
import React, { useState, useContext } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Button, 
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import EnhancedBookingForm from './EnhancedBookingForm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  maxHeight: '90vh',
  overflow: 'auto',
};

const BookingModal = ({ open, handleClose, booking, onBookingUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);

  const handleBookingSubmit = async (bookingData) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      let response;
      
      if (booking && booking._id) {
        response = await axios.put(
          `http://localhost:5000/api/bookings/${booking._id}`, 
          bookingData,
          { headers: { 'x-auth-token': token } }
        );
        setSuccess('Booking updated successfully!');
      } else {
        response = await axios.post(
          'http://localhost:5000/api/bookings', 
          bookingData,
          { headers: { 'x-auth-token': token } }
        );
        setSuccess('Booking created successfully!');
      }
      
      // Call the callback to refresh the parent component
      if (onBookingUpdate) {
        onBookingUpdate();
      }
      
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/bookings/${booking._id}`, {
        headers: { 'x-auth-token': token }
      });
      setSuccess('Booking deleted successfully!');
      
      if (onBookingUpdate) {
        onBookingUpdate();
      }
      
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h5" component="h2">
            {booking?._id ? 'Edit Booking' : 'New Booking'}
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <EnhancedBookingForm
            initialData={booking}
            onSubmit={handleBookingSubmit}
            loading={loading}
          />

          {/* Delete Button for existing bookings */}
          {booking?._id && (user.role === 'Admin' || booking.user._id === user.id) && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Button 
                onClick={handleDelete} 
                variant="outlined" 
                color="error"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : null}
                fullWidth
              >
                Delete Booking
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default BookingModal;
