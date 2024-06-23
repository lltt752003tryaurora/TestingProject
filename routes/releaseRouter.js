const express = require('express');
const router = express.Router({ mergeParams: true });
const releaseController = require('../controllers/releaseController');

// router.get('/:releaseId', releaseController.getReleaseById);
router.get('/', releaseController.getReleases);
router.put('/', releaseController.createRelease);
router.patch('/:releaseId', releaseController.editRelease);
router.delete('/:releaseId', releaseController.deleteRelease);

module.exports = router;