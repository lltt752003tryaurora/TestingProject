const { getUserFromToken } = require('../utils/jwt.js');
const { ProjectRole, getRoleSpecificity } = require('../entities/role.js');
const db = require('../models/index');

const getUserInfo = async (req, res, next) => {
	req.user = getUserFromToken(req.cookies.accessToken);
	const user = await db.User.findByPk(req.user.id);
	if (user && user.isAdmin) {
		req.user.role = ProjectRole.ADMIN;
	}
	next();
}

const getUserOfProject = async (req, res, next) => {
	req.user = getUserFromToken(req.cookies.accessToken);

	const userId = req.user.id;
	const user = await db.User.findByPk(userId);
	if (user && user.isAdmin) {
		req.user.role = ProjectRole.ADMIN;
		return next();
	}

	const projectId = req.params.projectId;
	const projectMember = await db.Project.findOne({
		include: [{
			model: db.ProjectMember,
			as: 'members',
			where: {
				userId: userId
			}
		}],
		where: { id: projectId }
	});
	if (projectMember)
		req.user.role = getRoleSpecificity(projectMember.members[0].role);
	
	else req.user.role = ProjectRole.NONE;

	next();
}

module.exports = {
	getUserInfo,
	getUserOfProject,
}