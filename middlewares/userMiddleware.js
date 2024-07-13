const { getUserFromToken } = require('../utils/jwt.js');
const { ProjectRole, getRoleSpecificity } = require('../entities/role.js');
const db = require('../models/index');

const getUserInfo = (req, res, next) => {
	req.user = getUserFromToken(req.cookies.accessToken);
	next();
}

const getUserOfProject = async (req, res, next) => {
	req.user = getUserFromToken(req.cookies.accessToken);

	const userId = req.user.id;
	const user = await db.User.findByPk(userId);
	if (user && user.isAdmin) {
		req.user.role = ProjectRole.ADMIN;
		next();
	}

	const projectId = req.params.projectId;
	const projectMember = await db.ProjectMember.findOne({ where: { projectId: projectId, userId: userId } });
	if (projectMember)
		req.user.role = getRoleSpecificity(projectMember.role);
	
	else req.user.role = ProjectRole.NONE;

	next();
}

module.exports = {
	getUserInfo,
	getUserOfProject,
}