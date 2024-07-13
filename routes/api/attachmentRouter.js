const express = require('express');
const router = express.Router();
const attachmentController = require('../../controllers/api/attachmentController');

router.get('/', attachmentController.getAttachmentByName);
router.get('/:attachmentId', attachmentController.getAttachmentById);

module.exports = router;