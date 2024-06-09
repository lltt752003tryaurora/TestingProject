const express = require('express');
const router = express.Router();
const entryController = require("../../controllers/app/entryController")

const alreadyLoggedIn = (req, res, next) => {
	if (req.isLoggedIn) {
		res.redirect('/project');
        res.end();
	}
	else {
		next();
	}
}

router.get('/', entryController.landing);
router.get('/login', alreadyLoggedIn, entryController.login);
router.get('/signup', alreadyLoggedIn, entryController.signup);

module.exports = router;