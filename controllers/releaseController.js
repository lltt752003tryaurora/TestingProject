const db = require('../models/index');
const Sequelize = require('sequelize');
const {extractUserRole} = require('./helpers/userRoleHelper');
const { extractProjectIdFromRelease, filterRoleOr } = require('./filters/projectRoleFilters');
const activityHelper = require('./helpers/activityHelper');

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
    },

    createRelease: [
        filterRoleOr(['manager']),
        async (req, res, next) => {
            try {
                const userId = req.user.id;
                const { projectId } =  req.body;
                const name = req.body.name;
                if (!name || name.trim() === '') {
                    return res.status(400).send({
                        message: 'Release name must not be empty.'
                    });
                }
                const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
                const endDate = req.body.endDate ? new Date(req.body.endDate) : null;
                if (!endDate || endDate < startDate) {
                    return res.status(400).send({ message: 'Invalid timestamp.' });
                }

                const newRelease = await db.Release.create({
                    name,
                    projectId,
                    startDate,
                    endDate
                });
                const releaseId = newRelease.id;

                activityHelper.createActivity(projectId, userId, 'CreateRelease', JSON.stringify({
                    project: projectId,
                    releaseId: releaseId,
                    user: userId,
                }));

                return res.status(201).send({
                    message: 'Release created successfully.',
                    releaseId: releaseId,
                });
            } catch (err) {
                if (err.name === 'SequelizeValidationError') {
                    return res.status(400).send({ message: 'Validation error.', details: err.errors });
                } else {
                    return res.status(500).send({ message: 'An error occurred while creating the release.' });
                }
            }
        }
    ],

    editRelease: [
        extractProjectIdFromRelease,
        filterRoleOr(['manager']),
        async (req, res, next) => {
            try {
                const userId = req.user.id;
                const projectId = req.project.id;
                const { releaseId } = req.params;
                const { name, startDate, endDate } = req.body;
                if (name && name.trim() === '') {
                    return res.status(400).send('Release name must not be empty.');
                }

                const release = await db.Release.findByPk(releaseId);
                if (!release) {
                    return res.status(400).send('Release does not exist.');
                }
                if (name) release.name = name;
                if (startDate && endDate) {
                    const newStartDate = new Date(startDate);
                    const newEndDate = new Date(endDate);
                    if (newStartDate > newEndDate) {
                        return res.status(400).send('Invalid timestamps.');
                    }
                    release.startDate = newStartDate;
                    release.endDate = newEndDate;
                } else if (startDate) {
                    const newStartDate = new Date(startDate);
                    if (newStartDate > release.endDate) {
                        return res.status(400).send('Invalid timestamps.');
                    }
                    release.startDate = newStartDate;
                } else if (endDate) {
                    const newEndDate = new Date(endDate);
                    if (release.startDate > newEndDate) {
                        return res.status(400).send('Invalid timestamps.');
                    }
                    release.endDate = newEndDate;
                }

                await release.save();

                activityHelper.createActivity(projectId, userId, 'EditRelease', JSON.stringify({
                    project: projectId,
                    releaseId: releaseId,
                    user: userId,
                }));

                return res.status(200).send({
                    message: 'Released edited successfully.'
                });
            } catch (err) {
                return res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    deleteRelease: [
        extractProjectIdFromRelease,
        filterRoleOr(['manager']),
        async (req, res, next) => {
            try {
                const userId = req.user.id;
                const projectId = req.project.id;
                const { releaseId } = req.params;

                const release = await db.Release.findByPk(releaseId);
                if (!release) {
                    return res.status(400).send({message: 'Release does not exist.'});
                }

                await release.destroy();

                activityHelper.createActivity(projectId, userId, 'DeleteRelease', JSON.stringify({
                    project: projectId,
                    releaseId: releaseId,
                    user: userId,
                }));

                return res.status(200).send({
                    message: 'Released deleted successfully.'
                });
            } catch (err) {
                return res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ]
};

module.exports = controller;