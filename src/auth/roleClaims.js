export const ROLES_CLAIM = 'https://smartcargo.com/roles';

export const APP_ROLES = {
  ADMIN: 'admin',
  COURIER: 'courier',
};

export function normalizeRoles(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((value) => String(value).toLowerCase());
  return [String(input).toLowerCase()];
}
