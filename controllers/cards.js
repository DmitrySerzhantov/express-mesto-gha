const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.message.includes('cards is not defined')) {
        res.status(404).send({
          message: 'Карточки не найдены !!!',
          err: err.message,
          stack: err.stack,
        });
        return;
      }
      res.status(500).send({
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
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({
          message: 'Переданы некорректные данные поля карточки!!!',
          err: err.message,
          stack: err.stack,
        });
        return;
      }
      res.status(500).send({
        message: 'Внутренняя ошибка сервера!!!',
        err: err.message,
        stack: err.stack,
      });
    });
};
const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .deleteOne({})
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message.includes('cards is not defined')) {
        res.status(404).send({
          message: 'Карточка не найдены !!!',
          err: err.message,
          stack: err.stack,
        });
        return;
      }
      res.status(500).send({
        message: 'Внутренняя ошибка сервера!!!',
        err: err.message,
        stack: err.stack,
      });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message.includes('cards is not defined')) {
        res.status(404).send({
          message: 'Карточка не найдены !!!',
          err: err.message,
          stack: err.stack,
        });
        return;
      }
      res.status(500).send({
        message: 'Внутренняя ошибка сервера!!!',
        err: err.message,
        stack: err.stack,
      });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message.includes('cards is not defined')) {
        res.status(404).send({
          message: 'Карточка не найдены !!!',
          err: err.message,
          stack: err.stack,
        });
        return;
      }
      res.status(500).send({
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
