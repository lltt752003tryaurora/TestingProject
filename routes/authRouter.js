const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post("/login", authController.login);
// signup
router.post("/signup", authController.signup);
// refresh token
router.post("/refreshToken", authController.refreshToken);
// api logout
router.post("/logout", authController.logout);

module.exports = router;