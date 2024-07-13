const express = require('express');
const router = express.Router({ mergeParams: true });
const issueController = require('../../controllers/api/issueController');
const commentController = require('../../controllers/api/commentController');

router.get('/', issueController.getIssues);
router.post('/', issueController.createIssue);
router.put('/:issueId', issueController.editIssues);
router.delete('/:issueId', issueController.deleteIssues);

router.post('/comments', commentController.addComment);
router.delete('/comments/:commentId', commentController.deleteComment);

router.use('/:issueId', require('./issueDetailRouter'));

module.exports = router;