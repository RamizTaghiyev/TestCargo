const http = require('http');

const PORT = process.env.PORT || 8787;

function send(res, code, payload) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error('Invalid JSON body.'));
      }
    });
  });
}

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

async function getManagementToken() {
  const response = await fetch(`https://${required('AUTH0_DOMAIN')}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: required('AUTH0_M2M_CLIENT_ID'),
      client_secret: required('AUTH0_CLIENT_SECRET'),
      audience: `https://${required('AUTH0_DOMAIN')}/api/v2/`,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to obtain Management API token.');
  }
  const body = await response.json();
  return body.access_token;
}

async function requireAdmin(accessToken) {
  const response = await fetch(`https://${required('AUTH0_DOMAIN')}/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('Unauthorized token.');

  const user = await response.json();
  const namespace = process.env.AUTH0_ROLE_CLAIM_NAMESPACE || 'https://smartcargo.com';
  const roles = user[`${namespace}/roles`] || [];
  if (!Array.isArray(roles) || !roles.includes('admin')) {
    throw new Error('Admin role required.');
  }

  return user;
}

async function createCourier(data) {
  const managementToken = await getManagementToken();
  const generatedPassword =
    data.temporaryPassword || `Tmp-${Math.random().toString(36).slice(2)}-${Date.now().toString().slice(-4)}!`;

  const createRes = await fetch(`https://${required('AUTH0_DOMAIN')}/api/v2/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${managementToken}`,
    },
    body: JSON.stringify({
      connection: required('AUTH0_COURIER_CONNECTION'),
      email: data.email,
      name: data.fullName,
      password: generatedPassword,
      app_metadata: {
        role: 'courier',
        employeeId: data.employeeId || undefined,
        vehicleId: data.vehicleId || undefined,
      },
      user_metadata: {
        phone: data.phone || undefined,
      },
    }),
  });

  const createBody = await createRes.json();
  if (!createRes.ok) {
    throw new Error(createBody.message || 'Failed to create courier user.');
  }

  await fetch(`https://${required('AUTH0_DOMAIN')}/api/v2/roles/${required('AUTH0_COURIER_ROLE_ID')}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${managementToken}`,
    },
    body: JSON.stringify({ users: [createBody.user_id] }),
  });

  let passwordResetTriggered = false;
  if (data.sendPasswordResetEmail) {
    await fetch(`https://${required('AUTH0_DOMAIN')}/dbconnections/change_password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: required('AUTH0_SPA_CLIENT_ID'),
        email: data.email,
        connection: required('AUTH0_COURIER_CONNECTION'),
      }),
    });
    passwordResetTriggered = true;
  }

  return {
    userId: createBody.user_id,
    email: createBody.email,
    temporaryPassword: passwordResetTriggered ? undefined : generatedPassword,
    passwordResetTriggered,
  };
}

http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    send(res, 200, {});
    return;
  }

  if (req.method === 'POST' && req.url === '/api/admin/couriers') {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return send(res, 401, { message: 'Missing bearer token.' });

      await requireAdmin(token);
      const body = await readJson(req);
      if (!body.fullName || !body.email) {
        return send(res, 400, { message: 'fullName and email are required.' });
      }

      const result = await createCourier(body);
      return send(res, 201, result);
    } catch (error) {
      return send(res, 500, { message: error.message || 'Unexpected provisioning error.' });
    }
  }

  send(res, 404, { message: 'Not found.' });
}).listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SmartCargo auth server listening on ${PORT}`);
});
