import { getRememberMePreference } from './rememberMe';

function requiredEnv(name, value) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const authConfig = {
  domain: requiredEnv('REACT_APP_AUTH0_DOMAIN', process.env.REACT_APP_AUTH0_DOMAIN),
  clientId: requiredEnv('REACT_APP_AUTH0_CLIENT_ID', process.env.REACT_APP_AUTH0_CLIENT_ID),
  audience: requiredEnv('REACT_APP_AUTH0_AUDIENCE', process.env.REACT_APP_AUTH0_AUDIENCE),
  callbackPath: '/auth/callback',
  rememberMe: getRememberMePreference(),
  adminConnection: process.env.REACT_APP_AUTH0_ADMIN_CONNECTION || 'smartcargo-admin-users',
  courierConnection: process.env.REACT_APP_AUTH0_COURIER_CONNECTION || 'smartcargo-courier-users',
};

export function getRedirectUri() {
  return `${window.location.origin}${authConfig.callbackPath}`;
}
