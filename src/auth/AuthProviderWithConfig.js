import React, { useCallback } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { authConfig, getRedirectUri } from './authConfig';

function resolvePostAuthRoute(appState) {
  if (appState?.returnTo) return appState.returnTo;
  if (appState?.role === 'admin') return '/admin/dashboard';
  if (appState?.role === 'courier') return '/courier/dashboard';
  return '/';
}

export default function AuthProviderWithConfig({ children }) {
  const navigate = useNavigate();

  const onRedirectCallback = useCallback((appState) => {
    navigate(resolvePostAuthRoute(appState), { replace: true });
  }, [navigate]);

  return (
    <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
      authorizationParams={{
        audience: authConfig.audience,
        redirect_uri: getRedirectUri(),
      }}
      cacheLocation={authConfig.rememberMe ? 'localstorage' : 'memory'}
      useRefreshTokens
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}
