import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthUser } from '../../auth/AuthProviderWithConfig';
import '../../components/auth/AuthUI.css';

const initialForm = {
  fullName: '',
  email: '',
  temporaryPassword: '',
  phone: '',
  employeeId: '',
  vehicleId: '',
  sendPasswordResetEmail: true,
};

export default function CreateCourierAccountPage() {
  const { getAccessTokenSilently } = useAuthUser();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch('/api/admin/couriers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
      });

      const body = await response.json();
      if (!response.ok) throw new Error(body.message || 'Unable to create courier account.');
      setResult(body);
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">Courier Provisioning</div>
        <h1>Create courier account</h1>
        <p>Creates an Auth0 user in the courier connection with courier role/app metadata.</p>
        {error && <div className="error-box">{error}</div>}
        {result && <div className="success-box">Courier created for {result.email}. {result.passwordResetTriggered ? 'Reset email sent.' : 'Share temporary password securely.'}</div>}

        <form className="auth-form" onSubmit={submit}>
          <label>Full name<input required value={form.fullName} onChange={(e) => onChange('fullName', e.target.value)} /></label>
          <label>Email<input type="email" required value={form.email} onChange={(e) => onChange('email', e.target.value)} /></label>
          <label>Temporary password<input minLength={12} value={form.temporaryPassword} onChange={(e) => onChange('temporaryPassword', e.target.value)} /></label>
          <label>Phone<input value={form.phone} onChange={(e) => onChange('phone', e.target.value)} /></label>
          <label>Employee ID<input value={form.employeeId} onChange={(e) => onChange('employeeId', e.target.value)} /></label>
          <label>Vehicle ID<input value={form.vehicleId} onChange={(e) => onChange('vehicleId', e.target.value)} /></label>
          <label><input type="checkbox" checked={form.sendPasswordResetEmail} onChange={(e) => onChange('sendPasswordResetEmail', e.target.checked)} /> Send password setup/reset email</label>
          <div className="auth-actions">
            <button className="btn-primary" disabled={loading}>{loading ? 'Creating…' : 'Create courier'}</button>
            <Link className="inline-link" to="/admin/dashboard">Back to dashboard</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
