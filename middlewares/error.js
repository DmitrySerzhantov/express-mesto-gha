const errorHandler = (err, req, res, next) => {
  res.status(500).send({ message: 'Внутренняя ошибка сервера!!!' });
  next();
};

module.exports = errorHandler;
