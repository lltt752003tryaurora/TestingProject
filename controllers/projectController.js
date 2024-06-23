const { Op, where } = require('sequelize');
const db = require('../models/index');
const activityHelper = require('./helpers/activityHelper')

const PAGE_LIMIT = 10;

const { extractUserRole } = require('./helpers/userRoleHelper')

const { isUserProjectMember, isUserManager, isUserManagerOrTester, filterRoleOr } = require('./filters/projectRoleFilters');

const controller = {
    getProjects: [
        async (req, res) => {
            let { page, size, filter, search } = req.query;
            page = parseInt(page);
            size = parseInt(size);
            if (size <= 0) size = null;
            if (page <= 0) page = null;
            try {
                const options = {
                    where: {},
                    include: [{
                        model: db.ProjectMember,
                        where: { userId: req.user.id },
                        attributes: ['role'],
                        as: 'members'
                    }],
                    attributes: ['id', 'name', 'updatedAt'],
                    distinct: true
                }
                if (size && page) {
                    options.limit = size,
                    options.offset = (page - 1) * size
                }
                if (filter) {
                    options.include[0].where.role = {
                        [Op.eq]: filter
                    }
                }
                if (search) {
                    options.where.name = { [Op.iLike]: `%${search}%` }
                }
                let projects = await db.Project.findAndCountAll(options);
                const projectsWithDetails = await Promise.all(projects.rows.map(async (project) => {
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

                    const userCount = await db.ProjectMember.count({
                        where: {
                            projectId: project.id,
                        },
                        distinct: true,
                        col: 'userId' 
                    })

                    return {
                        ...project.get({ plain: true }),
                        casesCount,
                        runsCount,
                        issueCount,
                        userCount
                    };
                }));

                res.send({
                    numPage: Math.ceil(projects.count / size),
                    numProject: projects.count,
                    projects: projectsWithDetails
                });
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
                const { projectId } = req.params;
                const { name } = req.body;
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
                const { projectId } = req.params;
                const userRole = await extractUserRole(projectId, userId);
                if (userRole?.role != 'manager') {
                    return res.status(403).send({
                        message: 'Access denied.'
                    })
                }

                const project = await db.Project.findByPk(projectId);
                if (!project) {
                    return res.status(400).send({message: 'Project does not exist.'});
                }

                await project.destroy();

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
            let { page, size } = req.query;
            page = parseInt(page); size = parseInt(size);
            if (size <= 0) size = null;
            if (page <= 0) page = null;
            const { projectId } = req.params;
            try {
                const options = {
                    where: { projectId: projectId },
                    attributes: ['type', 'detail', 'createdAt'],
                    order: [
                        ['createdAt', 'DESC'],
                    ],
                }
                if (size && page) {
                    options.limit = size,
                    options.offset = (page - 1) * size
                }
                const activities = await db.Activity.findAndCountAll(options);
                const activitiesDetails = await Promise.all(activities.rows.map(async (act) => {
                    let details = JSON.parse(act.detail);

                    let explains = {};
                    await Promise.all(Object.keys(details).map(async function(key) {
                        let tmp = await activityHelper.activityExplainer(key, details[key]);
                        explains[key] = tmp;
                    }))

                    return {
                        ...act.get({ plain: true }),
                        explains: explains
                    };
                }));
                res.status(202).send({
                    numActivities: activities.count,
                    numPage: Math.ceil(activities.count / size),
                    activities: activitiesDetails
                });
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
}

module.exports = controller;