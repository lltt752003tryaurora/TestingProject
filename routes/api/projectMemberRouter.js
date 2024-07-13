const express = require('express');
const router = express.Router({ mergeParams: true });
const projectMemberController = require('../../controllers/api/projectMemberController');
const {roleWhitelist} = require("../../middlewares/roleMiddleware")

router.get('/', projectMemberController.getProjectMembers);
router.post('/', roleWhitelist(['manager']), projectMemberController.changeProjectMembers);
router.put('/', roleWhitelist(['manager']), projectMemberController.changeProjectMembers);

router.get('/nonmembers', projectMemberController.getProjectNonMembers);

module.exports = router;