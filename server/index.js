const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { auth, requireAdminRole } = require('./authMiddleware');
const { createCourierUser, triggerResetEmail } = require('./auth0Management');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'smartcargo-auth-api' });
});

app.post('/api/admin/couriers', auth, requireAdminRole, async (req, res) => {
  const { name, email, password, phone, employeeId, vehicleId, sendPasswordReset } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required.' });
  }

  try {
    const user = await createCourierUser({ name, email, password, phone, employeeId, vehicleId });
    if (sendPasswordReset) {
      await triggerResetEmail(email);
    }

    return res.status(201).json({
      id: user.user_id,
      email: user.email,
      role: 'courier',
      connection: process.env.AUTH0_COURIER_CONNECTION,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'Failed to create courier user.';
    return res.status(status).json({ message });
  }
});

const port = Number(process.env.PORT || 8081);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`SmartCargo auth backend listening on :${port}`);
});
