import React from 'react';
import AuthLayout from '../components/AuthLayout';

export default function GenericPage({ title }) {
  return (
    <AuthLayout title={title} subtitle="This route is protected and wired to role-aware Auth0 guards.">
      <div className="auth-grid" />
    </AuthLayout>
  );
}
