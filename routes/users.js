const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserById,
  getUsers,
  updateUser,
  updateUserAvatar,
  userProfile,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', userProfile);
router.get(
  '/users/:id',
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.string().alphanum().length(24),
      })
      .unknown(true),
  }),
  getUserById
);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
      })
      .unknown(true),
  }),
  updateUser
);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
