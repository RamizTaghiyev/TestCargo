import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Truck } from 'lucide-react';
import '../components/auth/AuthUI.css';

export default function AccountSelection() {
  const navigate = useNavigate();

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">SmartCargo</div>
        <h1>Choose your account type</h1>
        <p>Sign in as an administrator or courier.</p>

        <div className="auth-grid">
          <button className="auth-role-card" onClick={() => navigate('/admin/login')}>
            <Shield size={20} />
            <h3>Administrator</h3>
            <p className="text-muted">Access analytics, settings, and courier provisioning.</p>
          </button>
          <button className="auth-role-card" onClick={() => navigate('/courier/login')}>
            <Truck size={20} />
            <h3>Courier</h3>
            <p className="text-muted">Use administrator-provided credentials to access active deliveries.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
