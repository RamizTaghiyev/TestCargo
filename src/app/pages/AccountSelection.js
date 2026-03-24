import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Truck } from 'lucide-react';
import '../../components/RoleSelection.css';

export default function AccountSelection() {
  const navigate = useNavigate();

  return (
    <div className="role-container">
      <h1 className="role-title">Choose your SmartCargo account</h1>
      <p className="role-subtitle">Sign in with the account type your operations team assigned.</p>
      <div className="cards-wrapper">
        <div className="role-card" onClick={() => navigate('/admin/login')}>
          <div className="icon-box"><Shield size={32} /></div>
          <h2>Administrator</h2>
          <p>Operations, analytics and courier provisioning</p>
          <span className="select-link">Continue as admin →</span>
        </div>
        <div className="role-card" onClick={() => navigate('/courier/login')}>
          <div className="icon-box"><Truck size={32} /></div>
          <h2>Courier</h2>
          <p>Use credentials provided by your administrator</p>
          <span className="select-link">Continue as courier →</span>
        </div>
      </div>
    </div>
  );
}
