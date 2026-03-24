import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthActions } from '../../auth/useAuthActions';
import { useAuthUser } from '../../auth/AuthProviderWithConfig';
import '../../components/auth/AuthUI.css';

export default function AdminDashboard() {
  const { user } = useAuthUser();
  const { logoutToPublic } = useAuthActions();

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">SmartCargo Admin</div>
        <h1>Welcome, {user?.name || user?.email}</h1>
        <p>Manage analytics, settings, and courier credentials.</p>
        <div className="auth-actions">
          <Link className="btn-primary" to="/admin/couriers/create">Create courier account</Link>
          <button className="btn-secondary" onClick={logoutToPublic}>Sign out</button>
        </div>
      </div>
    </div>
  );
}
