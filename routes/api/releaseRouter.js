const express = require('express');
const router = express.Router({ mergeParams: true });
const releaseController = require('../../controllers/api/releaseController');

// router.get('/:releaseId', releaseController.getReleaseById);
router.get('/', releaseController.getReleases);
router.get('/:releaseId/details', releaseController.getReleaseDetails);
router.post('/', releaseController.createRelease);
router.put('/:releaseId', releaseController.editRelease);
router.delete('/:releaseId', releaseController.deleteRelease);

module.exports = router;