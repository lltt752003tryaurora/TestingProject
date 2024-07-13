const express = require('express');
const router = express.Router({ mergeParams: true });
const moduleController = require('../../controllers/api/moduleController');

// router.get('/:moduleId', moduleController.getModuleById);
router.get('/', moduleController.getModules);
router.post('/', moduleController.createModule);
router.put('/:moduleId', moduleController.editModule);
router.delete('/:moduleId', moduleController.deleteModule);

module.exports = router;