import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProviderWithConfig } from './auth/AuthProviderWithConfig';
import RoleProtectedRoute from './components/routing/RoleProtectedRoute';
import AccountSelection from './pages/AccountSelection';
import AdminSignIn from './pages/admin/AdminSignIn';
import AdminSignUp from './pages/admin/AdminSignUp';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateCourierAccountPage from './pages/admin/CreateCourierAccountPage';
import CourierSignIn from './pages/courier/CourierSignIn';
import CourierDashboard from './components/CourierDashboard';
import AuthCallbackPage from './pages/AuthCallbackPage';

function App() {
  return (
    <Router>
      <AuthProviderWithConfig>
        <Routes>
          <Route path="/" element={<Navigate to="/account-selection" replace />} />
          <Route path="/account-selection" element={<AccountSelection />} />
          <Route path="/admin/login" element={<AdminSignIn />} />
          <Route path="/admin/signup" element={<AdminSignUp />} />
          <Route path="/courier/login" element={<CourierSignIn />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          <Route path="/admin/dashboard" element={<RoleProtectedRoute requiredRole="admin" loginPath="/admin/login"><AdminDashboard /></RoleProtectedRoute>} />
          <Route path="/admin/analytics" element={<RoleProtectedRoute requiredRole="admin" loginPath="/admin/login"><AdminDashboard /></RoleProtectedRoute>} />
          <Route path="/admin/settings" element={<RoleProtectedRoute requiredRole="admin" loginPath="/admin/login"><AdminDashboard /></RoleProtectedRoute>} />
          <Route path="/admin/profile" element={<RoleProtectedRoute requiredRole="admin" loginPath="/admin/login"><AdminDashboard /></RoleProtectedRoute>} />
          <Route path="/admin/couriers/create" element={<RoleProtectedRoute requiredRole="admin" loginPath="/admin/login"><CreateCourierAccountPage /></RoleProtectedRoute>} />

          <Route path="/courier/dashboard" element={<RoleProtectedRoute requiredRole="courier" loginPath="/courier/login"><CourierDashboard /></RoleProtectedRoute>} />
          <Route path="/courier/profile" element={<RoleProtectedRoute requiredRole="courier" loginPath="/courier/login"><CourierDashboard /></RoleProtectedRoute>} />
          <Route path="/courier/settings" element={<RoleProtectedRoute requiredRole="courier" loginPath="/courier/login"><CourierDashboard /></RoleProtectedRoute>} />
          <Route path="/courier/notifications" element={<RoleProtectedRoute requiredRole="courier" loginPath="/courier/login"><CourierDashboard /></RoleProtectedRoute>} />
          <Route path="/courier/packages/:id" element={<RoleProtectedRoute requiredRole="courier" loginPath="/courier/login"><CourierDashboard /></RoleProtectedRoute>} />
        </Routes>
      </AuthProviderWithConfig>
    </Router>
  );
}

export default App;
