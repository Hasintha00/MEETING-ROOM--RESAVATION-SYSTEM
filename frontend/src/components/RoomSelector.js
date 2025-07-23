import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { LocationOn, People, Wifi, Computer, Coffee, DirectionsCar } from '@mui/icons-material';


const RoomSelector = ({ selectedRoom, onRoomSelect, startTime, endTime }) => {
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (startTime && endTime) {
      checkAvailableRooms();
    }
  }, [startTime, endTime]);

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

  const checkAvailableRooms = async () => {
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
  };

  const isRoomAvailable = (roomId) => {
    if (!startTime || !endTime) return true;
    return availableRooms.some(room => room._id === roomId);
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': <Wifi className="h-4 w-4" />,
      'Projector': <Monitor className="h-4 w-4" />,
      'Whiteboard': <Monitor className="h-4 w-4" />,
      'Coffee Machine': <Coffee className="h-4 w-4" />,
      'Parking': <Car className="h-4 w-4" />,
    };
    return icons[amenity] || <div className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select a Meeting Room</h3>
        <p className="text-sm text-muted-foreground">
          Choose from our available meeting spaces
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => {
          const available = isRoomAvailable(room._id);
          const isSelected = selectedRoom === room._id;
          
          return (
            <Card 
              key={room._id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary' 
                  : available 
                    ? 'hover:border-primary/50' 
                    : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => available && onRoomSelect(room._id)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {room.location}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={available ? "success" : "destructive"}
                    className="text-xs"
                  >
                    {available ? "Available" : "Booked"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Capacity: {room.capacity} people
                  </span>
                </div>
                
                {room.description && (
                  <p className="text-sm text-muted-foreground">
                    {room.description}
                  </p>
                )}
                
                {room.amenities && room.amenities.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Amenities:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.map((amenity, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs flex items-center gap-1"
                        >
                          {getAmenityIcon(amenity)}
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  className={`w-full mt-3 ${isSelected ? 'bg-primary' : ''}`}
                  variant={isSelected ? "default" : "outline"}
                  disabled={!available}
                >
                  {isSelected ? 'Selected' : available ? 'Select Room' : 'Unavailable'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoomSelector;
