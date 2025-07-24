import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Grid, Card, CardContent, Typography, CircularProgress, Alert, Button, CardActions } from '@mui/material';
import axios from 'axios';
import BookingModal from '../components/BookingModal';

const fetchRooms = async () => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get('http://localhost:5000/api/rooms', {
    headers: { 'x-auth-token': token }
  });
  return data;
};

const Dashboard = () => {
  const { data: rooms, error, isLoading } = useQuery('rooms', fetchRooms);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (room) => {
    setSelectedRoom(room);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
    setModalOpen(false);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <>
      <Grid container spacing={3}>
        {rooms.map(room => (
          <Grid item xs={12} sm={6} md={4} key={room._id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{room.name}</Typography>
                <Typography variant="body2">Capacity: {room.capacity}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleOpenModal(room)}>
                  Book Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedRoom && (
        <BookingModal
          open={modalOpen}
          handleClose={handleCloseModal}
          room={selectedRoom}
        />
      )}
    </>
  );
};

export default Dashboard;