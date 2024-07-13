const express = require('express');
const router = express.Router({ mergeParams: true });
const issueDetailController = require('../../controllers/api/issueDetailController');

router.get('/comments', issueDetailController.getIssueComments);
router.get('/attachments', issueDetailController.getIssueAttachments);

module.exports = router;