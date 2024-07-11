const express = require('express');
const router = express.Router({ mergeParams: true });
const testRunController = require('../controllers/testRunController');

router.get('/', testRunController.getTestRun);
router.post('/', testRunController.createTestRun);
router.put('/:testRunId', testRunController.editTestRun);
router.delete('/:testRunId', testRunController.deleteTestRun);

module.exports = router;