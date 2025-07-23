import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Alert,
  Chip,
  Paper
} from '@mui/material';
import axios from 'axios';

const TimeSlotPicker = ({ selectedDate, selectedRoom, onTimeSelect, selectedTime }) => {
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');
  const [suggestedSlots, setSuggestedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [error, setError] = useState('');

  // Predefined time slots
  const predefinedSlots = [
    { start: '09:00', end: '10:00', label: '9:00 AM - 10:00 AM' },
    { start: '10:00', end: '11:00', label: '10:00 AM - 11:00 AM' },
    { start: '11:00', end: '12:00', label: '11:00 AM - 12:00 PM' },
    { start: '12:00', end: '13:00', label: '12:00 PM - 1:00 PM' },
    { start: '13:00', end: '14:00', label: '1:00 PM - 2:00 PM' },
    { start: '14:00', end: '15:00', label: '2:00 PM - 3:00 PM' },
    { start: '15:00', end: '16:00', label: '3:00 PM - 4:00 PM' },
    { start: '16:00', end: '17:00', label: '4:00 PM - 5:00 PM' },
    { start: '17:00', end: '18:00', label: '5:00 PM - 6:00 PM' },
  ];

  useEffect(() => {
    if (selectedDate && selectedRoom) {
      fetchBookedSlots();
    }
  }, [selectedDate, selectedRoom]);

  const fetchBookedSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      const startOfDay = new Date(`${selectedDate}T00:00:00`).toISOString();
      const endOfDay = new Date(`${selectedDate}T23:59:59`).toISOString();
      
      const res = await axios.get(
        `http://localhost:5000/api/bookings/date-range?startDate=${startOfDay}&endDate=${endOfDay}`,
        { headers: { 'x-auth-token': token } }
      );
      
      const roomBookings = res.data.filter(booking => 
        booking.room._id === selectedRoom && booking.status === 'Active'
      );
      
      setBookedSlots(roomBookings);
    } catch (err) {
      setError('Failed to fetch booked slots');
    }
  };

  const isSlotBooked = (startTime, endTime) => {
    const slotStart = new Date(`${selectedDate}T${startTime}`);
    const slotEnd = new Date(`${selectedDate}T${endTime}`);
    
    return bookedSlots.some(booking => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      
      return (
        (slotStart >= bookingStart && slotStart < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (slotStart <= bookingStart && slotEnd >= bookingEnd)
      );
    });
  };

  const validateCustomTime = () => {
    if (!customStartTime || !customEndTime) {
      setError('Please select both start and end times');
      return false;
    }
    
    if (customStartTime >= customEndTime) {
      setError('End time must be after start time');
      return false;
    }
    
    const now = new Date();
    const selectedDateTime = new Date(`${selectedDate}T${customStartTime}`);
    
    if (selectedDateTime < now) {
      setError('Cannot book time in the past');
      return false;
    }
    
    if (isSlotBooked(customStartTime, customEndTime)) {
      setError('This time slot conflicts with an existing booking');
      return false;
    }
    
    return true;
  };

  const handleCustomTimeSelect = () => {
    setError('');
    if (validateCustomTime()) {
      onTimeSelect({ start: customStartTime, end: customEndTime });
    }
  };

  const handlePredefinedSlotSelect = (slot) => {
    if (!isSlotBooked(slot.start, slot.end)) {
      onTimeSelect({ start: slot.start, end: slot.end });
    }
  };

  const isSlotSelected = (slot) => {
    return selectedTime.start === slot.start && selectedTime.end === slot.end;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Time Slot
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {/* Predefined Time Slots */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Quick Select (1-hour slots)
        </Typography>
        <Grid container spacing={1}>
          {predefinedSlots.map((slot, index) => {
            const booked = isSlotBooked(slot.start, slot.end);
            const selected = isSlotSelected(slot);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Button
                  variant={selected ? "contained" : "outlined"}
                  color={booked ? "error" : selected ? "primary" : "inherit"}
                  fullWidth
                  disabled={booked}
                  onClick={() => handlePredefinedSlotSelect(slot)}
                  sx={{ 
                    py: 1,
                    opacity: booked ? 0.5 : 1,
                  }}
                >
                  {slot.label}
                  {booked && (
                    <Chip 
                      label="Booked" 
                      size="small" 
                      color="error" 
                      sx={{ ml: 1 }}
                    />
                  )}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
      
      {/* Custom Time Selection */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Custom Time Range
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Start Time"
              type="time"
              value={customStartTime}
              onChange={(e) => setCustomStartTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="End Time"
              type="time"
              value={customEndTime}
              onChange={(e) => setCustomEndTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              onClick={handleCustomTimeSelect}
              fullWidth
              disabled={!customStartTime || !customEndTime}
            >
              Select Custom Time
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Show existing bookings for the day */}
      {bookedSlots.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Existing Bookings for This Room:
          </Typography>
          {bookedSlots.map((booking, index) => (
            <Chip
              key={index}
              label={`${booking.title} (${new Date(booking.startTime).toLocaleTimeString()} - ${new Date(booking.endTime).toLocaleTimeString()})`}
              color="error"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TimeSlotPicker;
