import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  Button,
  TextField,
  Alert
} from '@mui/material';
import axios from 'axios';

const RoomSelector = ({ selectedDate, selectedTime, onRoomSelect, selectedRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedTime.start && selectedTime.end) {
      checkAvailability();
    }
  }, [selectedDate, selectedTime]);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/rooms', {
        headers: { 'x-auth-token': token }
      });
      setRooms(res.data);
    } catch (err) {
      setError('Failed to fetch rooms');
    }
  };

  const checkAvailability = async () => {
    setLoading(true);
    try {
      const startTime = new Date(`${selectedDate}T${selectedTime.start}`).toISOString();
      const endTime = new Date(`${selectedDate}T${selectedTime.end}`).toISOString();
      
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/rooms/available?startTime=${startTime}&endTime=${endTime}`,
        { headers: { 'x-auth-token': token } }
      );
      setAvailableRooms(res.data);
    } catch (err) {
      setError('Failed to check room availability');
      setAvailableRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const isRoomAvailable = (roomId) => {
    return availableRooms.some(room => room._id === roomId);
  };

  const getRoomTypeColor = (roomName) => {
    if (roomName.toLowerCase().includes('auditorium')) return '#e91e63';
    if (roomName.toLowerCase().includes('meeting')) return '#2196f3';
    return '#4caf50';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select a Room
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={2}>
        {rooms.map((room) => {
          const available = isRoomAvailable(room._id);
          const isSelected = selectedRoom === room._id;
          
          return (
            <Grid item xs={12} md={4} key={room._id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  '&:hover': {
                    boxShadow: 3,
                  },
                  opacity: selectedDate && selectedTime.start && !available ? 0.6 : 1,
                }}
                onClick={() => available && onRoomSelect(room._id)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="h3">
                      {room.name}
                    </Typography>
                    <Chip
                      label={room.name.toLowerCase().includes('auditorium') ? 'Auditorium' : 'Meeting Room'}
                      size="small"
                      sx={{ backgroundColor: getRoomTypeColor(room.name), color: 'white' }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Capacity: {room.capacity} people
                  </Typography>
                  
                  {room.location && (
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Location: {room.location}
                    </Typography>
                  )}
                  
                  {room.description && (
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {room.description}
                    </Typography>
                  )}
                  
                  {room.amenities && room.amenities.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {room.amenities.map((amenity, index) => (
                        <Chip 
                          key={index} 
                          label={amenity} 
                          size="small" 
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {selectedDate && selectedTime.start ? (
                      <Chip 
                        label={available ? "Available" : "Booked"} 
                        color={available ? "success" : "error"} 
                        size="small"
                      />
                    ) : (
                      <Chip 
                        label="Select time to check availability" 
                        color="default" 
                        size="small"
                      />
                    )}
                    
                    {isSelected && (
                      <Chip 
                        label="Selected" 
                        color="primary" 
                        size="small"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      
      {loading && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography>Checking availability...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default RoomSelector;
