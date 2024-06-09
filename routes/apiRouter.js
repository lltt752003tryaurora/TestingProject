const express = require('express');
const router = express.Router();

router.use('/projects', require('./projectRouter'));
router.use('/releases', require('./releaseRouter'));
router.use('/modules', require('./moduleRouter'));
router.use('/testPlans', require('./testPlanRouter'));
router.use('/testPlanComponents', require('./testPlanComponentRouter'));
router.use('/issues', require('./issueRouter'));
router.use('/attachments', require('./attachmentRouter'));
router.use("/auth", require('./authRouter'));

module.exports = router;