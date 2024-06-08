const express = require('express');
const router = express.Router();
const testPlanController = require('../controllers/testPlanController');

router.get('/:testPlanId', testPlanController.getTestPlanById);

module.exports = router;