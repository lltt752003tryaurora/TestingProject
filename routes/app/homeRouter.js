const express = require('express');
const router = express.Router();
const { getUserFromToken } = require('../../utils/jwt.js');
const { isUserProjectMember } = require('../../controllers/filters/projectRoleFilters.js');

const isLoggedIn = (req, res, next) => {
	if (req.isLoggedIn) {
		next();
	}
	else {
		res.redirect('/login');
        res.end();
	}
}

const auth = (req, res, next) => {
	if (req.isLoggedIn) {
		req.user = getUserFromToken(req.cookies.accessToken);
        next();
	}
	else {
		if (req.JWTerror == "Token expired") {
			responseData(res, "Token expired", "", 401);
		} else if (req.JWTerror == "Invalid token") {
			responseData(res, "Invalid token", "", 201);
		}
	}
}

router.get('/', isLoggedIn, (req, res, next) => {
	res.render('project', {title: 'My Project'});
});

router.use('/:project_id', isLoggedIn, auth, isUserProjectMember, require('./projectRouter.js'));

module.exports = router;