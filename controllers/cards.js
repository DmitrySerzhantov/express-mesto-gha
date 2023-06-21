const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');

const {
  ok,
  created,
  internalServerError,
  badRequest,
  notFound,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(ok).send(cards))
    .catch((err) => {
      res.status(internalServerError).send({
        message: 'Внутренняя ошибка сервера!!!',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(created).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные поля карточки!!!',
          err: err.message,
          stack: err.stack,
        });
        return;
      }
      res.status(internalServerError).send({
        message: 'Внутренняя ошибка сервера!!!',
        err: err.message,
        stack: err.stack,
      });
    });
};
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с таким ID не существует');
    })
    .then((card) => {
      if (String(card.owner) === req.user._id) {
        card.deleteOne(req.params.cardId).then((cardDeleted) => res.status(ok).send(cardDeleted));
      } else {
        res.status(403).send({
          message: 'Карточка принадлежит другому пользователю',
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({
          message: 'Передан не верный формат ID !!!',
          err: err.message,
        });
      }
      next(err);
    })
    .catch(next);
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.status(ok).send(card);
      }
      return res.status(notFound).send({
        message: 'Карточка не найденa !!!',
      });
    })
    .catch((err) => {
      if (err.message.includes('ObjectId failed for value')) {
        return res.status(badRequest).send({
          message: 'Передан не верный формат ID !!!',
        });
      }
      return res.status(internalServerError).send({
        message: 'Внутренняя ошибка сервера!!!',
      });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.status(ok).send(card);
      }
      return res.status(notFound).send({
        message: 'Карточка не найденa !!!',
      });
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({
          message: 'Передан не верный формат ID !!!',
          err: err.message,
          stack: err.stack,
        });
        return;
      }
      res.status(internalServerError).send({
        message: 'Внутренняя ошибка сервера!!!',
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
