import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { LocationOn, People, Wifi, Computer, Coffee, DirectionsCar } from '@mui/icons-material';
import axios from 'axios';


const RoomSelector = ({ selectedRoom, onRoomSelect, startTime, endTime }) => {
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/rooms', {
        headers: { 'x-auth-token': token }
      });
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailableRooms = React.useCallback(async () => {
    if (!startTime || !endTime) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/rooms/available?startTime=${startTime}&endTime=${endTime}`,
        { headers: { 'x-auth-token': token } }
      );
      setAvailableRooms(response.data);
    } catch (error) {
      console.error('Error checking room availability:', error);
      setAvailableRooms([]);
    }
  }, [startTime, endTime]);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (startTime && endTime) {
      checkAvailableRooms();
    }
  }, [startTime, endTime, checkAvailableRooms]);

  const isRoomAvailable = (roomId) => {
    if (!startTime || !endTime) return true;
    return availableRooms.some(room => room._id === roomId);
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': <Wifi sx={{ fontSize: 16 }} />,
      'Projector': <Computer sx={{ fontSize: 16 }} />,
      'Whiteboard': <Computer sx={{ fontSize: 16 }} />,
      'Coffee Machine': <Coffee sx={{ fontSize: 16 }} />,
      'Parking': <DirectionsCar sx={{ fontSize: 16 }} />,
    };
    return icons[amenity] || null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Select a Meeting Room
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose from our available meeting spaces
      </Typography>
      
      <Grid container spacing={2}>
        {rooms.map((room) => {
          const available = isRoomAvailable(room._id);
          const isSelected = selectedRoom === room._id;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={room._id}>
              <Card 
                onClick={() => available && onRoomSelect(room._id)}
                sx={{
                  opacity: available ? 1 : 0.6,
                  border: isSelected ? 2 : 1,
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  cursor: available ? 'pointer' : 'not-allowed',
                  '&:hover': available ? {
                    borderColor: 'primary.light',
                    transform: 'translateY(-2px)',
                  } : {}
                }}
              >
                <CardHeader>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box>
                      <CardTitle>{room.name}</CardTitle>
                      <CardDescription>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <LocationOn sx={{ fontSize: 14 }} />
                          {room.location}
                        </Box>
                      </CardDescription>
                    </Box>
                    <Badge variant={available ? "success" : "destructive"}>
                      {available ? "Available" : "Booked"}
                    </Badge>
                  </Box>
                </CardHeader>
                
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" fontWeight={500}>
                      Capacity: {room.capacity} people
                    </Typography>
                  </Box>
                  
                  {room.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {room.description}
                    </Typography>
                  )}
                  
                  {room.amenities && room.amenities.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Amenities:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {room.amenities.map((amenity, index) => (
                          <Badge 
                            key={index} 
                            variant="outline"
                          >
                            {getAmenityIcon(amenity)}
                            {amenity}
                          </Badge>
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  <Button 
                    fullWidth
                    variant={isSelected ? "contained" : "outline"}
                    disabled={!available}
                    sx={{ mt: 1 }}
                  >
                    {isSelected ? 'Selected' : available ? 'Select Room' : 'Unavailable'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default RoomSelector;
