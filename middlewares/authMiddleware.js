const { verifyToken } = require("../utils/jwt.js");
const { responseData } = require("../utils/response.js");
const { ProjectRole } = require("../entities/role.js")

const isUserAuthenticated = (callback = null) => {
	return (req, res, next) => {
		let isJWTValid = verifyToken(req.cookies.accessToken);

		if (isJWTValid.valid) {
			req.isLoggedIn = true;
			if (callback)
				callback(true, req, res, next);
			else
				next();
		}
		else {
			req.isLoggedIn = false;
			req.JWTerror = isJWTValid.error;
			if (callback)
				callback(false, req, res, next);
			else {
				if (req.environment === 'api') {
					if (req.JWTerror == "Token expired") {
						responseData(res, "Token expired", "", 401);
					} else if (req.JWTerror == "Invalid token") {
						responseData(res, "Invalid token", "", 201);
					}
				}
				else if (req.environment === 'app') {
					res.redirect('/login');
					res.end();
				}
			}
		}
	}
};

const isUserAuthorized = (callback = null) => {
	return (req, res, next) => {
		if (req.user.role != ProjectRole.NONE) {
			if (callback)
				callback(true, req, res, next);
			else
				next();
		}
		else {
			if (callback)
				callback(false, req, res, next);
			else {
				if (req.environment === 'api') {
					responseData(res, 'You do not have permission for this action', '', 403);
				}
				else if (req.environment === 'app') {
					errorPage.show403(res);
				}
			}
		}
	}
}

module.exports = {
	isUserAuthenticated,
	isUserAuthorized,
}