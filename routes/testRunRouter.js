const express = require('express');
const router = express.Router();
const testRunController = require('../controllers/testRunController');

router.get('/:testRunId', testRunController.getTestRunById);
router.get('/:testRunId/issues', testRunController.getTestRunIssues);

module.exports = router;