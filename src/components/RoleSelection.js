import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Truck } from 'lucide-react';
import './RoleSelection.css';

export default function RoleSelection() {
    const navigate = useNavigate();

    return (
        <div className="role-container">
            <h1 className="role-title">Choose Your Account Type</h1>
            <p className="role-subtitle">Select the account type that best fits your needs</p>

            <div className="cards-wrapper">
                <div className="role-card" onClick={() => navigate('/admin')}>
                    <div className="icon-box">
                        <Shield size={32} />
                    </div>
                    <h2>Administrator</h2>
                    <p>Manage platform operations</p>
                    <span className="select-link">Select &rarr;</span>
                </div>

                <div className="role-card" onClick={() => navigate('/courier')}>
                    <div className="icon-box">
                        <Truck size={32} />
                    </div>
                    <h2>Courier</h2>
                    <p>Accept and deliver shipments</p>
                    <span className="select-link">Select &rarr;</span>
                </div>
            </div>
        </div>
    );
}