import { getAuthConfig, postLoginStorageKey } from './authConfig';
import { setRememberMe } from './rememberMe';
import { useAuthUser } from './AuthProviderWithConfig';

export function useAuthActions() {
  const { loginWithRedirect, logout } = useAuthUser();
  const config = getAuthConfig();

  const beginLogin = async ({ role, rememberMe, mode = 'login', returnTo }) => {
    setRememberMe(Boolean(rememberMe));
    sessionStorage.setItem(postLoginStorageKey, returnTo);

    const isAdmin = role === 'admin';
    const connection = isAdmin ? config.adminConnection : config.courierConnection;

    await loginWithRedirect({
      authorizationParams: {
        audience: config.audience,
        redirect_uri: `${window.location.origin}${config.callbackPath}`,
        connection,
        screen_hint: mode === 'signup' ? 'signup' : 'login',
      },
      appState: { returnTo },
    });
  };

  const logoutToPublic = () => {
    logout({ logoutParams: { returnTo: config.logoutReturnTo } });
  };

  return { beginLogin, logoutToPublic };
}
