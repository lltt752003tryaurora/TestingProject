const controller = {}

controller.entry = async (req, res, next) => {
	res.render('landing', {title: 'Welcome', layout: 'blank'});
}

controller.login = async (req, res, next) => {
	res.render('login', {title: 'Login', layout: 'auth'});
}

controller.signup = async (req, res, next) => {
	res.render('signup', {title: 'Sign Up', layout: 'auth'});
}

module.exports = controller;