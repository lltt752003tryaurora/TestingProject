const express = require('express');
const router = express.Router({mergeParams: true});
const {ProjectRole} = require("../../entities/role")
const projectController = require("../../controllers/app/projectController")
const {roleWhitelist, roleBlacklist} = require("../../middlewares/roleMiddleware")

router.use('/', (req, res, next) => {
	res.locals.projectId = req.params.projectId;
	res.locals.role = req.user.role;
	next();
})

router.get('/', (req, res, next) => {
	if (res.locals.role == ProjectRole.DEVELOPER)
		res.redirect('./issue');
	else
		res.redirect('./overview');
    res.end();
});

router.get('/dashboard', roleWhitelist(['admin']), projectController.dashboard);
router.get('/overview', roleBlacklist(['developer']), projectController.overview);
router.get('/requirement', roleBlacklist(['developer']), projectController.requirement);
router.get('/module', roleBlacklist(['developer']), projectController.module);
router.get('/release', roleBlacklist(['developer']), projectController.release);

router.get('/test_case', roleBlacklist(['developer']), projectController.testCase);
router.get('/test_plan', roleBlacklist(['developer']), projectController.testPlan);
router.get('/test_run', roleBlacklist(['developer']), projectController.testRun);
router.use('/issue', require('./issueRouter'));

module.exports = router;