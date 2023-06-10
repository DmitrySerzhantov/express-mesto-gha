const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(400).send({
      message: 'Internal server error',
      err: err.message,
      stack: err.stack,
    }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'User not found',
        });
      } else {
        res.status(500).send({
          message: 'Internal server error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(400).send({
      message: 'Internal server error',
      err: err.message,
      stack: err.stack,
    }));
};
const updateUser = (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(400).send({
      message: 'Internal server error',
      err: err.message,
      stack: err.stack,
    }));
};

const updateUserAvatar = (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { avatar: req.body.avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(400).send({
      message: 'Internal server error',
      err: err.message,
      stack: err.stack,
    }));
};

module.exports = {
  getUserById,
  getUsers,
  createUser,
  updateUser,
  updateUserAvatar,
};
