import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthActions } from '../../auth/useAuthActions';
import '../../components/auth/AuthUI.css';

export default function AdminSignUp() {
  const { beginLogin } = useAuthActions();
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      await beginLogin({ role: 'admin', rememberMe, mode: 'signup', returnTo: '/admin/dashboard' });
    } catch (err) {
      setError(err?.message || 'Unable to start sign up.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">SmartCargo Admin</div>
        <h1>Create admin account</h1>
        <p>Register a new administrator account in SmartCargo.</p>
        {error && <div className="error-box">{error}</div>}
        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Keep me signed in on this device
          </label>
          <div className="auth-actions">
            <button className="btn-primary" disabled={loading}>{loading ? 'Redirecting…' : 'Continue to Sign Up'}</button>
            <Link className="inline-link" to="/admin/login">I already have an admin account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
