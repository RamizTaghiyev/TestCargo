import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthActions } from '../../auth/useAuthActions';
import '../../components/auth/AuthUI.css';

export default function AdminSignIn() {
  const { beginLogin } = useAuthActions();
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      await beginLogin({ role: 'admin', rememberMe, mode: 'login', returnTo: '/admin/dashboard' });
    } catch (err) {
      setError(err?.message || 'Unable to start sign in.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">SmartCargo Admin</div>
        <h1>Admin sign in</h1>
        <p>Use your administrator credentials to access SmartCargo control features.</p>
        {error && <div className="error-box">{error}</div>}
        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Keep me signed in on this device
          </label>
          <div className="auth-actions">
            <button className="btn-primary" disabled={loading}>{loading ? 'Redirecting…' : 'Continue to Sign In'}</button>
            <Link className="inline-link" to="/admin/signup">Create admin account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
