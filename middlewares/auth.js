const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    next((err, { statusCode: 401 }));
  }
  req.user = payload;

  next();
};

module.exports = auth;
