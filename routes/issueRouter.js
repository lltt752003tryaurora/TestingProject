const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');

router.get('/:issueId', issueController.getIssueById);

module.exports = router;