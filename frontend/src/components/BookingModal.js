import React, { useState, useContext } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
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

const createBooking = async (bookingData) => {
  const { data } = await axios.post('/api/bookings', bookingData);
  return data;
};

const BookingModal = ({ open, handleClose, room }) => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    title: '',
    description: '',
  });

  const mutation = useMutation(createBooking, {
    onSuccess: () => {
      queryClient.invalidateQueries('rooms');
      handleClose();
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ ...formData, room: room._id, user: user._id });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Book {room.name}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField name="startTime" label="Start Time" type="datetime-local" fullWidth margin="normal" onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField name="endTime" label="End Time" type="datetime-local" fullWidth margin="normal" onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField name="title" label="Title" fullWidth margin="normal" onChange={handleChange} />
          <TextField name="description" label="Description" fullWidth margin="normal" multiline rows={4} onChange={handleChange} />
          <Button type="submit" variant="contained" color="primary">Book</Button>
        </form>
      </Box>
    </Modal>
  );
};

export default BookingModal;