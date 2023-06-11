const User = require('../models/user');

const ok = 200;
const created = 201;
const internalServerError = 500;
const badRequest = 400;
const notFound = 404;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(ok).send(users))
    .catch((err) => {
      res.status(notFound).send({
        message: 'Пользователи не найден !!!',
        err: err.message,
        stack: err.stack,
      });

      res.status(internalServerError).send({
        message: 'Внутренняя ошибка сервера!!!',
        err: err.message,
        stack: err.stack,
      });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user !== null) {
        res.status(ok).send(user);
        return;
      }
      res.status(notFound).send({
        message: ' Пользователь не найден !!!',
      });
    })
    .catch((err) => {
      if (err.message.includes('ObjectId failed for value')) {
        res.status(badRequest).send({
          message: ' Не веарный формат ID !!!',
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

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(created).send(user))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные пользователя!!!',
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

const updateUser = async (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { name: req.body.name, about: req.body.about },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  )
    .then((user) => res.status(ok).send(user))
    .catch((err) => {
      if (err.message.includes('Validation failed')) {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные пользователя!!!',
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

const updateUserAvatar = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar: req.body.avatar },
    { returnDocument: 'after', runValidators: true },
  )
    .then((user) => res.status(ok).send(user))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные пользователя!!!',
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
  getUserById,
  getUsers,
  createUser,
  updateUser,
  updateUserAvatar,
};
