const express = require('express');
const router = express.Router();
const userController = require('../../controllers/api/userController');

router.get('/:userId', userController.getUserById);

module.exports = router;