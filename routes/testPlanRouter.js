const express = require('express');
const router = express.Router({ mergeParams: true });
const testPlanController = require('../controllers/testPlanController');

// router.get('/:testPlanId', testPlanController.getTestPlanById);
router.get('/', testPlanController.getTestPlans);
router.put('/', testPlanController.createTestPlan);
router.patch('/:testPlanId', testPlanController.editTestPlan);
router.delete('/:testPlanId', testPlanController.deleteTestPlan);

module.exports = router;