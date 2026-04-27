import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const {isAuthenticated,loading} = useAuth(); // Replace with actual authentication logic
  
  if (loading) {
    return <div>Loading... </div>;
  }
  return isAuthenticated ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
  <Navigate to="/login" replace />
  );
}

export default ProtectedRoute
