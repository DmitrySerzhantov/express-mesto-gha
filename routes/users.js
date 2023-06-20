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
        id: Joi.string().alphanum().length(25),
      })
      .unknown(true),
  }),
  getUserById
);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
