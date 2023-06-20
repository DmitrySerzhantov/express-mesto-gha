// eslint-disable-next-line max-classes-per-file
class UserNotFound extends Error {
  constructor(err) {
    super(err);
    this.message = 'пользователь не найден';
    this.statusCode = 404;
  }
}

class AbstractError extends Error {
  constructor(err) {
    super(err);
    this.message = 'Внутренняя ошибка сервера!!!)';
    this.statusCode = 500;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(err.statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
  next();
};

module.exports = NotFoundError;
module.exports = errorHandler;
