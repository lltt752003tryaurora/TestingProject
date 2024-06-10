const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/', projectController.getProjectList);

router.get('/:projectId', projectController.getProjectById);

router.get('/:projectId/activity', projectController.getProjectActivity);

router.get('/:projectId/summary', projectController.getProjectSummary);

router.get('/:projectId/members', projectController.getProjectMembers);

router.get('/:projectId/releases', projectController.getProjectReleases);

router.get('/:projectId/modules', projectController.getProjectModules);

router.get('/:projectId/testPlans', projectController.getProjectTestPlans);

router.get('/:projectId/testCases', projectController.getProjectTestCases);

router.get('/:projectId/testRuns', projectController.getProjectTestRuns);

router.get('/:projectId/issues', projectController.getProjectIssues);

router.get('/:projectId/requirements', projectController.getProjectRequirements);

module.exports = router;