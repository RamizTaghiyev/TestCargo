import React, { useState, useEffect } from 'react';
import { Bell, Menu, Map, CheckCircle, DollarSign, Star, Package, Navigation } from 'lucide-react';
import './CourierDashboard.css';

export default function CourierDashboard() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Keep your fetch logic here
        fetch('http://localhost:8080/api/courier/deliveries')
            .then(response => response.json())
            .then(data => {
                if (data) setDeliveries(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="app-layout">
            {/* Top Header */}
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
                    <div className="notification-icon">
                        <Bell size={20} />
                        <span className="badge"></span>
                    </div>
                    <Menu size={24} />
                </div>
            </header>

            {/* Main Scrollable Content */}
            <main className="dashboard-content">
                <section className="welcome-header">
                    <h2>Welcome, laslanova16179@gmail.com!</h2>
                    <p>Here are your available shipments</p>
                </section>

                {/* 4-Column Stats Grid */}
                <section className="stats-row">
                    <div className="stat-box bg-yellow">
                        <DollarSign className="icon-yellow" size={20} />
                        <span className="stat-title">Today's Earnings</span>
                        <span className="stat-value">$245.50</span>
                    </div>
                    <div className="stat-box bg-green">
                        <CheckCircle className="icon-green" size={20} />
                        <span className="stat-title">Deliveries</span>
                        <span className="stat-value">8</span>
                    </div>
                    <div className="stat-box bg-orange">
                        <Star className="icon-orange" size={20} />
                        <span className="stat-title">Rating</span>
                        <span className="stat-value">4.9/5</span>
                    </div>
                    <div className="stat-box bg-blue">
                        <Package className="icon-blue" size={20} />
                        <span className="stat-title">Active</span>
                        <span className="stat-value">{deliveries.length > 0 ? deliveries.length : 2}</span>
                    </div>
                </section>

                {/* Active Deliveries List */}
                <section className="deliveries-section">
                    <div className="section-title-row">
                        <h3>Active Deliveries</h3>
                        <button className="text-link"><Map size={16} /> View on Map</button>
                    </div>

                    <div className="cards-container">
                        {loading ? (
                            <p className="status-message">Loading active routes...</p>
                        ) : deliveries.length === 0 ? (
                            <p className="status-message">No active deliveries.</p>
                        ) : (
                            deliveries.map((pkg, index) => {
                                // Mock progress based on status for the UI
                                const progress = pkg.status === 'In Transit' ? '65%' : '89%';
                                const timeEst = pkg.status === 'In Transit' ? '1 hour' : '30 mins';

                                return (
                                    <div key={pkg.id || index} className="card delivery-card">
                                        <div className="card-header">
                                            <h4 className="tracking-id">SHP-2026-{pkg.tracking_code}</h4>
                                            <span className="time-estimate">{timeEst}</span>
                                        </div>
                                        <div className="status-row">
                                            <CheckCircle size={16} className="status-icon-blue" />
                                            <span className="status-text">{pkg.status}</span>
                                        </div>
                                        <div className="progress-track">
                                            <div className="progress-fill" style={{ width: progress }}></div>
                                        </div>
                                        <p className="progress-label">{progress} Complete</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Available Shipments Section (From Screenshot 4 & 8) */}
                <section className="deliveries-section mt-8">
                    <div className="section-title-row">
                        <h3>Available Shipments</h3>
                    </div>

                    <div className="card shipment-card border-left-blue">
                        <div className="route-info">
                            <div className="route-point">
                                <span className="point-label">FROM</span>
                                <span className="tag urgent">URGENT</span>
                            </div>
                            <h4 className="location-name">Downtown Area</h4>

                            <div className="route-dots">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>

                            <div className="route-point">
                                <span className="point-label">TO</span>
                            </div>
                            <h4 className="location-name">Airport Terminal</h4>
                        </div>

                        <div className="shipment-details">
                            <div className="detail-item">
                                <span className="detail-label">Weight</span>
                                <span className="detail-val">25 kg</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Distance</span>
                                <span className="detail-val">12.5 km</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Pickup</span>
                                <span className="detail-val">09:30 AM</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Reward</span>
                                <span className="detail-val price-blue">$45</span>
                            </div>
                        </div>

                        <button className="btn-primary">View Details</button>
                    </div>
                </section>

            </main>
        </div>
    );
}