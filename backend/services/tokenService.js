const jwt = require('jsonwebtoken');
const accessSecretKey = 'HANNA_ACCESS';

module.exports = function authenticateToken(req, res) {
  try {
    const tokens = req.headers['authorization']
      .split(';')
      .map((token) => token.trim());

    const accessToken = tokens[0].replace('Bearer ', '');
    const refreshToken = tokens[1];

    if (!accessToken && !refreshToken) return false;

    return jwt.verify(accessToken, accessSecretKey, (err, user) => {
      if (err) {
        return false;
      }
      return user;
    });
  } catch {
    return false;
  }
};
