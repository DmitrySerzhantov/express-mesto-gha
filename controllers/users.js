const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const {
  ok,
  created,
  internalServerError,
  badRequest,
  notFound,
} = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(ok).send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user !== null) {
        res.status(ok).send(user);
        return;
      }
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch((err) => {
      if (err.message.includes('ObjectId failed for value')) {
        throw new BadRequest(' Не веарный формат ID !!!');
      }
      next();
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt
    .hash(String(req.body.password), 10)
    .then((hashedPassword) => {
      User.create({
        ...req.body,
        password: hashedPassword,
      })
        .then((user) => {
          res.status(created).send({ data: user });
        })
        .catch(next);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('error'))
    .then((user) => {
      bcrypt.compare(String(password), user.password).then((isValidUser) => {
        if (isValidUser) {
          const jwt = jsonWebToken.sign(
            {
              _id: user.id,
            },
            'SECRET'
          );
          res.cookie('jwt', jwt, {
            maxAge: 360000,
            httpOnly: true,
            sameSite: true,
          });
          res.send({ data: user.toJSON() });
        }
      });
    })
    .catch(next);
};

const userProfile = (req, res, next) => {
  User.findById(req.user._id)
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

const updateUser = async (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { name: req.body.name, about: req.body.about },
    {
      returnDocument: 'after',
      runValidators: true,
    }
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
    { returnDocument: 'after', runValidators: true }
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
  login,
  userProfile,
};
