const { getUserFromToken } = require('../utils/jwt.js');
const { ProjectRole, getRoleSpecificity } = require('../entities/role.js');
const db = require('../models/index');

const allowRoleFrom = (role, ifNotCallback = null) => {
	return (req, res, next) => {
		if (req.user.role >= role) {
			next();
		}
		else {
			if (ifNotCallback)
				ifNotCallback(req, res, next);
		}
	}
}

const allowRoleTo = (role, ifNotCallback = null) => {
	return (req, res, next) => {
		if (req.user.role <= role) {
			next();
		}
		else {
			if (ifNotCallback)
				ifNotCallback(req, res, next);
		}
	}
}

const roleWhitelist = (roleArr, ifNotCallback = null) => {
	return (req, res, next) => {
		if (roleArr.includes(req.user.role)) {
			next();
		}
		else {
			if (ifNotCallback)
				ifNotCallback(req, res, next);
		}
	}
}

const roleBlacklist = (roleArr, ifNotCallback = null) => {
	return (req, res, next) => {
		if (!roleArr.includes(req.user.role)) {
			next();
		}
		else {
			if (ifNotCallback)
				ifNotCallback(req, res, next);
		}
	}
}

module.exports = {
	allowRoleFrom,
	allowRoleTo,
	roleWhitelist,
	roleBlacklist
}