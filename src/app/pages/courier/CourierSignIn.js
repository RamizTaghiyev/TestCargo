import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import AuthLayout from '../../components/AuthLayout';
import { authConfig } from '../../../auth/authConfig';
import { setRememberMePreference } from '../../../auth/rememberMe';

export default function CourierSignIn() {
  const { loginWithRedirect, error, isLoading } = useAuth0();
  const [rememberMe, setRememberMe] = useState(true);

  const signInCourier = async () => {
    setRememberMePreference(rememberMe);
    await loginWithRedirect({
      appState: { returnTo: '/courier/dashboard', role: 'courier' },
      authorizationParams: {
        connection: authConfig.courierConnection,
        screen_hint: 'login',
      },
    });
  };

  return (
    <AuthLayout title="Courier sign in" subtitle="Your administrator provides your credentials. Self-sign up is disabled.">
      <div className="auth-grid">
        {error ? <div className="auth-error">{error.message}</div> : null}
        <label className="auth-checkbox">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          Remember this device
        </label>
        <button disabled={isLoading} className="auth-button primary" onClick={signInCourier}>Sign in as courier</button>
      </div>
      <div className="auth-footer">Need access? Contact your SmartCargo administrator to provision your courier account.</div>
    </AuthLayout>
  );
}
