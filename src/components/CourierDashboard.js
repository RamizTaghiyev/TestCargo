import React, { useState, useEffect } from 'react';
import { Bell, Menu, Map, CheckCircle, DollarSign, Star, Package, Navigation } from 'lucide-react';
import './CourierDashboard.css';
import { useAuthActions } from '../auth/useAuthActions';
import { useAuthUser } from '../auth/AuthProviderWithConfig';

export default function CourierDashboard() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logoutToPublic } = useAuthActions();
    const { user, getAccessTokenSilently } = useAuthUser();

    useEffect(() => {
        async function loadDeliveries() {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch('http://localhost:8080/api/courier/deliveries', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data) setDeliveries(data);
            } catch (error) {
                console.error('Error fetching:', error);
            } finally {
                setLoading(false);
            }
        }

        loadDeliveries();
    }, [getAccessTokenSilently]);

    return (
        <div className="app-layout">
            <header className="top-nav">
                <div className="nav-brand">
                    <div className="brand-logo">
                        <Navigation size={20} fill="currentColor" />
                    </div>
                    <div className="brand-text">
                        <h1>Smart Cargo Courier</h1>
                        <p>Active Deliveries</p>
                    </div>
                </div>
                <div className="nav-actions">
                    <button className="btn-secondary" onClick={logoutToPublic}>Sign out</button>
                    <div className="notification-icon">
                        <Bell size={20} />
                        <span className="badge"></span>
                    </div>
                    <Menu size={24} />
                </div>
            </header>

            <main className="dashboard-content">
                <section className="welcome-header">
                    <h2>Welcome, {user?.name || user?.email}!</h2>
                    <p>Here are your available shipments</p>
                </section>

                <section className="stats-row">
                    <div className="stat-box bg-yellow"><DollarSign className="icon-yellow" size={20} /><span className="stat-title">Today's Earnings</span><span className="stat-value">$245.50</span></div>
                    <div className="stat-box bg-green"><CheckCircle className="icon-green" size={20} /><span className="stat-title">Deliveries</span><span className="stat-value">8</span></div>
                    <div className="stat-box bg-orange"><Star className="icon-orange" size={20} /><span className="stat-title">Rating</span><span className="stat-value">4.9/5</span></div>
                    <div className="stat-box bg-blue"><Package className="icon-blue" size={20} /><span className="stat-title">Active</span><span className="stat-value">{deliveries.length > 0 ? deliveries.length : 2}</span></div>
                </section>

                <section className="deliveries-section">
                    <div className="section-title-row"><h3>Active Deliveries</h3><button className="text-link"><Map size={16} /> View on Map</button></div>
                    <div className="cards-container">
                        {loading ? <p className="status-message">Loading active routes...</p> : deliveries.length === 0 ? <p className="status-message">No active deliveries.</p> : deliveries.map((pkg, index) => {
                            const progress = pkg.status === 'In Transit' ? '65%' : '89%';
                            const timeEst = pkg.status === 'In Transit' ? '1 hour' : '30 mins';

                            return <div key={pkg.id || index} className="card delivery-card"><div className="card-header"><h4 className="tracking-id">SHP-2026-{pkg.tracking_code}</h4><span className="time-estimate">{timeEst}</span></div><div className="status-row"><CheckCircle size={16} className="status-icon-blue" /><span className="status-text">{pkg.status}</span></div><div className="progress-track"><div className="progress-fill" style={{ width: progress }}></div></div><p className="progress-label">{progress} Complete</p></div>;
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
}
