# SmartCargo Auth Architecture (Auth0 + Role-Based UX)

This implementation delivers a production-grade auth flow with:

- Native SmartCargo auth entry screens (`/account-selection`, `/admin/login`, `/admin/signup`, `/courier/login`)
- Role-based route guards for admin vs courier
- Remember-me persistent session handling
- Callback route handling (`/auth/callback`) with post-login route restoration
- Secure backend endpoint for admin-created courier accounts via Auth0 Management API

## 1) Environment variables

### Frontend `.env`
Copy `.env.example` to `.env`.

- `REACT_APP_AUTH0_DOMAIN`
- `REACT_APP_AUTH0_CLIENT_ID`
- `REACT_APP_AUTH0_AUDIENCE`
- `REACT_APP_AUTH0_ADMIN_CONNECTION`
- `REACT_APP_AUTH0_COURIER_CONNECTION`
- `REACT_APP_AUTH0_ROLE_CLAIM_NAMESPACE`
- `REACT_APP_LOGOUT_RETURN_TO`

> **Security**: no `REACT_APP_AUTH0_CLIENT_SECRET` or `VITE_AUTH0_CLIENT_SECRET` is used. Client secret is server-only.

### Backend `server/.env`
Copy `server/.env.example` to `server/.env`.

- `AUTH0_DOMAIN`
- `AUTH0_AUDIENCE`
- `AUTH0_ROLE_CLAIM_NAMESPACE`
- `AUTH0_M2M_CLIENT_ID`
- `AUTH0_CLIENT_SECRET` (server-only secret)
- `AUTH0_SPA_CLIENT_ID`
- `AUTH0_COURIER_CONNECTION`
- `AUTH0_COURIER_ROLE_ID`

## 2) Auth0 tenant configuration checklist

1. **SPA Application**
   - Application Type: Single Page App
   - Allowed Callback URLs:
     - `http://localhost:3000/auth/callback`
   - Allowed Logout URLs:
     - `http://localhost:3000/account-selection`
   - Allowed Web Origins:
     - `http://localhost:3000`

2. **API**
   - Identifier: `https://smartcargo.com/api/smartcargoapi`

3. **Database Connections**
   - `smartcargo-admin-db`: sign-up + login allowed
   - `smartcargo-courier-db`: login used by app UX, do not expose public courier sign-up in UI

4. **Roles**
   - `admin`
   - `courier`

5. **Post-Login Action for claims**
   Add Auth0 Action to inject roles in a namespaced claim:

   ```js
   exports.onExecutePostLogin = async (event, api) => {
     const namespace = 'https://smartcargo.com';
     const roles = (event.authorization || {}).roles || [];
     api.idToken.setCustomClaim(`${namespace}/roles`, roles);
     api.accessToken.setCustomClaim(`${namespace}/roles`, roles);
   };
   ```

6. **M2M Application (for backend provisioning)**
   - Authorized for Auth0 Management API scopes:
     - `create:users`
     - `update:users`
     - `read:roles`
     - `create:role_members`

## 3) Backend endpoint for courier provisioning

`POST /api/admin/couriers`

- Protected by JWT validation + admin role requirement.
- Uses Auth0 Management API server-side only.
- Creates user in courier connection, sets app metadata, and assigns courier role.
- Optionally triggers password reset/setup email.

Request payload:

```json
{
  "fullName": "Jamie Courier",
  "email": "jamie@smartcargo.com",
  "temporaryPassword": "TempPassword123!",
  "phone": "+15555550123",
  "employeeId": "EMP-4421",
  "vehicleId": "VAN-91",
  "sendPasswordResetEmail": true
}
```

## 4) Admin vs courier flow

- **Admin signup/login**
  - Starts from in-app pages (`/admin/signup`, `/admin/login`)
  - Uses admin connection via Auth0 redirect params
  - Post-login redirect to intended admin route/dashboard

- **Courier login-only**
  - Starts from `/courier/login`
  - Uses courier connection
  - No courier sign-up route or CTA in app
  - Courier credentials are created by admin through backend endpoint

## 5) Running locally

```bash
npm install
npm run server
npm start
```

## 6) Test checklist

1. Admin sign-up from `/admin/signup`.
2. Admin sign-in from `/admin/login`.
3. Admin can open `/admin/couriers/create` and create courier.
4. Courier cannot self-register from app (no sign-up page).
5. Courier sign-in from `/courier/login` with admin-provisioned credentials.
6. Refresh on protected route preserves session when remember-me is enabled.
7. Wrong role cannot access other role routes.
8. Logout returns to `/account-selection` without protected data flash.
