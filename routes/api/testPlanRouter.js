const express = require('express');
const router = express.Router({ mergeParams: true });
const testPlanController = require('../../controllers/api/testPlanController');
const { roleWhitelist } = require('../../middlewares/roleMiddleware');

// router.get('/:testPlanId', testPlanController.getTestPlanById);
router.get('/', testPlanController.getTestPlans);
router.post('/', testPlanController.createTestPlan);
router.put('/:testPlanId', testPlanController.editTestPlan);
router.delete('/:testPlanId', roleWhitelist(['manager']), testPlanController.deleteTestPlan);

module.exports = router;