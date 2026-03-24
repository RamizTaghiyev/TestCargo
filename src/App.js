import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import AuthProviderWithConfig from './auth/AuthProviderWithConfig';
import { APP_ROLES } from './auth/roleClaims';
import ProtectedRoute from './app/components/ProtectedRoute';
import RoleProtectedRoute from './app/components/RoleProtectedRoute';
import AccountSelection from './app/pages/AccountSelection';
import AdminSignIn from './app/pages/AdminSignIn';
import AdminSignUp from './app/pages/AdminSignUp';
import CourierSignIn from './app/pages/courier/CourierSignIn';
import AuthCallbackPage from './app/pages/AuthCallbackPage';
import AdminDashboard from './app/pages/admin/AdminDashboard';
import AdminCreateCourierPage from './app/pages/admin/AdminCreateCourierPage';
import CourierDashboardPage from './app/pages/courier/CourierDashboardPage';
import GenericPage from './app/pages/GenericPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/account-selection" replace />} />
      <Route path="/account-selection" element={<AccountSelection />} />
      <Route path="/admin/login" element={<AdminSignIn />} />
      <Route path="/admin/signup" element={<AdminSignUp />} />
      <Route path="/courier/login" element={<CourierSignIn />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute area="admin"><RoleProtectedRoute allowedRole={APP_ROLES.ADMIN}><AdminDashboard /></RoleProtectedRoute></ProtectedRoute>}
      />
      <Route
        path="/admin/analytics"
        element={<ProtectedRoute area="admin"><RoleProtectedRoute allowedRole={APP_ROLES.ADMIN}><GenericPage title="Admin analytics" /></RoleProtectedRoute></ProtectedRoute>}
      />
      <Route
        path="/admin/settings"
        element={<ProtectedRoute area="admin"><RoleProtectedRoute allowedRole={APP_ROLES.ADMIN}><GenericPage title="Admin settings" /></RoleProtectedRoute></ProtectedRoute>}
      />
      <Route
        path="/admin/profile"
        element={<ProtectedRoute area="admin"><RoleProtectedRoute allowedRole={APP_ROLES.ADMIN}><GenericPage title="Admin profile" /></RoleProtectedRoute></ProtectedRoute>}
      />
      <Route
        path="/admin/couriers/create"
        element={<ProtectedRoute area="admin"><RoleProtectedRoute allowedRole={APP_ROLES.ADMIN}><AdminCreateCourierPage /></RoleProtectedRoute></ProtectedRoute>}
      />

      <Route
        path="/courier/dashboard"
        element={<ProtectedRoute area="courier"><RoleProtectedRoute allowedRole={APP_ROLES.COURIER}><CourierDashboardPage /></RoleProtectedRoute></ProtectedRoute>}
      />
      <Route
        path="/courier/profile"
        element={<ProtectedRoute area="courier"><RoleProtectedRoute allowedRole={APP_ROLES.COURIER}><GenericPage title="Courier profile" /></RoleProtectedRoute></ProtectedRoute>}
      />
      <Route
        path="/courier/settings"
        element={<ProtectedRoute area="courier"><RoleProtectedRoute allowedRole={APP_ROLES.COURIER}><GenericPage title="Courier settings" /></RoleProtectedRoute></ProtectedRoute>}
      />
      <Route
        path="/courier/notifications"
        element={<ProtectedRoute area="courier"><RoleProtectedRoute allowedRole={APP_ROLES.COURIER}><GenericPage title="Courier notifications" /></RoleProtectedRoute></ProtectedRoute>}
      />
      <Route
        path="/courier/packages/:id"
        element={<ProtectedRoute area="courier"><RoleProtectedRoute allowedRole={APP_ROLES.COURIER}><GenericPage title="Courier package details" /></RoleProtectedRoute></ProtectedRoute>}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProviderWithConfig>
        <AppRoutes />
      </AuthProviderWithConfig>
    </Router>
  );
}
