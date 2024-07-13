const express = require('express');
const router = express.Router({mergeParams: true});
const {isProjectMember, roleWhitelist} = require("../../middlewares/roleMiddleware")
const {getUserOfProject} = require("../../middlewares/userMiddleware");

const projectController = require('../../controllers/api/projectController');

//Project
router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.put('/:projectId', getUserOfProject, isProjectMember(), projectController.editProject);
router.delete('/:projectId', getUserOfProject, isProjectMember(), projectController.deleteProject);

//Overall
router.get('/:projectId', getUserOfProject, isProjectMember(), projectController.getProjectById);

router.get('/:projectId/activity', getUserOfProject, isProjectMember(), projectController.getProjectActivity);

router.get('/:projectId/summary', getUserOfProject, isProjectMember(), projectController.getProjectSummary);

router.use('/:projectId/members', getUserOfProject, isProjectMember(), require('./projectMemberRouter'));

router.use('/:projectId/releases', getUserOfProject, isProjectMember(), require('./releaseRouter'));

router.use('/:projectId/modules', getUserOfProject, isProjectMember(), require('./moduleRouter'));

router.use('/:projectId/testPlans', getUserOfProject, isProjectMember(), require('./testPlanRouter'));

router.use('/:projectId/testCases', getUserOfProject, isProjectMember(), require('./testCaseRouter'));

router.use('/:projectId/testRuns', getUserOfProject, isProjectMember(), require('./testRunRouter'));

router.use('/:projectId/issues', getUserOfProject, isProjectMember(), require('./issueRouter'));

router.use('/:projectId/requirements', getUserOfProject, isProjectMember(), require('./requirementRouter'));

module.exports = router;