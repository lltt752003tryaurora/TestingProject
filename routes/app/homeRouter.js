const express = require('express');
const router = express.Router();
const projectRouter = express.Router({mergeParams: true});
const projectController = require("../../controllers/app/projectController")

const isLoggedIn = (req, res, next) => {
	if (res.locals.isLoggedIn) {
		next();
	}
	else {
		next();
		// res.redirect('/login');
        // res.end();
	}
}

router.get('/', isLoggedIn, (req, res, next) => {
	res.render('project', {title: 'My Project'});
});

router.use('/:project_id', isLoggedIn, require('./projectRouter.js'));

module.exports = router;