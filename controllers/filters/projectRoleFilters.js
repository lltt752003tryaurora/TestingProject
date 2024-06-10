const db = require('../../models/index');

const extractUserRole = async (projectId, userId) => {
    const projectMember = await db.ProjectMember.findOne({ where: { projectId: projectId, userId: userId } });
    return projectMember ? { projectId, userId, role: projectMember.role } : null;
}

const isUserProjectMember = async (req, res, next) => {
    const userId = req.user.id;
    const { projectId } = req.params;
    const projectMember = await extractUserRole(projectId, userId);
    if (projectMember !== null) {
        req.filter = projectMember;
        next();
    } else {
        return res.status(403).send({
            message: 'User is not a project member.'
        })
    }
}

const isUserManager = async (req, res, next) => {
    if (req.filter?.role === 'manager') {
        next();
    } else {
        return res.status(403).send({
            message: 'Access denied.'
        })
    }
}

const isUserManagerOrTester = async (req, res, next) => {
    if (req.filter && (req.filter.role === 'manager' || req.filter.role === 'tester')) {
        next();
    } else {
        return res.status(403).send({
            message: 'Access denied.'
        })
    }
}

module.exports = {
    extractUserRole,
    isUserProjectMember,
    isUserManager,
    isUserManagerOrTester
};