const errorHandler = (err, req, res, next) => {
  if (String(err.message) === 'error') {
    res.status(401).send({ message: 'Не верные данные пользователя!!!' });
    return;
  }
  const { statusCode = 500, message } = err;
  if (err.code === 11000) {
    res
      .status(409)
      .send({ message: 'Пользователь с таким email уже существует' });
    return;
  }
  res.status(err.statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
};

module.exports = errorHandler;
