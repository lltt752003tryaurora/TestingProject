const db = require('../../models/index');

const isUserProjectMember = async (req, res, next) => {
    const { projectId } = req.params;
    const projectMember = await db.ProjectMember.findOne({ where: { projectId: projectId, userId: req.user.id } });
    if (projectMember !== null) {
        req.filter = {
            role: projectMember.role
        };
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

module.exports = {
    isUserProjectMember,
    isUserManager
};