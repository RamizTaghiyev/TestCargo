import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { authConfig } from '../../auth/authConfig';
import { setRememberMePreference } from '../../auth/rememberMe';
import AuthLayout from '../components/AuthLayout';

export default function AdminSignIn() {
  const { loginWithRedirect, error, isLoading } = useAuth0();
  const location = useLocation();
  const [rememberMe, setRememberMe] = useState(true);

  const returnTo = location.state?.returnTo || '/admin/dashboard';

  const startLogin = async () => {
    setRememberMePreference(rememberMe);
    await loginWithRedirect({
      appState: { returnTo, role: 'admin' },
      authorizationParams: {
        connection: authConfig.adminConnection,
        screen_hint: 'login',
      },
    });
  };

  return (
    <AuthLayout title="Admin sign in" subtitle="Access SmartCargo operations and courier management.">
      <div className="auth-grid">
        {error ? <div className="auth-error">{error.message}</div> : null}
        <div className="auth-row">
          <label className="auth-checkbox">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            Remember me on this device
          </label>
        </div>
        <button disabled={isLoading} className="auth-button primary" onClick={startLogin}>Continue with SmartCargo Admin</button>
      </div>
      <div className="auth-footer">
        New admin? <Link to="/admin/signup">Create an admin account</Link>
      </div>
    </AuthLayout>
  );
}
