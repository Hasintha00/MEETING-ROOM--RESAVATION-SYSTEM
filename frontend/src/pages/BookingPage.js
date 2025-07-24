import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  IconButton,
  Tabs,
  Tab,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ExitToApp as LogoutIcon,
  CalendarToday as CalendarIcon,
  Room as RoomIcon
} from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import RoomSelector from '../components/RoomSelector';

const BookingPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Booking States
  const [selectedRoom, setSelectedRoom] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  
  // Edit Booking States
  const [editDialog, setEditDialog] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  
  // View Booking States
  const [viewDialog, setViewDialog] = useState(false);
  const [viewingBooking, setViewingBooking] = useState(null);
  
  // Alert States
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/rooms', {
        headers: { 'x-auth-token': token }
      });
      setRooms(response.data);
    } catch (error) {
      showAlert('Error fetching rooms', 'error');
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/bookings', {
        headers: { 'x-auth-token': token }
      });
      setBookings(response.data);
    } catch (error) {
      showAlert('Error fetching bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleCreateBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/bookings', {
        roomId: selectedRoom,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        purpose
      }, {
        headers: { 'x-auth-token': token }
      });
      
      resetBookingForm();
      fetchBookings();
      showAlert('Booking created successfully!');
    } catch (error) {
      showAlert(error.response?.data?.msg || 'Error creating booking', 'error');
    }
  };

  const handleEditBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/bookings/${editingBooking._id}`, {
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        purpose
      }, {
        headers: { 'x-auth-token': token }
      });
      
      setEditDialog(false);
      setEditingBooking(null);
      fetchBookings();
      showAlert('Booking updated successfully!');
    } catch (error) {
      showAlert(error.response?.data?.msg || 'Error updating booking', 'error');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
          headers: { 'x-auth-token': token }
        });
        
        fetchBookings();
        showAlert('Booking deleted successfully!');
      } catch (error) {
        showAlert(error.response?.data?.msg || 'Error deleting booking', 'error');
      }
    }
  };

  const openEditDialog = (booking) => {
    setEditingBooking(booking);
    setStartTime(new Date(booking.startTime).toISOString().slice(0, 16));
    setEndTime(new Date(booking.endTime).toISOString().slice(0, 16));
    setPurpose(booking.purpose);
    setEditDialog(true);
  };

  const openViewDialog = (booking) => {
    setViewingBooking(booking);
    setViewDialog(true);
  };

  const resetBookingForm = () => {
    setSelectedRoom('');
    setStartTime('');
    setEndTime('');
    setPurpose('');
  };

  const getRoomName = (roomId) => {
    const room = rooms.find(r => r._id === roomId);
    return room ? room.name : 'Unknown Room';
  };

  const getStatusColor = (booking) => {
    const now = new Date();
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    
    if (now > end) return 'default'; // Past
    if (now >= start && now <= end) return 'success'; // Ongoing
    return 'primary'; // Future
  };

  const getStatusText = (booking) => {
    const now = new Date();
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    
    if (now > end) return 'Completed';
    if (now >= start && now <= end) return 'Ongoing';
    return 'Scheduled';
  };

  const canEditDelete = (booking) => {
    return booking.userId._id === user.id;
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <RoomIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Meeting Room Booking System
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user?.name}
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Book a Room" icon={<AddIcon />} />
            <Tab label="All Reservations" icon={<CalendarIcon />} />
          </Tabs>
        </Box>

        {/* Book a Room Tab */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h4" gutterBottom>
              Book a Meeting Room
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <RoomSelector 
                  selectedRoom={selectedRoom}
                  onRoomSelect={setSelectedRoom}
                  startTime={startTime}
                  endTime={endTime}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Booking Details
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        label="Start Time"
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                      />
                      
                      <TextField
                        fullWidth
                        label="End Time"
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Purpose"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        margin="normal"
                        multiline
                        rows={3}
                      />
                      
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleCreateBooking}
                        disabled={!selectedRoom || !purpose || !startTime || !endTime}
                        sx={{ mt: 2 }}
                      >
                        Book Room
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* All Reservations Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h4" gutterBottom>
              All Reservations
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Room</TableCell>
                    <TableCell>Booked By</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Purpose</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{getRoomName(booking.roomId)}</TableCell>
                      <TableCell>{booking.userId.name}</TableCell>
                      <TableCell>{formatDateTime(booking.startTime)}</TableCell>
                      <TableCell>{formatDateTime(booking.endTime)}</TableCell>
                      <TableCell>{booking.purpose}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusText(booking)} 
                          color={getStatusColor(booking)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => openViewDialog(booking)}>
                          <ViewIcon />
                        </IconButton>
                        {canEditDelete(booking) && (
                          <>
                            <IconButton onClick={() => openEditDialog(booking)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDeleteBooking(booking._id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Container>

      {/* Edit Booking Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Start Time"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              label="End Time"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              label="Purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditBooking} variant="contained">
            Update Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Booking Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {viewingBooking && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Room:</strong> {getRoomName(viewingBooking.roomId)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Booked By:</strong> {viewingBooking.userId.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Start Time:</strong> {formatDateTime(viewingBooking.startTime)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>End Time:</strong> {formatDateTime(viewingBooking.endTime)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Purpose:</strong> {viewingBooking.purpose}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong>{' '}
                <Chip 
                  label={getStatusText(viewingBooking)} 
                  color={getStatusColor(viewingBooking)}
                  size="small"
                />
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookingPage;
