const REMEMBER_ME_KEY = 'smartcargo.auth.rememberMe';

export function setRememberMePreference(enabled) {
  window.localStorage.setItem(REMEMBER_ME_KEY, enabled ? '1' : '0');
}

export function getRememberMePreference() {
  return window.localStorage.getItem(REMEMBER_ME_KEY) === '1';
}
