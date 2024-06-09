const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwt');

router.use('/projects', verifyToken, require('./projectRouter'));
router.use('/releases', verifyToken, require('./releaseRouter'));
router.use('/modules', verifyToken, require('./moduleRouter'));
router.use('/testPlans', verifyToken, require('./testPlanRouter'));
router.use('/testPlanComponents', verifyToken, require('./testPlanComponentRouter'));
router.use('/issues', verifyToken, require('./issueRouter'));
router.use('/attachments', verifyToken, require('./attachmentRouter'));
router.use('/auth', require('./authRouter'));

module.exports = router;