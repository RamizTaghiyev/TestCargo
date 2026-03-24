import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserRole } from '../../auth/useUserRole';
import AuthLoadingScreen from './AuthLoadingScreen';
import UnauthorizedPage from '../pages/UnauthorizedPage';

export default function RoleProtectedRoute({ children, allowedRole, fallbackPath }) {
  const { isLoading, isAuthenticated } = useAuth0();
  const role = useUserRole();

  if (isLoading) {
    return <AuthLoadingScreen message="Loading account permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath || '/account-selection'} replace />;
  }

  if (!role) {
    return <AuthLoadingScreen message="Finalizing account permissions..." />;
  }

  if (role !== allowedRole) {
    return <UnauthorizedPage currentRole={role} />;
  }

  return children;
}
