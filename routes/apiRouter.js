const express = require('express');
const router = express.Router();

router.use('/projects', require('./projectRouter'));
router.use('/releases', require('./releaseRouter'));
router.use('/modules', require('./moduleRouter'));
router.use('/testPlans', require('./testPlanRouter'));
rootRoute.use("/auth", require('./authRouter'));

module.exports = router;