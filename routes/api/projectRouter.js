const express = require('express');
const router = express.Router({mergeParams: true});
const {roleWhitelist} = require("../../middlewares/roleMiddleware")
const {getUserOfProject} = require("../../middlewares/userMiddleware");

const projectController = require('../../controllers/api/projectController');

//Project
router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.put('/:projectId',
			getUserOfProject,
			roleWhitelist(['manager']),
			projectController.editProject);
router.delete('/:projectId',
			getUserOfProject,
			roleWhitelist(['manager']),
			projectController.deleteProject);

//Overall
router.get('/:projectId',
			getUserOfProject,
			roleWhitelist(['developer', 'tester', 'manager']),
			projectController.getProjectById);

router.get('/:projectId/activity',
			getUserOfProject,
			roleWhitelist(['tester', 'manager']),
			projectController.getProjectActivity);

router.get('/:projectId/summary',
			getUserOfProject,
			roleWhitelist(['tester', 'manager']),
			projectController.getProjectSummary);

router.use('/:projectId/members',
			getUserOfProject,
			roleWhitelist(['tester', 'manager']),
			require('./projectMemberRouter'));

router.use('/:projectId/releases',
			getUserOfProject,
			roleWhitelist(['tester', 'manager']),
			require('./releaseRouter'));

router.use('/:projectId/modules',
			getUserOfProject,
			roleWhitelist(['tester', 'manager']),
			require('./moduleRouter'));

router.use('/:projectId/testPlans',
			getUserOfProject,
			roleWhitelist(['tester', 'manager']),
			require('./testPlanRouter'));

router.use('/:projectId/testCases',
			getUserOfProject,
			roleWhitelist(['tester', 'manager']),
			require('./testCaseRouter'));

router.use('/:projectId/testRuns',
			getUserOfProject,
			roleWhitelist(['tester', 'manager']),
			require('./testRunRouter'));

router.use('/:projectId/requirements',
			getUserOfProject,
			roleWhitelist(['tester', 'manager']),
			require('./requirementRouter'));

router.use('/:projectId/issues',
			getUserOfProject,
			roleWhitelist(['developer', 'tester', 'manager']),
			require('./issueRouter'));

module.exports = router;