
import React from 'react';
import BookingsCalendar from './BookingsCalendar';
import { Container, Typography } from '@mui/material';

const StaffDashboard = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Staff Dashboard
      </Typography>
      <BookingsCalendar />
    </Container>
  );
};

export default StaffDashboard;
