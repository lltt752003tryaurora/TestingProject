const express = require('express');
const router = express.Router();
const projectController = require('../../controllers/api/projectController');

//Project
router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.put('/:projectId', projectController.editProject);
router.delete('/:projectId', projectController.deleteProject);

//Overall
router.get('/:projectId', projectController.getProjectById);

router.get('/:projectId/activity', projectController.getProjectActivity);

router.get('/:projectId/summary', projectController.getProjectSummary);

router.use('/:projectId/members', require('./projectMemberRouter'));

router.use('/:projectId/releases', require('./releaseRouter'));

router.use('/:projectId/modules', require('./moduleRouter'));

router.use('/:projectId/testPlans', require('./testPlanRouter'));

router.use('/:projectId/testCases', require('./testCaseRouter'));

router.use('/:projectId/testRuns', require('./testRunRouter'));

router.use('/:projectId/issues', require('./issueRouter'));

router.use('/:projectId/requirements', require('./requirementRouter'));

module.exports = router;