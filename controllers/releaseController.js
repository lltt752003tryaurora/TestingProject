const db = require('../models/index');
const Sequelize = require('sequelize');
const {extractUserRole} = require('./filters/projectRoleFilters');

const getRelease = async (releaseId, userId) => {
    const release = await db.Release.findOne({
        where: { id: releaseId },
        include: [{
            model: db.Project,
            as: 'project',
            attributes: ['id'],
            required: true
        }],
        attributes: {
            include: [
                [Sequelize.col('project.id'), 'projectId']
            ]
        },
        raw: true,
        nest: true
    });
    if (release) {
        release.projectId = release.project.id;
        delete release.project;
        const projectMember = await extractUserRole(release.projectId, userId);
        if (!projectMember) {
            return null;
        }
        if (projectMember.role === 'manager' || projectMember.role === 'tester') {
            return { role: projectMember.role, release };
        }
    } else {
        return null;
    }
}


const controller = {
    getReleaseById: async (req, res) =>  {
        const userId = req.user.id;
        const { releaseId } = req.params;
        const options = {
            where: {
                id: releaseId
            },
            include: [{
                model: db.TestPlan,
                as: 'testPlans',
                attributes: ['id', 'name']
            }]
        }
        try {
            const { role, release } = getRelease(releaseId, userId);
            const releaseWithTestPlans = await db.Release.findAll(options);
            if (releaseWithTestPlans && releaseWithTestPlans.length === 1) {
                res.send({
                    release: releaseWithTestPlans[0].toJSON()
                });
            } else {
                res.status(404).send({
                    messsage: 'Release does not exist.'
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    }
};

module.exports = controller;