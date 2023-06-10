const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '648390eadb8e3141650df7d5',
  };
  next();
});
app.use(router);
app.listen(PORT, () => {});
