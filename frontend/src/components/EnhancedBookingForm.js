import React, { useState, useContext } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import RoomSelector from './RoomSelector';
import TimeSlotPicker from './TimeSlotPicker';

const steps = ['Select Date', 'Choose Time', 'Pick Room', 'Meeting Details'];

const EnhancedBookingForm = ({ onBookingCreated, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState({ start: '', end: '' });
  const [selectedRoom, setSelectedRoom] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user } = useContext(AuthContext);

  const handleNext = () => {
    setError('');
    
    if (activeStep === 0 && !selectedDate) {
      setError('Please select a date');
      return;
    }
    if (activeStep === 1 && (!selectedTime.start || !selectedTime.end)) {
      setError('Please select a time slot');
      return;
    }
    if (activeStep === 2 && !selectedRoom) {
      setError('Please select a room');
      return;
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (!meetingTitle.trim()) {
      setError('Meeting title is required');
      setLoading(false);
      return;
    }

    try {
      const startDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime.start}`);
      const endDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime.end}`);

      const bookingData = {
        title: meetingTitle.trim(),
        description: meetingDescription.trim(),
        room: selectedRoom,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString()
      };

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        bookingData,
        { headers: { 'x-auth-token': token } }
      );

      setSuccess('Meeting booked successfully!');
      
      if (onBookingCreated) {
        onBookingCreated(response.data);
      }

      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString() : '';
  };

  const formatTime = (time) => {
    if (!time.start || !time.end) return '';
    return `${time.start} - ${time.end}`;
  };

  const getRoomName = () => {
    // This would need to be populated from your rooms data
    return selectedRoom ? `Room ${selectedRoom}` : '';
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={setSelectedDate}
                minDate={new Date()}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
          </LocalizationProvider>
        );
      
      case 1:
        return (
          <TimeSlotPicker
            selectedDate={selectedDate?.toISOString().split('T')[0]}
            selectedRoom={selectedRoom}
            onTimeSelect={setSelectedTime}
            selectedTime={selectedTime}
          />
        );
      
      case 2:
        return (
          <RoomSelector
            selectedDate={selectedDate?.toISOString().split('T')[0]}
            selectedTime={selectedTime}
            onRoomSelect={setSelectedRoom}
            selectedRoom={selectedRoom}
          />
        );
      
      case 3:
        return (
          <Box>
            {/* Booking Summary */}
            <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
              <Typography variant="h6" gutterBottom>
                Booking Summary
              </Typography>
              <Typography><strong>Date:</strong> {formatDate(selectedDate)}</Typography>
              <Typography><strong>Time:</strong> {formatTime(selectedTime)}</Typography>
              <Typography><strong>Room:</strong> {getRoomName()}</Typography>
            </Paper>

            {/* Meeting Details Form */}
            <TextField
              label="Meeting Title"
              fullWidth
              margin="normal"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              required
            />
            
            <TextField
              label="Meeting Description"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={meetingDescription}
              onChange={(e) => setMeetingDescription(e.target.value)}
              placeholder="Add agenda, attendees, or other details..."
            />
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Book a Meeting Room
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3, minHeight: 400 }}>
        {getStepContent(activeStep)}
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        
        {activeStep === steps.length - 1 ? (
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Book Meeting'}
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained">
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EnhancedBookingForm;
