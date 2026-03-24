# Auth0 setup for SmartCargo

## 1) Applications and API

- Create/verify SPA application for frontend.
- Create/verify M2M application for backend provisioning.
- API Identifier (audience): `https://smartcargo.com/api/smartcargoapi`.

## 2) Allowed URLs

SPA app should include:
- Allowed Callback URLs:
  - `http://localhost:3000/auth/callback`
  - `https://<your-production-domain>/auth/callback`
- Allowed Logout URLs:
  - `http://localhost:3000/account-selection`
  - `https://<your-production-domain>/account-selection`
- Allowed Web Origins:
  - `http://localhost:3000`
  - `https://<your-production-domain>`

## 3) Connections

Create two DB connections:
- `smartcargo-admin-users` (signup + login)
- `smartcargo-courier-users` (login-only from app UX; disable public sign-up)

## 4) Roles and claims

Create roles:
- `admin`
- `courier`

Add a Post Login Action to inject roles into tokens:

```js
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://smartcargo.com';
  const roles = event.authorization?.roles || [];
  api.idToken.setCustomClaim(`${namespace}/roles`, roles);
  api.accessToken.setCustomClaim(`${namespace}/roles`, roles);
};
```

## 5) Backend Management API scopes

Grant your M2M app scopes for:
- `create:users`
- `update:users`
- `read:roles`
- `create:passwords_tickets`
- `create:users_app_metadata`

If assigning roles directly, also grant:
- `update:users`
- `create:role_members`

## 6) Courier provisioning flow

When admin submits create-courier form:
1. Frontend calls `POST /api/admin/couriers` with admin bearer token.
2. Backend validates JWT and requires `admin` role claim.
3. Backend uses Management API token (client credentials) to create user in courier connection.
4. Backend sets `app_metadata.role = 'courier'` and optional metadata.
5. Backend assigns courier role (if `AUTH0_COURIER_ROLE_ID` configured).
6. Optional reset/setup email is triggered via Auth0 `dbconnections/change_password`.

This keeps Auth0 secrets and Management API calls out of browser code.
