const validator = require('validator');
const mongoose = require('mongoose');

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
    validate: {
      validator(v) {
        return /https:\/\//gi.test(v);
      },
      message: (props) => `${props.value} Адрес изображения введен не верный`,
    },
  },
  email: {
    type: String,
    unique: true,
    minlength: 2,
    required: [true, 'Поле email должно быть заполнено'],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('введены не верные данные');
      }
    },
  },
  password: {
    type: String,
    minlength: 2,
    required: [true, 'Поле password должно быть заполнено'],
    select: false,
  },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
