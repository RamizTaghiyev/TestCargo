import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import CourierDashboard from '../../../components/CourierDashboard';

export default function CourierDashboardPage() {
  const { user } = useAuth0();
  return <CourierDashboard userEmail={user?.email} />;
}
