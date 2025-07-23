
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AdminDashboard from '../components/AdminDashboard';
import StaffDashboard from '../components/StaffDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return user.role === 'Admin' ? <AdminDashboard /> : <StaffDashboard />;
};

export default Dashboard;
