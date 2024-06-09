const express = require('express');
const router = express.Router();
const testCaseController = require('../controllers/testCaseController');

router.get('/:testCaseId', testCaseController.getTestCaseById);
router.get('/:testCaseId/testRuns', testCaseController.getTestCaseTestRuns);

module.exports = router;