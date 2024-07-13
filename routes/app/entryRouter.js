const express = require('express');
const router = express.Router({mergeParams: true});
const entryController = require("../../controllers/app/entryController")
const authMiddleware = require("../../middlewares/authMiddleware.js");

const alreadyLoggedIn = (req, res, next) => {
	authMiddleware.isUserAuthenticated((authenticated, req, res, next) => {
		if (authenticated) {
			res.redirect('/project');
			res.end();
		}
		else 
			next();
	})(req, res, next);
}

router.get('/', entryController.landing);
router.get('/login', alreadyLoggedIn, entryController.login);
router.get('/signup', alreadyLoggedIn, entryController.signup);

module.exports = router;