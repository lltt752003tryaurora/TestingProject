const express = require('express');
const router = express.Router({ mergeParams: true });
const projectMemberController = require('../controllers/projectMemberController');

router.get('/', projectMemberController.getProjectMembers);
router.put('/', projectMemberController.addProjectMembers);

router.get('/nonmembers', projectMemberController.getProjectNonMembers);

module.exports = router;