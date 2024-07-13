const express = require('express');
const router = express.Router({ mergeParams: true });
const projectMemberController = require('../../controllers/api/projectMemberController');

router.get('/', projectMemberController.getProjectMembers);
router.post('/', projectMemberController.addProjectMembers);

router.get('/nonmembers', projectMemberController.getProjectNonMembers);

module.exports = router;