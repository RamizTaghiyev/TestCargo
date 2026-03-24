import React from 'react';
import { Link } from 'react-router-dom';
import '../components/auth-ui.css';

export default function UnauthorizedPage({ currentRole }) {
  return (
    <div className="unauthorized-box">
      <h2>Unauthorized access</h2>
      <p>Your account role ({currentRole || 'unknown'}) cannot access this page.</p>
      <p>
        <Link to="/account-selection">Return to account selection</Link>
      </p>
    </div>
  );
}
