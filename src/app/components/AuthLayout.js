import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from 'lucide-react';
import './auth-ui.css';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <header className="auth-header">
        <Link to="/" className="brand-link">
          <span className="brand-mark"><Navigation size={16} fill="currentColor" /></span>
          <span>SmartCargo</span>
        </Link>
      </header>
      <main className="auth-main">
        <section className="auth-card">
          <h1>{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
          {footer ? <div className="auth-footer">{footer}</div> : null}
        </section>
      </main>
    </div>
  );
}
