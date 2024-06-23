const express = require('express');
const router = express.Router({ mergeParams: true });
const requirementController = require('../controllers/requirementController');

router.get('/', requirementController.getRequirements);
router.put('/', requirementController.createRequirement);
router.patch('/:requirementId', requirementController.editRequirement);
router.delete('/:requirementId', requirementController.deleteRequirement);

module.exports = router;