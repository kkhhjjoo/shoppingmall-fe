import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ permissionLevel }) => {
  const { user, loading } = useSelector((state) => state.user);
  if (loading) return null;
  const isAuthenticated = user?.level === permissionLevel || user?.level === 'admin';

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
