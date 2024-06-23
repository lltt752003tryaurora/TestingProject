const express = require('express');
const router = express.Router();
const testPlanController = require('../controllers/testPlanController');

router.get('/:testPlanId', testPlanController.getTestPlanById);
router.post('/', testPlanController.createTestPlan);
router.patch('/:testPlanId', testPlanController.editTestPlan);
router.delete('/:testPlanId', testPlanController.deleteTestPlan);

module.exports = router;