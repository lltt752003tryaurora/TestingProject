const { Op, where } = require('sequelize');
const db = require('../models/index');
const activityHelper = require('./helpers/activityHelper')

const PAGE_LIMIT = 10;

const { extractUserRole } = require('./helpers/userRoleHelper')

const { isUserProjectMember, isUserManager, isUserManagerOrTester, filterRoleOr } = require('./filters/projectRoleFilters');

const controller = {
    getProjects: [
        async (req, res) => {
            const { page, size } = req.params;
            try {
                const projects = await db.Project.findAll({
                    where: {
                        deletedAt: {
                            [Op.eq]: null
                        }
                    },
                    include: [{
                        model: db.ProjectMember,
                        where: { userId: req.user.id },
                        attributes: [],
                        as: 'members'
                    }],
                    attributes: ['id', 'name', 'updatedAt']
                });
                if (projects) {
                    const projectsWithDetails = await Promise.all(projects.map(async (project) => {
                        const casesCount = await db.TestCase.count({
                            include: [{
                                model: db.Module,
                                as: 'module',
                            }],
                            where: { '$module.projectId$': project.id }
                        });

                        const runsCount = await db.TestRun.count({
                            include: [{
                                model: db.TestCase,
                                as: 'testCase',
                                include: [{
                                    model: db.Module,
                                    as: 'module',
                                }]
                            }],
                            where: { '$testCase.module.projectId$': project.id }
                        });

                        const issueCount = await db.Issue.count({
                            include: [{
                                model: db.TestRun,
                                as: 'testRun',
                                include: [{
                                    model: db.TestCase,
                                    as: 'testCase',
                                    include: [{
                                        model: db.Module,
                                        as: 'module',
                                    }]
                                }]
                            }],
                            where: { '$testRun.testCase.module.projectId$': project.id }
                        });
    
                        return {
                            ...project.get({ plain: true }),
                            casesCount,
                            runsCount,
                            issueCount
                        };
                    }));

                    res.send(projectsWithDetails);
                } else {
                    res.status(404).send({
                        message: 'Projects not found.'
                    });
                }
            } catch (error) {
                console.error('Error retrieving project:', error);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    createProject: [
        async (req, res) => {
            try {
                const userId = req.user.id;
                const { name } = req.body;
                const newProject = await db.Project.create({
                    name
                })

                const projectId = newProject.id;

                activityHelper.createActivity(projectId, userId, 'CreateProject', JSON.stringify({
                    project: projectId,
                    user: userId,
                }));
                
                const newProjectMember = await db.ProjectMember.create({
                    role: 'manager',
                    projectId: projectId,
                    userId: userId
                })

                activityHelper.createActivity(projectId, userId, 'EditProjectMember', JSON.stringify({
                    project: projectId,
                    user: userId,
                    target: userId,
                    role: 'manager'
                }));

                res.status(200).send({
                    message: "Succesfully created new project"
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).send({
                    message: "Error creating project"
                });
            }
        }
    ],

    editProject: [
        async (req, res) => {
            try {
                const userId = req.user.id;
                const { name, projectId } = req.body;
                const userRole = await extractUserRole(projectId, userId);
                if (userRole?.role != 'manager') {
                    return res.status(403).send({
                        message: 'Access denied.'
                    })
                }
                await db.Project.update({
                    name
                }, {
                    where: {
                        id: projectId
                    }
                })

                activityHelper.createActivity(projectId, userId, 'EditProject', JSON.stringify({
                    project: projectId,
                    user: userId,
                    name: name,
                }));

                res.status(200).send({
                    message: "Succesfully editted project"
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).send({
                    message: "Error editting project"
                });
            }
        }
    ],

    deleteProject: [
        async (req, res) => {
            try {
                const userId = req.user.id;
                const { projectId } = req.body;
                const userRole = await extractUserRole(projectId, userId);
                if (userRole?.role != 'manager') {
                    return res.status(403).send({
                        message: 'Access denied.'
                    })
                }

                await db.Project.update({
                    deletedAt: new Date()
                }, {
                    where: {
                        id: projectId
                    }
                })

                activityHelper.createActivity(projectId, userId, 'DeleteProject', JSON.stringify({
                    project: projectId,
                    user: userId,
                }));

                res.status(200).send({
                    message: "Succesfully deleted project"
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).send({
                    message: "Error deleting project"
                });
            }
        }
    ],
    

    getProjectById: [
        isUserProjectMember,
        async (req, res) => {
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
        }
    ],

    getProjectActivity: [
        async (req, res) => {
            const { projectId } = req.params;
            try {
                const activities = await db.Activity.findAll({
                    where: { projectId: projectId },
                    attributes: ['type', 'detail', 'updatedAt'],
                });
                if (activities) {
                    res.send(activities);
                } else {
                    res.status(404).send({
                        message: 'Activities not found.'
                    });
                }
            } catch (error) {
                console.error('Error retrieving activities:', error);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    getProjectSummary: [
        async (req, res) => {
            const { projectId } = req.params;
            try {
                const casesCount = await db.TestCase.count({
                    include: [{
                        model: db.Module,
                        as: 'module',
                    }],
                    where: { '$module.projectId$': projectId }
                });

                const runsCount = await db.TestRun.count({
                    include: [{
                        model: db.TestCase,
                        as: 'testCase',
                        include: [{
                            model: db.Module,
                            as: 'module',
                        }]
                    }],
                    where: { '$testCase.module.projectId$': projectId }
                });

                let currentDate = new Date();

                const plansCount = await db.TestPlan.count({
                    include: [{
                        model: db.Release,
                        as: 'release',
                        where: {
                            startDate: { [Op.lte]: currentDate },
                            endDate: { [Op.gte]: currentDate }
                        }
                    }],
                    where: { '$release.projectId$': projectId }
                });

                const ongoingRelease = await db.Release.findOne({
                    where: {
                        projectId: projectId,
                        startDate: { [Op.lte]: currentDate },
                        endDate: { [Op.gte]: currentDate }
                    },
                    attributes: ['startDate', 'endDate']
                });

                const issueCount = await db.Issue.count({
                    include: [{
                        model: db.TestRun,
                        as: 'testRun',
                        include: [{
                            model: db.TestCase,
                            as: 'testCase',
                            include: [{
                                model: db.Module,
                                as: 'module',
                                where: { projectId: projectId }
                            }]
                        }]
                    }],
                    where: { '$testRun.testCase.module.projectId$': projectId }
                });

                res.send({
                    casesCount,
                    runsCount,
                    plansCount,
                    issueCount,
                    ongoingRelease,
                });
            } catch (error) {
                console.error('Error retrieving Summary:', error);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    getProjectMembers: [
        // isUserProjectMember,
        // isUserManagerOrTester,
        filterRoleOr(['manager', 'tester']),
        async (req, res) => {
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
        }
    ],

    getProjectReleases: [
        isUserProjectMember,
        isUserManagerOrTester,
        async (req, res) => {
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
    ],

    getProjectTestPlans: [
        isUserProjectMember,
        isUserManagerOrTester,
        async (req, res) => {
            const { projectId } = req.params;
            const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
            const sortField = req.query.sort === 'updatedAt' ? 'updatedAt' : 'id';
            const sortOrder = req.query.order === 'asc' ? 'ASC' : 'DESC';
            const options = {
                offset: PAGE_LIMIT * (page - 1),
                limit: PAGE_LIMIT,
                order: [[sortField, sortOrder]],
                include: [
                    {
                        model: db.Release,
                        as: 'release',
                        where: { projectId },
                        attributes: [],
                    },
                    {
                        model: db.TestPlanComponent,
                        as: 'components',
                        attributes: ['id', 'name']
                    }
                ]
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
                    testPlans: projectTestPlans.map(testPlan => testPlan.toJSON())
                });
            } catch (error) {
                console.log(error);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        },
    ],

    getProjectModules: [
        isUserProjectMember,
        isUserManagerOrTester,
        async (req, res) => {
            const { projectId } = req.params;
            const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
            const sortField = req.query.sort === 'updatedAt' ? 'updatedAt' : 'id';
            const sortOrder = req.query.order === 'asc' ? 'ASC' : 'DESC';
            const options = {
                where: {
                    projectId: projectId,
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
    ],

    getProjectTestCases: [
        isUserProjectMember,
        isUserManagerOrTester,
        async (req, res) => {
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
                    required: true,
                    include: [{
                        model: db.Release,
                        as: 'release',
                        attributes: [],
                        required: true,
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
            const keyword = req.query.keyword || '';
            if (keyword.trim() !== '') {
                options.where.name = { [Op.iLike]: `%${keyword}%` }
            }
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
        },
    ],

    getProjectTestRuns: [
        isUserProjectMember,
        isUserManagerOrTester,
        async (req, res) => {
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
                model: db.TestCase,
                as: 'testCase',
                attributes: [],
                required: true,
                include: [{
                    model: db.TestPlan,
                    as: 'testPlan',
                    attributes: [],
                    required: true,
                    include: [{
                        model: db.Release,
                        as: 'release',
                        attributes: [],
                        required: true,
                        include: [{
                            model: db.Project,
                            as: 'project',
                            attributes: [],
                            where: { id: projectId },
                            required: true
                        }]
                    }],
                }]
            }],
        };
        const keyword = req.query.keyword || '';
        if (keyword.trim() !== '') {
            options.where.name = { [Op.iLike]: `%${keyword}%` }
        }
        try {
            const projectTestRuns = await db.TestRun.findAll(options);
            const projectTestRunCount = await db.TestRun.count({
                where: options.where,
                include: options.include,
            });
            return res.send({
                page: page,
                totalPages: Math.ceil(projectTestRunCount / PAGE_LIMIT),
                testRuns: projectTestRuns.map(testRun => {
                    return {
                        ...testRun.toJSON(),
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
    ],

    getProjectIssues: [
        isUserProjectMember,
        isUserManagerOrTester,
        async (req, res) => {
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
                    model: db.TestRun,
                    as: 'testRun',
                    attributes: [],
                    required: true,
                    include: [{
                        model: db.TestCase,
                        as: 'testCase',
                        attributes: [],
                        required: true,
                        include: [{
                            model: db.TestPlan,
                            as: 'testPlan',
                            attributes: [],
                            required: true,
                            include: [{
                                model: db.Release,
                                as: 'release',
                                attributes: [],
                                required: true,
                                include: [{
                                    model: db.Project,
                                    as: 'project',
                                    attributes: [],
                                    required: true,
                                    where: { id: projectId }
                                }]
                            }]
                        }]
                    }]
                }],
            };
            const keyword = req.query.keyword || '';
            if (keyword.trim() !== '') {
                options.where.name = { [Op.iLike]: `%${keyword}%` }
            }
            try {
                const projectIssues = await db.Issue.findAll(options);
                const projectIssueCount = await db.Issue.count({
                    where: options.where,
                    include: options.include,
                });
                return res.send({
                    page: page,
                    totalPages: Math.ceil(projectIssueCount / PAGE_LIMIT),
                    issues: projectIssues.map(issue => {
                        return {
                            ...issue.toJSON(),
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
    ],

    getProjectRequirements: [
        // isUserProjectMember,
        // isUserManager,
        filterRoleOr(['developer']),
        async (req, res) => {
        const { projectId } = req.params;
        const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        const sortField = req.query.sort === 'updatedAt' ? 'updatedAt' : 'id';
        const sortOrder = req.query.order === 'asc' ? 'ASC' : 'DESC';
        const options = {
            where: { parentRequirementId: null },
            offset: PAGE_LIMIT * (page - 1),
            limit: PAGE_LIMIT,
            order: [[sortField, sortOrder]],
            include: [
                {
                    model: db.Requirement,
                    as: 'childRequirements',
                    attributes: ['id'],
                    required: false
                },
                {
                    model: db.Release,
                    as: 'release',
                    attributes: [],
                    required: true,
                    include: [{
                        model: db.Project,
                        as: 'project',
                        attributes: [],
                        where: { id: projectId }
                    }]
                }
            ]
        };
        const keyword = req.query.keyword || '';
        if (keyword.trim() !== '') {
            options.where.name = { [Op.iLike]: `%${keyword}%` }
        }
        try {
            const projectFirstLevelRequirements = await db.Requirement.findAll(options);
            const projectFirstLevelRequirementCount = await db.Requirement.count({
                where: options.where,
                include: options.include,
            });
            return res.send({
                page: page,
                totalPages: Math.ceil(projectFirstLevelRequirementCount / PAGE_LIMIT),
                requirements: projectFirstLevelRequirements.map(requirement => {
                    return {
                        ...requirement.toJSON(),
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
    ],
}

module.exports = controller;