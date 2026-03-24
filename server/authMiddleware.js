const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const auth = jwt.expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

function requireAdminRole(req, res, next) {
  const roles = req.auth?.['https://smartcargo.com/roles'] || [];
  const hasAdmin = Array.isArray(roles) && roles.includes('admin');
  if (!hasAdmin) {
    return res.status(403).json({ message: 'Admin role required.' });
  }
  return next();
}

module.exports = { auth, requireAdminRole };
