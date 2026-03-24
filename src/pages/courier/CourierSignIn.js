import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthActions } from '../../auth/useAuthActions';
import '../../components/auth/AuthUI.css';

export default function CourierSignIn() {
  const { beginLogin } = useAuthActions();
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      await beginLogin({ role: 'courier', rememberMe, mode: 'login', returnTo: '/courier/dashboard' });
    } catch (err) {
      setError(err?.message || 'Unable to start sign in.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">SmartCargo Courier</div>
        <h1>Courier sign in</h1>
        <p>Courier accounts are provisioned by your administrator. Sign-up is disabled.</p>
        {error && <div className="error-box">{error}</div>}
        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Keep me signed in on this device
          </label>
          <div className="auth-actions">
            <button className="btn-primary" disabled={loading}>{loading ? 'Redirecting…' : 'Continue to Sign In'}</button>
            <Link className="inline-link" to="/account-selection">Back</Link>
          </div>
        </form>
        <p className="text-muted">Forgot password? Contact your administrator or use the reset link on the Auth0 hosted prompt.</p>
      </div>
    </div>
  );
}
