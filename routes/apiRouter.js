const express = require('express');
const router = express.Router({mergeParams: true});
const { getUserFromToken } = require('../utils/jwt');
const { responseData } = require("../utils/response.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const userMiddleware = require("../middlewares/userMiddleware.js");

router.use('/auth', require('./api/authRouter.js'));

router.use('/projects',
			authMiddleware.isUserAuthenticated((authenticated, req, res, next) => {
				if (!authenticated) {
					if (req.JWTerror == "Token expired") {
						responseData(res, "Token expired", "", 401);
					} else if (req.JWTerror == "Invalid token") {
						responseData(res, "Invalid token", "", 201);
					}
				}
				else
					next();
			}),
			userMiddleware.getUserInfo,
			require('./api/projectRouter.js'));
// router.use('/projects', auth, require('./api/projectRouter.js'));
// router.use('/users/', auth, require('./api/userRouter.js'));
// router.use('/modules', auth, require('./api/moduleRouter.js'));
// router.use('/testPlans', auth, require('./api/testPlanRouter.js'));
// router.use('/testPlanComponents', auth, require('./api/testPlanComponentRouter.js'));
// router.use('/testCases/', auth, require('./api/testCaseRouter.js'));
// router.use('/testRuns', auth, require('./api/testRunRouter.js'));
// router.use('/issues', auth, require('./api/issueRouter.js'));
// router.use('/attachments', auth, require('./api/attachmentRouter.js'));
// router.use('/requirements', auth, require('./api/requirementRouter.js'));

module.exports = router;