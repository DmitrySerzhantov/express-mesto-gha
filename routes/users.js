const router = require('express').Router();
const {
  getUserById,
  getUsers,
  updateUser,
  updateUserAvatar,
  userProfile,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', userProfile);
router.get('/users/:id', getUserById);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
