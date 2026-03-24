const axios = require('axios');

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

const domain = required('AUTH0_DOMAIN');
const baseURL = `https://${domain}`;

async function getManagementToken() {
  const clientId = required('AUTH0_M2M_CLIENT_ID');
  const clientSecret = required('AUTH0_CLIENT_SECRET');
  const audience = `${baseURL}/api/v2/`;

  const { data } = await axios.post(`${baseURL}/oauth/token`, {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    audience,
  });

  return data.access_token;
}

async function createCourierUser(payload) {
  const token = await getManagementToken();
  const connection = required('AUTH0_COURIER_CONNECTION');

  const { data: user } = await axios.post(
    `${baseURL}/api/v2/users`,
    {
      connection,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      email_verified: false,
      verify_email: true,
      app_metadata: {
        role: 'courier',
        employeeId: payload.employeeId || null,
        vehicleId: payload.vehicleId || null,
      },
      user_metadata: {
        phone: payload.phone || null,
      },
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (process.env.AUTH0_COURIER_ROLE_ID) {
    await axios.post(
      `${baseURL}/api/v2/users/${encodeURIComponent(user.user_id)}/roles`,
      { roles: [process.env.AUTH0_COURIER_ROLE_ID] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  return user;
}

async function triggerResetEmail(email) {
  await axios.post(`${baseURL}/dbconnections/change_password`, {
    client_id: required('AUTH0_SPA_CLIENT_ID'),
    email,
    connection: required('AUTH0_COURIER_CONNECTION'),
  });
}

module.exports = { createCourierUser, triggerResetEmail };
