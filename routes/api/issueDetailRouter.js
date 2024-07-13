const express = require('express');
const router = express.Router({ mergeParams: true });
const issueDetailController = require('../../controllers/api/issueDetailController');
const commentController = require("../../controllers/api/commentController")

router.get('/comments', commentController.getComments);
router.post('/comments', commentController.addComment);
router.delete('/comments/:commentId', commentController.deleteComment);

router.get('/attachments', issueDetailController.getIssueAttachments);

module.exports = router;