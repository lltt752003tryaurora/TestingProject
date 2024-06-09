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

module.exports = isLoggedIn