
import React, { useState, useEffect, useContext } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const BookingModal = ({ open, handleClose, booking }) => {
  const [title, setTitle] = useState('');
  const [room, setRoom] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [rooms, setRooms] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (booking) {
      setTitle(booking.title || '');
      setRoom(booking.room?._id || '');
      setStartTime(booking.start ? new Date(booking.start).toISOString().slice(0, 16) : '');
      setEndTime(booking.end ? new Date(booking.end).toISOString().slice(0, 16) : '');
    }
    fetchRooms();
  }, [booking]);

  const fetchRooms = async () => {
    const res = await axios.get('http://localhost:5000/api/rooms');
    setRooms(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingData = { title, room, startTime, endTime };
    try {
      if (booking._id) {
        await axios.put(`http://localhost:5000/api/bookings/${booking._id}`, bookingData);
      } else {
        await axios.post('http://localhost:5000/api/bookings', bookingData);
      }
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${booking._id}`);
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {booking?._id ? 'Edit Booking' : 'New Booking'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            select
            label="Room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            fullWidth
            margin="normal"
          >
            {rooms.map((r) => (
              <MenuItem key={r._id} value={r._id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Start Time"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Time"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button type="submit" variant="contained" color="primary">
            {booking?._id ? 'Update' : 'Create'}
          </Button>
          {booking?._id && user.role === 'Admin' && (
            <Button onClick={handleDelete} variant="contained" color="secondary">
              Delete
            </Button>
          )}
        </form>
      </Box>
    </Modal>
  );
};

export default BookingModal;
