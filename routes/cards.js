const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { regularValidetUrl } = require('../utils/constants');

router.get('/cards', getCards);

router.post(
  '/cards',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string()
          .required()
          .pattern(regularValidetUrl),
      })
      .unknown(true),
  }),
  createCard,
);

router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().required().hex().length(24),
      })
      .unknown(true),
  }),
  deleteCard,
);

router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().required().hex().length(24),
      })
      .unknown(true),
  }),
  likeCard,
);

router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().required().hex().length(24),
      })
      .unknown(true),
  }),
  dislikeCard,
);
module.exports = router;
