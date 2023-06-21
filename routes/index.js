const router = require('express').Router();
const NotFound = require('../errors/NotFoundError');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use(userRoutes);
router.use(cardRoutes);
router.use('*', (err, req, res, next) => {
  next(err, new NotFound('Страница не найдена'));
});

module.exports = router;
