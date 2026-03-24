import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import AuthLayout from '../../components/AuthLayout';

const initialForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  employeeId: '',
  vehicleId: '',
  sendPasswordReset: true,
};

export default function AdminCreateCourierPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('/api/admin/couriers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create courier account.');
      }

      const resetMessage = form.sendPasswordReset
        ? 'Password setup/reset email has been sent.'
        : 'Share the temporary password securely with the courier.';
      setSuccess(`Courier account created for ${result.email}. ${resetMessage}`);
      setForm(initialForm);
    } catch (err) {
      setError(err.message || 'Unexpected error creating courier account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create courier account" subtitle="Provision courier credentials and role in Auth0.">
      <form className="auth-grid" onSubmit={onSubmit}>
        {error ? <div className="auth-error">{error}</div> : null}
        {success ? <div className="auth-success">{success}</div> : null}

        <div className="auth-field"><label>Full name</label><input name="name" required value={form.name} onChange={onChange} /></div>
        <div className="auth-field"><label>Email</label><input name="email" type="email" required value={form.email} onChange={onChange} /></div>
        <div className="auth-field"><label>Temporary password</label><input name="password" type="password" required value={form.password} onChange={onChange} minLength={10} /></div>
        <div className="auth-field"><label>Phone (optional)</label><input name="phone" value={form.phone} onChange={onChange} /></div>
        <div className="auth-field"><label>Employee ID (optional)</label><input name="employeeId" value={form.employeeId} onChange={onChange} /></div>
        <div className="auth-field"><label>Vehicle ID (optional)</label><input name="vehicleId" value={form.vehicleId} onChange={onChange} /></div>

        <label className="auth-checkbox">
          <input name="sendPasswordReset" type="checkbox" checked={form.sendPasswordReset} onChange={onChange} />
          Send password setup/reset email immediately
        </label>

        <button disabled={submitting} className="auth-button primary" type="submit">
          {submitting ? 'Creating courier...' : 'Create courier account'}
        </button>
      </form>
    </AuthLayout>
  );
}
