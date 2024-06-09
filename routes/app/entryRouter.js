const express = require('express');
const router = express.Router();
const entryController = require("../../controllers/app/entryController")

const isLoggedIn = (req, res, next) => {
	if (res.locals.isLoggedIn) {
		res.redirect('/project');
        res.end();
	}
	else {
		next();
	}
}

router.get('/', isLoggedIn, entryController.entry);
router.get('/login', isLoggedIn, entryController.login);
router.get('/signup', isLoggedIn, entryController.signup);

module.exports = router;