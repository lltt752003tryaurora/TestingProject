const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

//Project
router.get('/', projectController.getProjects);
router.put('/', projectController.createProject);
router.patch('/:projectId', projectController.editProject);
router.delete('/:projectId', projectController.deleteProject);

//Overall
router.get('/:projectId', projectController.getProjectById);

router.get('/:projectId/activity', projectController.getProjectActivity);

router.get('/:projectId/summary', projectController.getProjectSummary);

router.use('/:projectId/members', require('./projectMemberRouter'));

router.use('/:projectId/releases', require('./releaseRouter'));

router.use('/:projectId/modules', require('./moduleRouter'));

router.get('/:projectId/testPlans', projectController.getProjectTestPlans);

router.get('/:projectId/testCases', projectController.getProjectTestCases);

router.get('/:projectId/testRuns', projectController.getProjectTestRuns);

router.get('/:projectId/issues', projectController.getProjectIssues);

router.use('/:projectId/requirements', require('./requirementRouter'));

module.exports = router;