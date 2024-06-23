const express = require('express');
const router = express.Router();
const { getUserFromToken } = require('../../utils/jwt.js');
const { extractUserRole } = require('../../controllers/helpers/userRoleHelper.js')

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

const isProjectMember = async (req, res, next) => {
	const userId = req.user.id;
    const projectId = req.params.projectId || req.params.project_id;
    const projectMember = await extractUserRole(projectId, userId);
    if (projectMember !== null) {
        req.filter = projectMember;
        next();
    } else {
        return res.status(400).render('errors/bad_request', {
			message: 'Project does not exist, or user is not a project member.',
			hideHeader: true,
			title: "Page not found"
		});
    }
}

router.get('/', isLoggedIn, (req, res, next) => {
	res.render('project', {title: 'My Project'});
});

router.use('/:project_id', isLoggedIn, auth, isProjectMember, require('./projectRouter.js'));

module.exports = router;