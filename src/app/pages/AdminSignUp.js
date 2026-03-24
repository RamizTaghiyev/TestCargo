import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { authConfig } from '../../auth/authConfig';
import { setRememberMePreference } from '../../auth/rememberMe';
import AuthLayout from '../components/AuthLayout';

export default function AdminSignUp() {
  const { loginWithRedirect, error, isLoading } = useAuth0();
  const [rememberMe, setRememberMe] = useState(true);

  const startSignUp = async () => {
    setRememberMePreference(rememberMe);
    await loginWithRedirect({
      appState: { returnTo: '/admin/dashboard', role: 'admin' },
      authorizationParams: {
        connection: authConfig.adminConnection,
        screen_hint: 'signup',
      },
    });
  };

  return (
    <AuthLayout title="Create admin account" subtitle="Register as SmartCargo administrator.">
      <div className="auth-grid">
        {error ? <div className="auth-error">{error.message}</div> : null}
        <label className="auth-checkbox">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          Keep me signed in
        </label>
        <button disabled={isLoading} className="auth-button primary" onClick={startSignUp}>Create admin account</button>
      </div>
      <div className="auth-footer">Already have an admin account? <Link to="/admin/login">Sign in</Link></div>
    </AuthLayout>
  );
}
