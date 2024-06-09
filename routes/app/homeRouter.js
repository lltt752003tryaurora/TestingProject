const express = require('express');
const router = express.Router();

const isLoggedIn = (req, res, next) => {
	if (req.isLoggedIn) {
		next();
	}
	else {
		res.redirect('/login');
        res.end();
	}
}

router.get('/', isLoggedIn, (req, res, next) => {
	res.render('project', {title: 'My Project'});
});

router.use('/:project_id', isLoggedIn, require('./projectRouter.js'));

module.exports = router;