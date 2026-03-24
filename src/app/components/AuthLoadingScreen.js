import React from 'react';
import './auth-ui.css';

export default function AuthLoadingScreen({ message = 'Signing you in securely...' }) {
  return (
    <div className="auth-loading-overlay" role="status" aria-live="polite">
      <div className="auth-loader" />
      <p>{message}</p>
    </div>
  );
}
