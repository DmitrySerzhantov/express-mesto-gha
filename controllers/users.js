const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const { ok, created } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const Unauthorized = require('../errors/Unauthorized');
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
    .orFail(() => {
      throw new NotFoundError('пользователь с таким ID не найден');
    })
    .then((user) => {
      if (user) {
        res.status(ok).send(user);
      }
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
        .then((user) => res.status(created).send({ data: user }))
        .catch(next);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => new Unauthorized('Неверные данные пользователя'))
    .then((user) => {
      bcrypt
        .compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign(
              {
                _id: user.id,
              },
              'SECRET',
            );
            res.cookie('jwt', jwt, {
              maxAge: 360000,
              httpOnly: true,
              sameSite: true,
            });
            return res.send({ data: user.toJSON() });
          }
          throw new Unauthorized('Неверные данные пользователя');
        })
        .catch(next);
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
      throw new NotFoundError('пользователь с таким ID не найден');
    })
    .catch(next);
};

const updateUser = async (req, res, next) => {
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
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные пользователя!!!'));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar: req.body.avatar },
    { returnDocument: 'after', runValidators: true },
  )

    .then((user) => res.status(ok).send(user))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
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
