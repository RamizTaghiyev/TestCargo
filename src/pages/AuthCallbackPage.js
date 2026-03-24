import React from 'react';
import { useAuthUser } from '../auth/AuthProviderWithConfig';
import AuthLoadingScreen from '../components/routing/AuthLoadingScreen';

export default function AuthCallbackPage() {
  const { error } = useAuthUser();

  if (error) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <h1>Authentication failed</h1>
          <div className="error-box">{error.message}</div>
        </div>
      </div>
    );
  }

  return <AuthLoadingScreen title="Finalizing authentication" subtitle="Redirecting to your SmartCargo workspace..." />;
}
