const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { secret } = require('../../config/auth');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Invalid Request' });
  }

  const [schema, token] = req.headers.authorization.split(' ');

  if (!schema || !token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  if (schema !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid Auth schema' });
  }
  try {
    const decoded = await promisify(jwt.verify)(token, secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
};
