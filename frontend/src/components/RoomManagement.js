
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await axios.get('http://localhost:5000/api/rooms');
    setRooms(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomData = { name, capacity };
    try {
      if (editingRoom) {
        await axios.put(`http://localhost:5000/api/rooms/${editingRoom._id}`, roomData);
      } else {
        await axios.post('http://localhost:5000/api/rooms', roomData);
      }
      fetchRooms();
      setName('');
      setCapacity('');
      setEditingRoom(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setName(room.name);
    setCapacity(room.capacity);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`);
      fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Room Management</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Room Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Capacity"
          type="number"
          fullWidth
          margin="normal"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          {editingRoom ? 'Update Room' : 'Add Room'}
        </Button>
      </form>
      <List>
        {rooms.map((room) => (
          <ListItem key={room._id}>
            <ListItemText primary={room.name} secondary={`Capacity: ${room.capacity}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(room)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(room._id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default RoomManagement;
