const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use(userRoutes);
router.use(cardRoutes);
router.use('*', (req, res, next) => {
  const erorNotFound = new NotFoundError('Страница не найдена');
  next(erorNotFound);
});

module.exports = router;
