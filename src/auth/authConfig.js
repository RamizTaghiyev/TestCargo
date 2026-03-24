export const ROLE_CLAIM_NAMESPACE =
  process.env.REACT_APP_AUTH0_ROLE_CLAIM_NAMESPACE || 'https://smartcargo.com';

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getAuthConfig() {
  return {
    domain: requiredEnv('REACT_APP_AUTH0_DOMAIN'),
    clientId: requiredEnv('REACT_APP_AUTH0_CLIENT_ID'),
    audience: requiredEnv('REACT_APP_AUTH0_AUDIENCE'),
    adminConnection: requiredEnv('REACT_APP_AUTH0_ADMIN_CONNECTION'),
    courierConnection: requiredEnv('REACT_APP_AUTH0_COURIER_CONNECTION'),
    roleClaimNamespace: ROLE_CLAIM_NAMESPACE,
    callbackPath: '/auth/callback',
    defaultAdminRedirect: '/admin/dashboard',
    defaultCourierRedirect: '/courier/dashboard',
    logoutReturnTo: process.env.REACT_APP_LOGOUT_RETURN_TO || window.location.origin + '/account-selection',
  };
}

export const rememberMeStorageKey = 'smartcargo.rememberMe';
export const postLoginStorageKey = 'smartcargo.postLoginRedirect';
