const db = require('../models/index');

const controller = {
    getProjectById: async (req, res) => {
        const { projectId } = req.params;
        try {
            const project = await db.Project.findByPk(projectId);
            if (project) {
                res.send(project.toJSON());
            } else {
                console.log('Not found');
                res.status(404).send({
                    message: 'Project not found.'
                });
            }
        } catch (error) {
            console.error('Error retrieving project:', error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    },

    getProjectMembers: async (req, res) => {
        const { projectId } = req.params;
        try {
            const projectMembers = await db.ProjectMember.findAll({
                where: {
                    projectId: projectId
                }
            });
            res.send(projectMembers.map(member => member.toJSON()));
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    }
}

module.exports = controller;