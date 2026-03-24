import { useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { APP_ROLES, normalizeRoles, ROLES_CLAIM } from './roleClaims';

export function useAuthUser() {
  const { user } = useAuth0();
  return user || null;
}

export function useUserRole() {
  const { user } = useAuth0();

  return useMemo(() => {
    if (!user) return null;

    const explicitRoles = normalizeRoles(user[ROLES_CLAIM]);
    if (explicitRoles.includes(APP_ROLES.ADMIN)) return APP_ROLES.ADMIN;
    if (explicitRoles.includes(APP_ROLES.COURIER)) return APP_ROLES.COURIER;

    const metadataRole = user.app_metadata?.role || user['https://smartcargo.com/role'];
    if (metadataRole) return String(metadataRole).toLowerCase();

    return null;
  }, [user]);
}

export function useIsAdmin() {
  return useUserRole() === APP_ROLES.ADMIN;
}

export function useIsCourier() {
  return useUserRole() === APP_ROLES.COURIER;
}
