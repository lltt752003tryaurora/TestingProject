const express = require('express');
const router = express.Router({ mergeParams: true });
const issueController = require('../controllers/issueController');

router.get('/', issueController.getIssues);
router.post('/', issueController.createIssue);
router.put('/:issueId', issueController.editIssues);
router.delete('/:issueId', issueController.deleteIssues);

router.use('/:issueId', require('./issueDetailRouter'));

module.exports = router;