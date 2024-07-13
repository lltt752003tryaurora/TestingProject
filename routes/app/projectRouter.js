const express = require('express');
const db = require('../../models/index')
const router = express.Router({mergeParams: true});
const {ProjectRole, mapRoleToString} = require("../../entities/role")
const projectController = require("../../controllers/app/projectController")
const {roleWhitelist, roleBlacklist} = require("../../middlewares/roleMiddleware")

router.use('/', async (req, res, next) => {
	res.locals.projectId = req.params.projectId;
	res.locals.role = req.user.role;
	res.locals.roleName = mapRoleToString(res.locals.role);
	const project = await db.Project.findByPk(res.locals.projectId);
	if (project)
		res.locals.projectName = project.name;
	next();
})

router.get('/', (req, res, next) => {
	if (res.locals.role == ProjectRole.DEVELOPER)
		res.redirect('./issue');
	else
		res.redirect('./overview');
    res.end();
});

router.get('/dashboard', roleWhitelist([]), projectController.dashboard);
router.get('/overview', roleBlacklist(['developer']), projectController.overview);
router.get('/requirement', roleBlacklist(['developer']), projectController.requirement);
router.get('/requirement/:requirementId', roleBlacklist(['developer']), projectController.requirement);
router.get('/module', roleBlacklist(['developer']), projectController.module);
router.get('/release', roleBlacklist(['developer']), projectController.release);

router.get('/test_case', roleBlacklist(['developer']), projectController.testCase);
router.get('/test_plan', roleBlacklist(['developer']), projectController.testPlan);
router.get('/test_run', roleBlacklist(['developer']), projectController.testRun);
router.use('/issue', require('./issueRouter'));

router.get('/setting', roleWhitelist(['manager']), projectController.setting);


module.exports = router;