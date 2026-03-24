import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuthUser } from '../../auth/AuthProviderWithConfig';

export default function RoleProtectedRoute({ children, requiredRole, loginPath }) {
  return (
    <ProtectedRoute loginPath={loginPath}>
      <RoleGate requiredRole={requiredRole}>{children}</RoleGate>
    </ProtectedRoute>
  );
}

function RoleGate({ requiredRole, children }) {
  const { role } = useAuthUser();

  if (role === requiredRole) return children;

  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'courier') return <Navigate to="/courier/dashboard" replace />;

  return <Navigate to="/account-selection" replace />;
}
