const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    next(new Unauthorized('Пользователь не авторизован'));
    return;
  }
  req.user = payload;

  next();
};

module.exports = auth;
