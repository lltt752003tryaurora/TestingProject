const express = require('express');
const router = express.Router();
const releaseController = require('../controllers/releaseController');

router.get('/:releaseId', releaseController.getReleaseById);
router.post('/', releaseController.createRelease);
router.patch('/:releaseId', releaseController.editRelease);
router.delete('/:releaseId', releaseController.deleteRelease);

module.exports = router;