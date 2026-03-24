import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import AuthLoadingScreen from './AuthLoadingScreen';

const LOGIN_BY_AREA = {
  admin: '/admin/login',
  courier: '/courier/login',
};

export default function ProtectedRoute({ children, area = 'admin' }) {
  const { isLoading, isAuthenticated } = useAuth0();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen message="Checking your SmartCargo session..." />;
  }

  if (!isAuthenticated) {
    const loginPath = LOGIN_BY_AREA[area] || '/account-selection';
    return <Navigate to={loginPath} replace state={{ returnTo: location.pathname + location.search }} />;
  }

  return children;
}
