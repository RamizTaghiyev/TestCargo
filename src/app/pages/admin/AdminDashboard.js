import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import AuthLayout from '../../components/AuthLayout';

export default function AdminDashboard() {
  const { user, logout } = useAuth0();

  return (
    <AuthLayout title="Admin dashboard" subtitle={`Signed in as ${user?.email || 'admin user'}`}>
      <div className="auth-grid">
        <Link className="auth-button secondary" to="/admin/couriers/create">Create courier account</Link>
        <Link className="auth-button secondary" to="/admin/analytics">Analytics</Link>
        <button className="auth-button primary" onClick={() => logout({ logoutParams: { returnTo: `${window.location.origin}/account-selection` } })}>Sign out</button>
      </div>
    </AuthLayout>
  );
}
