const { Op, where } = require('sequelize');
const db = require('../../models/index');
const activityHelper = require('../helpers/activityHelper')
const queryHelper = require('../helpers/queryHelper');
const PAGE_LIMIT = 10;

const roleMiddleware = require('../../middlewares/roleMiddleware');
const { responseData } = require('../../utils/response');

const { extractUserRole } = require('../helpers/userRoleHelper')

const { isUserProjectMember, isUserManager, isUserManagerOrTester, filterRoleOr } = require('../filters/projectRoleFilters');

const controller = {
    getProjects: [
        queryHelper.pagination,
        queryHelper.filter,
        queryHelper.search,
        async (req, res) => {
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
                if (req.size && req.page) {
                    options.limit = req.size,
                    options.offset = (req.page - 1) * req.size;
                }
                if (req.filter) {
                    options.include[0].where.role = {
                        [Op.eq]: req.filter
                    }
                }
                if (req.search) {
                    options.where.name = { [Op.iLike]: `%${req.search}%` }
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
                    numPage: req.size ? Math.ceil(projects.count / req.size) : 0,
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
        roleMiddleware.roleWhitelist(['manager', 'admin']),
        async (req, res) => {
            try {
                const userId = req.user.id;
                const { projectId } = req.params;
                const { name } = req.body;
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

                responseData(res, "Succesfully editted project", "", 200);
            }
            catch (error) {
                console.error(error);
                responseData(res, "Error editting project", "", 500);
            }
        }
    ],

    deleteProject: [
        roleMiddleware.roleWhitelist(['manager', 'admin']),
        async (req, res) => {
            try {
                const userId = req.user.id;
                const { projectId } = req.params;

                const project = await db.Project.findByPk(projectId);
                if (!project) {
                    return res.status(400).send({message: 'Project does not exist.'});
                }

                await project.destroy();

                activityHelper.createActivity(projectId, userId, 'DeleteProject', JSON.stringify({
                    project: projectId,
                    user: userId,
                }));

                responseData(res, "Succesfully deleted project", "", 200);
            }
            catch (error) {
                console.error(error);
                responseData(res, "Error deleting project", "", 500);
            }
        }
    ],
    

    getProjectById: [
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
        queryHelper.pagination,
        async (req, res) => {
            const { projectId } = req.params;
            try {
                const options = {
                    where: { projectId: projectId },
                    attributes: ['type', 'detail', 'createdAt'],
                    order: [
                        ['createdAt', 'DESC'],
                    ],
                }
                if (req.size && req.page) {
                    options.limit = req.size,
                    options.offset = (req.page - 1) * req.size
                }
                const activities = await db.Activity.findAndCountAll(options);
                let activitiesDetails = await Promise.all(activities.rows.map(async (act) => {
                    try {
                        let details = JSON.parse(act.detail);
                    } catch (e) {
                        return;
                    }
                    
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
                activitiesDetails = activitiesDetails.filter(n => n);
                res.status(200).send({
                    numActivities: activitiesDetails.length,
                    numPage: req.size ? Math.ceil(activitiesDetails.length / req.size) : 0,
                    activities: activitiesDetails
                });
            } catch (error) {
                console.error('Error retrieving activities:', error);
                responseData(res, "Failed to get project activities", "", 500);
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
                responseData(res, "Failed to get project summary", "", 500);
            }
        }
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