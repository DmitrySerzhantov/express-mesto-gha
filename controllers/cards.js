const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');

const {
  ok,
  created,
  internalServerError,
  badRequest,
  notFound,
} = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(ok).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(created).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        BadRequest('Переданы некорректные данные поля карточки!!!');
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с таким ID не существует');
    })
    .then((card) => {
      if (String(card.owner) === req.user._id) {
        card.deleteOne();
        res.status(ok).send(card);
      }
      throw new Forbidden('Карточка принадлежит другому пользователю');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        BadRequest('Передан не верный формат ID !!!');
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        return res.status(ok).send(card);
      }
      throw new NotFoundError('Карточка не найденa !!!');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        BadRequest('Передан не верный формат ID !!!');
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        return res.status(ok).send(card);
      }
      throw new NotFoundError('Карточка не найденa !!!');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        BadRequest('Передан не верный формат ID !!!');
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
