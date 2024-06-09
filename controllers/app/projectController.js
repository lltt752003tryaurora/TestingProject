const controller = {}

controller.dashboard = async (req, res, next) => {
	res.render('project/dashboard', {title: 'Dashboard', currentTab: 'Dashboard'});
}

controller.requirement = async (req, res, next) => {
	res.render('project/requirement', {title: 'Requirements', currentTab: 'Requirements'});
}

controller.module = async (req, res, next) => {
	res.render('project/module', {title: 'Modules', currentTab: 'Modules'});
}

controller.release = async (req, res, next) => {
	res.render('project/release', {title: 'Releases', currentTab: 'Releases'});
}

controller.testCase = async (req, res, next) => {
	res.render('project/test_case', {title: 'Test Cases', currentTab: 'Test Cases'});
}

controller.testPlan = async (req, res, next) => {
	res.render('project/test_plan', {title: 'Test Plans', currentTab: 'Test Plans'});
}

controller.testRun = async (req, res, next) => {
	res.render('project/test_run', {title: 'Test Runs', currentTab: 'Test Runs'});
}

controller.issue = async (req, res, next) => {
	res.render('project/issue', {title: 'Issues', currentTab: 'Issues'});
}

module.exports = controller;