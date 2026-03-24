import React from 'react';
import '../auth/AuthUI.css';

export default function AuthLoadingScreen({ title = 'Signing you in', subtitle = 'Please wait while SmartCargo secures your session.' }) {
  return (
    <div className="auth-shell">
      <div className="auth-card auth-card--centered">
        <div className="spinner" aria-hidden="true" />
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
