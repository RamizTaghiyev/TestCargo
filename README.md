# SmartCargo Auth0 Integration

This project now implements a production-oriented Auth0 architecture with:

- Native in-app account entry pages (`/account-selection`, `/admin/login`, `/admin/signup`, `/courier/login`)
- Role-aware route guards for admin and courier areas
- Remember-me behavior (memory vs local-storage token caching)
- Auth callback route handling and route restoration
- Secure server-side Auth0 Management API integration for courier provisioning

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example` and fill real values.
3. Start frontend:
   ```bash
   npm start
   ```
4. Start backend API (separate terminal):
   ```bash
   npm run start:api
   ```

## Required Auth0 dashboard setup

Detailed setup is documented in `docs/auth0-setup.md`.

## Security note

`AUTH0_CLIENT_SECRET` is server-only. Do not place it in `REACT_APP_*` variables.
