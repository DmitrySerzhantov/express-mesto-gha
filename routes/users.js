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

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object()
      .keys({
        avatar: Joi.string().pattern(
          /^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*)(?::\d{2,})?(?:[\/?#]\S*)?$/
        ),
      })
      .unknown(true),
  }),
  updateUserAvatar
);

module.exports = router;
