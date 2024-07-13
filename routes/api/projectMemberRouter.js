const express = require('express');
const router = express.Router({ mergeParams: true });
const projectMemberController = require('../../controllers/api/projectMemberController');
const { roleWhitelist } = require('../../middlewares/roleMiddleware');

router.get('/', projectMemberController.getProjectMembers);
router.post('/', projectMemberController.addProjectMembers);
router.put('/', projectMemberController.setProjectMember);

router.get('/nonmembers', projectMemberController.getProjectNonMembers);

module.exports = router;