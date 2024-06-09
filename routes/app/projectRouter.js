const express = require('express');
const router = express.Router({mergeParams: true});
const projectController = require("../../controllers/app/projectController")


router.use('/', (req, res, next) => {
	res.locals.projectId = req.params.project_id;
	next();
})

router.get('/', (req, res, next) => {
	res.redirect('./dashboard');
    res.end();
});

router.get('/dashboard', projectController.dashboard);
router.get('/requirement', projectController.requirement);
router.get('/module', projectController.module);
router.get('/release', projectController.release);

router.get('/test_case', projectController.testCase);
router.get('/test_plan', projectController.testPlan);
router.get('/test_run', projectController.testRun);
router.use('/issue', require('./issueRouter'));

module.exports = router;