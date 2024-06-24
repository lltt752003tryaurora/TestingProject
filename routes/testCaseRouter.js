const express = require('express');
const router = express.Router({ mergeParams: true });
const testCaseController = require('../controllers/testCaseController');

// GET
router.get('/:testCaseId', testCaseController.getTestCaseById);
router.get('/:testCaseId/testRuns', testCaseController.getTestCaseTestRuns);

// POST
router.get('/', testCaseController.getTestCases);
router.put('/', testCaseController.createTestCase);

router.patch('/:testCaseId', testCaseController.editTestCase);

router.delete('/:testCaseId', testCaseController.deleteTestCase);

module.exports = router;