import { rememberMeStorageKey } from './authConfig';

export function setRememberMe(enabled) {
  localStorage.setItem(rememberMeStorageKey, enabled ? '1' : '0');
}

export function getRememberMe() {
  return localStorage.getItem(rememberMeStorageKey) === '1';
}
