const express = require('express');
const router = express.Router({mergeParams: true});
const userController = require('../../controllers/api/userController');
const {roleWhitelist} = require("../../middlewares/roleMiddleware")

<<<<<<< HEAD
router.get('/:userId', userController.getUserById);
router.get('/', userController.getUsersByUsername);
=======
router.get('/', userController.getUserSelf);
router.put('/', userController.editUserSelf);
router.delete('/', userController.deleteUserSelf);

router.get('/:userId', roleWhitelist(['admin']), userController.getUserById);
router.post('/', roleWhitelist(['admin']), userController.createUser);
router.put('/:userId', roleWhitelist(['admin']), userController.editUser);
router.delete('/:userId', roleWhitelist(['admin']), userController.deleteUser);
>>>>>>> refs/remotes/origin/release-3.0

module.exports = router;