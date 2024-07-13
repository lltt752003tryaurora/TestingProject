const express = require('express');
const router = express.Router({mergeParams: true});
const userController = require('../../controllers/api/userController');
const {roleWhitelist} = require("../../middlewares/roleMiddleware")

router.get('/', userController.getUserSelf);
router.get('/search', userController.getUsersByUsername);
router.put('/', userController.editUserSelf);
router.delete('/', userController.deleteUserSelf);

router.get('/:userId', userController.getUserById);
router.post('/', roleWhitelist(['admin']), userController.createUser);
router.put('/:userId', roleWhitelist(['admin']), userController.editUser);
router.delete('/:userId', roleWhitelist(['admin']), userController.deleteUser);

module.exports = router;