const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/:projectId', projectController.getProjectById);

router.get('/:projectId/members', projectController.getProjectMembers);

router.get('/:projectId/releases', projectController.getProjectReleases);

router.get('/:projectId/modules', projectController.getProjectModules);

router.get('/:projectId/testPlans', projectController.getProjectTestPlans);

router.get('/:projectId/testCases', projectController.getProjectTestCases);

module.exports = router;