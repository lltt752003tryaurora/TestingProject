const controller = {}

controller.landing = async (req, res, next) => {
	res.render('landing', {title: 'Welcome', hideHeader: true});
}

controller.login = async (req, res, next) => {
	res.render('login', {title: 'Login', hideHeader: true});
}

controller.signup = async (req, res, next) => {
	res.render('signup', {title: 'Sign Up', hideHeader: true});
}

module.exports = controller;