const express = require('express');
const router = express.Router();
const { getUserFromToken } = require('../utils/jwt');
const { responseData } = require("../utils/response.js");
const {verifyToken} = require('../utils/jwt.js');

const auth = (req, res, next) => {
	if (req.isLoggedIn) {
		req.user = getUserFromToken(req.cookies.accessToken)
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

router.use('/projects', auth, require('./projectRouter'));
router.use('/users/', auth, require('./userRouter.js'));
router.use('/releases', auth, require('./releaseRouter'));
router.use('/modules', auth, require('./moduleRouter'));
router.use('/testPlans', auth, require('./testPlanRouter'));
router.use('/testPlanComponents', auth, require('./testPlanComponentRouter'));
router.use('/testCases/', verifyToken, require('./testCaseRouter'));
router.use('/testRuns', verifyToken, require('./testRunRouter'));
router.use('/issues', auth, require('./issueRouter'));
router.use('/attachments', auth, require('./attachmentRouter'));
router.use('/auth', require('./authRouter'));

module.exports = router;