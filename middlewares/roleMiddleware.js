const { getRoleSpecificity } = require('../entities/role.js');
const { responseData } = require('../utils/response.js');
const errorPage = require('../utils/errorPage.js')

const notAllowed = (req, res, next) => {
	if (req.environment === 'api') {
		responseData(res, 'You do not have permission for this action', '', 403);
	}
	else if (req.environment === 'app') {
		errorPage.show403(res);
	}
}

const isProjectMember = (ifNotCallback = null) => {
	return (req, res, next) => {
		allowRoleFrom('member', ifNotCallback)(req, res, next);
	}
}

const allowRoleFrom = (role, ifNotCallback = null) => {
	role = getRoleSpecificity(role);
	return (req, res, next) => {
		if (req.user.role >= role) {
			next();
		}
		else {
			if (ifNotCallback)
				ifNotCallback(req, res, next);
			else
				notAllowed(req, res, next);
		}
	}
}

const allowRoleTo = (role, ifNotCallback = null) => {
	role = getRoleSpecificity(role);
	return (req, res, next) => {
		if (req.user.role <= role) {
			next();
		}
		else {
			if (ifNotCallback)
				ifNotCallback(req, res, next);
			else
				notAllowed(req, res, next);
		}
	}
}

const roleWhitelist = (role, ifNotCallback = null) => {
	roleArr = role.map(x => getRoleSpecificity(x));
	return (req, res, next) => {
		if (roleArr.includes(req.user.role)) {
			next();
		}
		else {
			if (ifNotCallback)
				ifNotCallback(req, res, next);
			else
				notAllowed(req, res, next);
		}
	}
}

const roleBlacklist = (role, ifNotCallback = null) => {
	roleArr = role.map(x => getRoleSpecificity(x));
	return (req, res, next) => {
		if (!roleArr.includes(req.user.role)) {
			next();
		}
		else {
			if (ifNotCallback)
				ifNotCallback(req, res, next);
			else
				notAllowed(req, res, next);
		}
	}
}

module.exports = {
	isProjectMember,
	allowRoleFrom,
	allowRoleTo,
	roleWhitelist,
	roleBlacklist
}