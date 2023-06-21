const router = require('express').Router();
const NotFound = require('../errors/NotFoundError')

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use(userRoutes);
router.use(cardRoutes);
router.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = router;
