const express = require('express');
const router = express.Router();
const userController = require('../../controllers/api/userController');

router.get('/:userId', userController.getUserById);
router.get('/', userController.getUsersByUsername);

module.exports = router;