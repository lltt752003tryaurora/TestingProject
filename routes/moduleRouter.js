const express = require('express');
const router = express.Router({ mergeParams: true });
const moduleController = require('../controllers/moduleController');

// router.get('/:moduleId', moduleController.getModuleById);
router.get('/', moduleController.getModules);
router.put('/', moduleController.createModule);
router.patch('/:moduleId', moduleController.editModule);
router.delete('/:moduleId', moduleController.deleteModule);

module.exports = router;