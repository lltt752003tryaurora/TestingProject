const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');

router.get('/:issueId', issueController.getIssueById);
router.get('/:issueId/comments', issueController.getIssueComments);

module.exports = router;