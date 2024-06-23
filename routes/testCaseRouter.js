const express = require('express');
const router = express.Router();
const testCaseController = require('../controllers/testCaseController');

// GET
router.get('/:testCaseId', testCaseController.getTestCaseById);
router.get('/:testCaseId/testRuns', testCaseController.getTestCaseTestRuns);

// POST
router.post('/', testCaseController.createTestCase);

router.patch('/:testCaseId', testCaseController.editTestCase);

router.delete('/:testCaseId', testCaseController.deleteTestCase);

module.exports = router;