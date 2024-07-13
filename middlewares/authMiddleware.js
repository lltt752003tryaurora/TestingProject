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
			else
				next();
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
			else
				next();
		}
	}
}

module.exports = {
	isUserAuthenticated,
	isUserAuthorized,
}