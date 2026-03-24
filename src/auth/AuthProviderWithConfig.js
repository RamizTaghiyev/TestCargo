import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthConfig, postLoginStorageKey, rememberMeStorageKey } from './authConfig';
import { getPrimaryRole, getRolesFromUser } from './roleClaims';

const AuthContext = createContext(null);
const TOKEN_KEY = 'smartcargo.auth.tokens';

function decodeJwt(token) {
  const [, payload] = token.split('.');
  return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
}

async function sha256base64url(input) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function AuthProviderWithConfig({ children }) {
  const navigate = useNavigate();
  const config = getAuthConfig();
  const [tokens, setTokens] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const persistTokens = (next) => {
    setTokens(next);
    const remember = localStorage.getItem(rememberMeStorageKey) === '1';
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, JSON.stringify(next));
    (remember ? sessionStorage : localStorage).removeItem(TOKEN_KEY);
  };

  useEffect(() => {
    (async () => {
      try {
        const stored = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.expiresAt > Date.now()) setTokens(parsed);
        }

        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (window.location.pathname === config.callbackPath && code && state) {
          const txRaw = sessionStorage.getItem('smartcargo.pkce.tx');
          if (!txRaw) throw new Error('Authentication transaction not found.');

          const tx = JSON.parse(txRaw);
          if (tx.state !== state) throw new Error('Invalid callback state.');

          const response = await fetch(`https://${config.domain}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              grant_type: 'authorization_code',
              client_id: config.clientId,
              code_verifier: tx.codeVerifier,
              code,
              redirect_uri: `${window.location.origin}${config.callbackPath}`,
            }),
          });

          if (!response.ok) throw new Error('Failed to complete authentication callback.');
          const body = await response.json();
          const idPayload = decodeJwt(body.id_token);
          const nextTokens = {
            idToken: body.id_token,
            accessToken: body.access_token,
            expiresAt: Date.now() + body.expires_in * 1000,
            user: { ...idPayload, email: idPayload.email, name: idPayload.name },
          };
          persistTokens(nextTokens);

          const returnTo = tx.returnTo || sessionStorage.getItem(postLoginStorageKey) || '/account-selection';
          sessionStorage.removeItem('smartcargo.pkce.tx');
          sessionStorage.removeItem(postLoginStorageKey);
          navigate(returnTo, { replace: true });
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [config.callbackPath, config.clientId, config.domain, navigate]);

  const loginWithRedirect = async ({ authorizationParams, appState }) => {
    const state = crypto.randomUUID();
    const codeVerifier = crypto.randomUUID() + crypto.randomUUID();
    const codeChallenge = await sha256base64url(codeVerifier);

    sessionStorage.setItem('smartcargo.pkce.tx', JSON.stringify({
      state,
      codeVerifier,
      returnTo: appState?.returnTo,
    }));

    const query = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: authorizationParams.redirect_uri,
      audience: authorizationParams.audience,
      scope: 'openid profile email',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      connection: authorizationParams.connection,
      screen_hint: authorizationParams.screen_hint,
    });

    window.location.assign(`https://${config.domain}/authorize?${query.toString()}`);
  };

  const logout = ({ logoutParams }) => {
    setTokens(null);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    window.location.assign(`https://${config.domain}/v2/logout?client_id=${encodeURIComponent(config.clientId)}&returnTo=${encodeURIComponent(logoutParams.returnTo)}`);
  };

  const getAccessTokenSilently = async () => {
    if (!tokens?.accessToken) throw new Error('Not authenticated');
    if (tokens.expiresAt < Date.now()) throw new Error('Session expired, please sign in again.');
    return tokens.accessToken;
  };

  const role = getPrimaryRole(tokens?.user, config.roleClaimNamespace);
  const roles = getRolesFromUser(tokens?.user, config.roleClaimNamespace);

  const value = useMemo(() => ({
    user: tokens?.user,
    error,
    isLoading,
    isAuthenticated: Boolean(tokens?.accessToken),
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    role,
    roles,
    isAdmin: roles.includes('admin'),
    isCourier: roles.includes('courier'),
  }), [error, isLoading, role, roles, tokens]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthUser() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthUser must be used within AuthProviderWithConfig');
  return ctx;
}

export const useUserRole = () => useAuthUser().role;
export const useIsAdmin = () => useAuthUser().isAdmin;
export const useIsCourier = () => useAuthUser().isCourier;
