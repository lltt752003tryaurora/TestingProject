const express = require('express');
const router = express.Router({ mergeParams: true });
const requirementController = require('../../controllers/api/requirementController');

router.get('/:requirementId', requirementController.getRequirementById);
router.get('/', requirementController.getRequirements);
router.post('/', requirementController.createRequirement);
router.put('/:requirementId', requirementController.editRequirement);
router.delete('/:requirementId', requirementController.deleteRequirement);

module.exports = router;