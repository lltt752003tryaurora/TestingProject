const express = require('express');
const router = express.Router();
const releaseController = require('../controllers/releaseController');

router.get('/:releaseId', releaseController.getReleaseById);

module.exports = router;