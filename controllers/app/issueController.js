const controller = {}

controller.issue = async (req, res, next) => {
	res.render('project/issue', {title: 'Issues', currentTab: 'Issues'});
}

module.exports = controller;