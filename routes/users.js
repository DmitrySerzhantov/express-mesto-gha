const router = require('express').Router();
const {
  getUserById,
  getUsers,
  createUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:id', getUserById);

router.post('/users', createUser);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateUserAvatar);
router.use(
  '/users/*',
  getUserById,
  getUsers,
  createUser,
  updateUser,
  updateUserAvatar
);

module.exports = router;
