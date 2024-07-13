const express = require('express');
const router = express.Router({ mergeParams: true });
const testCaseController = require('../../controllers/api/testCaseController');

router.get('/:testCaseId', testCaseController.getTestCaseById);
router.get('/:testCaseId/testRuns', testCaseController.getTestCaseTestRuns);

router.get('/', testCaseController.getTestCases);
router.post('/', testCaseController.createTestCase);
router.put('/:testCaseId', testCaseController.editTestCase);
router.delete('/:testCaseId', testCaseController.deleteTestCase);

module.exports = router;