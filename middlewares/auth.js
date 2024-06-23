const { verifyToken } = require("../utils/jwt");

const isLoggedIn = (req, res, next) => {
	let isJWTValid = verifyToken(req.cookies.accessToken);

	if (isJWTValid.valid) {
		req.isLoggedIn = true;
	}
	else {
		req.isLoggedIn = false;
		req.JWTerror = isJWTValid.error;
	}
	next();
}

const roleGuard = (role) => {
	return () => true;
}

module.exports = isLoggedIn