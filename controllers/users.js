const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      res.status(404).send({
        message: ' Пользователи не найден !!!',
        err: err.message,
        stack: err.stack,
      });

      res.status(500).send({
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
        res.status(200).send(user);
        return;
      }
      res.status(404).send({
        message: ' Пользователь не найден !!!',
      });
    })
    .catch((err) => {
      if (err.message.includes('ObjectId failed for value')) {
        res.status(400).send({
          message: ' Не веарный формат ID !!!',
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

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({
          message: 'Переданы некорректные данные пользователя!!!',
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

const updateUser = async (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, req.body, {
    returnDocument: 'after',
    runValidators: true,
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message.includes('Validation failed')) {
        res.status(400).send({
          message: 'Переданы некорректные данные пользователя!!!',
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

const updateUserAvatar = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar: req.body.avatar },
    { returnDocument: 'after', runValidators: true }
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({
          message: 'Переданы некорректные данные пользователя!!!',
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
  getUserById,
  getUsers,
  createUser,
  updateUser,
  updateUserAvatar,
};
