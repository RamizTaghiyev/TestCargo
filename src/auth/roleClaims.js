export function getRolesFromUser(user, namespace = 'https://smartcargo.com') {
  if (!user) return [];
  const direct = user[`${namespace}/roles`] || user.roles;
  if (Array.isArray(direct)) return direct;
  if (typeof direct === 'string') return [direct];

  const appMetaRole = user[`${namespace}/role`] || user.role || user?.app_metadata?.role;
  return appMetaRole ? [appMetaRole] : [];
}

export function getPrimaryRole(user, namespace) {
  const roles = getRolesFromUser(user, namespace);
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('courier')) return 'courier';
  return null;
}
