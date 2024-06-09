const express = require('express');
const router = express.Router({mergeParams: true});
const issueController = require("../../controllers/app/issueController")

router.get('/', (req, res, next) => {
	res.render('project/issue', {title: 'Issues', currentTab: 'Issues'});
});

router.use('/:issue_id', (req, res, next) => {
	res.locals.issueId = req.params.issue_id;
	next();
})

router.get('/:issue_id', (req, res, next) => {
	res.render('project/issue_detail', {title: 'Issues ' + req.params.issue_id, currentTab: 'Issues'});
});

module.exports = router;