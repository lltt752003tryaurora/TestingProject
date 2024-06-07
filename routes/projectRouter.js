const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/:projectId', projectController.getProjectById);

router.get('/:projectId/members', projectController.getProjectMembers);


module.exports = router;