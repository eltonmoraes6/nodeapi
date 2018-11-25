const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user')
const checkAuth = require('../middleware/check-auth');
const multerConfig = require('../config/config');

router.post('/signup', UserController.user_signup);
router.post('/signin', UserController.user_signin);
router.get('/:id', checkAuth, UserController.user_find_one);
router.patch('/update/avatar', checkAuth, multerConfig.MY_UPLOAD_STORAGE_MULTER.single('avatar'), UserController.update_user_avatar);
router.delete('/:id', checkAuth, UserController.user_remove);

module.exports = router;