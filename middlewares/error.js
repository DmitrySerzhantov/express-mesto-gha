const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.code === 11000) {
    res
      .status(409)
      .send({ message: 'Пользователь с таким email уже существует' });
    return;
  }
  res.status(err.statusCode || statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
};

module.exports = errorHandler;
