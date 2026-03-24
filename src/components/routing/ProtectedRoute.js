import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { postLoginStorageKey } from '../../auth/authConfig';
import { useAuthUser } from '../../auth/AuthProviderWithConfig';
import AuthLoadingScreen from './AuthLoadingScreen';

export default function ProtectedRoute({ children, loginPath }) {
  const { isLoading, isAuthenticated } = useAuthUser();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen title="Restoring your SmartCargo session" />;
  }

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`;
    sessionStorage.setItem(postLoginStorageKey, returnTo);
    return <Navigate to={loginPath} replace />;
  }

  return children;
}
