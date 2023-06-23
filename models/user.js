const mongoose = require('mongoose');

const { validatorURL } = require('../validators/validatorURL');
const { validatorEmail } = require('../validators/validatorEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: [validatorURL, '{PATH} введены не коректные данные!!!'],
  },

  email: {
    type: String,
    unique: true,
    required: [true, 'Поле email должно быть заполнено'],
    validate: [validatorEmail, 'Введены не коректные данные пользователя'],
  },
  password: {
    type: String,
    required: [true, 'Поле password должно быть заполнено'],
    select: false,
  },
});

userSchema.methods.toJSON = function deletePassword() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
