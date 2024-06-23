const db = require('../../models/index');

const extractUserRole = async (projectId, userId) => {
    const projectMember = await db.ProjectMember.findOne({ where: { projectId: projectId, userId: userId } });
    return projectMember ? { projectId, userId, role: projectMember.role } : null;
}

module.exports = {
    extractUserRole
};