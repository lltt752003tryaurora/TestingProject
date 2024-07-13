const express = require('express');
const router = express.Router();
const testPlanComponentController = require('../../controllers/api/testPlanComponentController');

router.get('/:testPlanComponentId', testPlanComponentController.getTestPlanComponentById);

module.exports = router;