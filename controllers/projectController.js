const { Op, where } = require('sequelize');
const db = require('../models/index');

const PAGE_LIMIT = 10;

const controller = {
    getProjectById: async (req, res) => {
        const { projectId } = req.params;
        try {
            const project = await db.Project.findByPk(projectId);
            if (project) {
                res.send(project.toJSON());
            } else {
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
            res.send({
                members: projectMembers.map(member => member.toJSON())
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    },

    getProjectReleases: async (req, res) => {
        const { projectId } = req.params;
        const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        const sortField = req.query.sort === 'startDate' ? 'startDate' : 'id';
        const sortOrder = req.query.order === 'asc' ? 'ASC' : 'DESC';
        const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

        const dateFilter = {};
        if (startDate) {
            dateFilter[Op.gte] = startDate;
        }
        if (endDate) {
            dateFilter[Op.lte] = endDate;
        }

        const options = {
            where: {
                projectId: projectId,
                ...((startDate || endDate) ? { createdAt: dateFilter } : {})
            },
            offset: PAGE_LIMIT * (page - 1),
            limit: PAGE_LIMIT,
            order: [[sortField, sortOrder]]
        }

        const keyword = req.query.keyword || '';
        if (keyword.trim() !== '') {
            options.where.name = { [Op.iLike]: `%${keyword}%` }
        }

        try {
            const projectReleases = await db.Release.findAll(options);
            const projectReleaseCount = await db.Release.count({ where: options.where });
            return res.send({
                page: page,
                totalPages: Math.ceil(projectReleaseCount / PAGE_LIMIT),
                releases: projectReleases.map(release => release.toJSON())
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    },

    getProjectTestPlans: async (req, res) => {
        const { projectId } = req.params;
        const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        const sortField = req.query.sort === 'updatedAt' ? 'updatedAt' : 'id';
        const sortOrder = req.query.order === 'asc' ? 'ASC' : 'DESC';
        const options = {
            offset: PAGE_LIMIT * (page - 1),
            limit: PAGE_LIMIT,
            order: [[sortField, sortOrder]],
            include: [{
                model: db.Release,
                as: 'releases',
                where: { projectId },
                attributes: [],
            }]
        };
        const keyword = req.query.keyword || '';
        if (keyword.trim() !== '') {
            options.where.name = { [Op.iLike]: `%${keyword}%` }
        }
        try {
            const projectTestPlans = await db.TestPlan.findAll(options);
            const projectTestPlanCount = await db.TestPlan.count({ 
                include: options.include
            });
            return res.send({
                page: page,
                totalPages: Math.ceil(projectTestPlanCount / PAGE_LIMIT),
                releases: projectTestPlans.map(testPlan => testPlan.toJSON())
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    },

    getProjectModules: async (req, res) => {
        const { projectId } = req.params;
        const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        const sortField = req.query.sort === 'updatedAt' ? 'updatedAt' : 'id';
        const sortOrder = req.query.order === 'asc' ? 'ASC' : 'DESC';
        const options = {
            where: {
                projectId: projectId,
                parentModuleId: null
            },
            offset: PAGE_LIMIT * (page - 1),
            limit: PAGE_LIMIT,
            order: [[sortField, sortOrder]],
            include: [{
                model: db.Module,
                as: 'childModules',
                attributes: ['id'],
                required: false
            }]
        };
        const keyword = req.query.keyword || '';
        if (keyword.trim() !== '') {
            options.where.name = { [Op.iLike]: `%${keyword}%` }
        }
        try {
            const projectFirstLevelModules = await db.Module.findAll(options);
            const projectModuleCount = await db.Module.count({
                where: options.where
            });
            return res.send({
                page: page,
                totalPages: Math.ceil(projectModuleCount / PAGE_LIMIT),
                modules: projectFirstLevelModules.map(module => {
                    return {
                        ...module.toJSON(),
                    };
                })
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    },

    getProjectTestCases: async (req, res) => {
        const { projectId } = req.params;
        const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        const sortField = req.query.sort === 'updatedAt' ? 'updatedAt' : 'id';
        const sortOrder = req.query.order === 'asc' ? 'ASC' : 'DESC';
        const options = {
            where: {},
            offset: PAGE_LIMIT * (page - 1),
            limit: PAGE_LIMIT,
            order: [[sortField, sortOrder]],
            include: [{
                model: db.TestPlan,
                as: 'testPlan',
                attributes: [],
                include: [{
                    model: db.Release,
                    as: 'release',
                    attributes: [],
                    include: [{
                        model: db.Project,
                        as: 'project',
                        attributes: [],
                        where: { id: projectId },
                        required: true
                    }]
                }]
            }],
        };
        // const keyword = req.query.keyword || '';
        // if (keyword.trim() !== '') {
        //     options.include.include.include[0].where.name = { [Op.iLike]: `%${keyword}%` }
        // }
        try {
            const projectTestCases = await db.TestCase.findAll(options);
            const projectTestCaseCount = await db.TestCase.count({
                where: options.where,
                include: options.include,
            });
            return res.send({
                page: page,
                totalPages: Math.ceil(projectTestCaseCount / PAGE_LIMIT),
                testCases: projectTestCases.map(testCase => {
                    return {
                        ...testCase.toJSON(),
                    };
                })
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    }
}

module.exports = controller;