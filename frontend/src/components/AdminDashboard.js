
import React from 'react';
import BookingsCalendar from './BookingsCalendar';
import RoomManagement from './RoomManagement';
import { Container, Typography } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <BookingsCalendar />
      <RoomManagement />
    </Container>
  );
};

export default AdminDashboard;
