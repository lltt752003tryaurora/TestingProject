const db = require('../../models/index');
const Sequelize = require('sequelize');
const { extractUserRole } = require('../helpers/userRoleHelper');
const activityHelper = require('../helpers/activityHelper');
const queryHelper = require('../helpers/queryHelper');
const { extractProjectFromTestCase, isUserProjectMember, isUserManager, isUserManagerOrTester, filterRoleOr } = require('../filters/projectRoleFilters');

const getTestRun = async (testRunId, userId) => {
    const testRun = await db.TestRun.findOne({
        where: { id: testRunId },
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
                        attributes: ['id'],
                        required: true
                    }]
                }]
            }]
        }],
        attributes: {
            include: [
                [Sequelize.col('testCase.testPlan.release.project.id'), 'projectId']
            ]
        },
        raw: true,
        nest: true
    });
    if (testRun) {
        testRun.projectId = testRun.testCase.testPlan.release.project.id;
        delete testRun.testCase;
        const projectMember = await extractUserRole(testRun.projectId, userId);
        if (!projectMember) {
            return null;
        }
        if (projectMember.role === 'manager' || projectMember.role === 'tester') {
            return { role: projectMember.role, testRun };
        }
    } else {
        return null;
    }
}

const controller = {
    getTestRunById: async (req, res) => {
        const userId = req.user.id;
        const { testRunId } = req.params;
        try {
            const { role, testRun } = await getTestRun(testRunId, userId);
            if (testRun) {
                res.send({
                    testRun: testRun
                });
            } else {
                res.status(400).send({
                    message: 'TestRun does not exist or user does not have permission.'
                })
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    },

    getTestRunIssues: async (req, res) => {
        const userId = req.user.id;
        const { testRunId } = req.params;
        try {
            const { role, testRun } = await getTestRun(testRunId, userId);
            const options = {
                where: {
                    testRunId: testRunId,
                },
                order: [['createdAt', 'ASC']]
            }
            // if (isUserManager === false) {
            //     options.where.creatorUserId = userId;
            // }
            if (testRun) {
                console.log(options);
                const issues = await db.Issue.findAll(options);
                return res.send({
                    issues: issues.map(issue => issue.toJSON())
                });
            } else {
                res.status(400).send({
                    message: 'TestRun does not exist or user does not have permission.'
                })
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    },

    getTestRun: [
        queryHelper.pagination,
        queryHelper.search,
        queryHelper.sort,
        async (req, res) => {
            const { projectId } = req.params;
            const options = {
                where: {},
                order: [['id', 'ASC']],
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

            if (req.size && req.page) {
                options.limit = req.size,
                options.offset = (req.page - 1) * req.size;
            }
            if (req.sortBy && req.sortOrder) {
                const sortField = req.sortBy === 'updatedAt' ? 'updatedAt' : 'id';
                const sortOrder = req.sortOrder === 'asc' ? 'ASC' : 'DESC';
                options.order = [[sortField, sortOrder]];
            }
            if (req.search) {
                options.where.name = { [Op.iLike]: `%${req.search}%` }
            }
            try {
                const projectTestRuns = await db.TestRun.findAndCountAll(options);
                return res.send({
                    numPage: req.size ? Math.ceil(projectTestRuns.count / req.size) : 0,
                    numTestRuns: projectTestRuns.count,
                    testRuns: projectTestRuns.rows.map(testRun => {
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

    createTestRun: [
        async (req, res, next) => {
            try {
                const userId = req.user.id;
                const { testCaseId, assignedUserId, name } = req.body;
                if (!testCaseId) {
                    return res.status(400).send('Missing test case ID.');
                }
                if (!assignedUserId) {
                    return res.status(400).send('Missing assigned user ID.');
                }
                if (!name || name.trim() === '') {
                    return res.status(400).send({
                        message: 'Test run name must not be empty.'
                    });
                }

                const newTestRun = await db.TestRun.create({
                    testCaseId,
                    assignedUserId,
                    name
                });
                const testRunId = newTestRun.id;

                // Assuming activity logging is desired
                activityHelper.createActivity(projectId, userId, 'CreateTestRun', JSON.stringify({
                    testRunId: testRunId,
                    user: userId,
                }));

                return res.status(201).send({
                    message: 'Test run created successfully.',
                    testRunId: testRunId,
                });
            } catch (err) {
                console.error(err);
                return res.status(500).send({ message: 'An error occurred while creating the test run.' });
            }
        }
    ],

    editTestRun: [
        extractProjectFromTestCase,
        filterRoleOr(['manager']),
        async (req, res) => {
            try {
                const { testRunId } = req.params;
                const { name, assignedUserId } = req.body;
                if (!testRunId) {
                    return res.status(400).send('Missing test run ID.');
                }

                const testRun = await db.TestRun.findByPk(testRunId);
                if (!testRun) {
                    return res.status(400).send('Test run does not exist.');
                }
                if (name) testRun.name = name.trim() ? name : testRun.name;
                if (assignedUserId) testRun.assignedUserId = assignedUserId;

                await testRun.save();

                // Assuming activity logging is desired
                activityHelper.createActivity(projectId, userId, 'EditTestRun', JSON.stringify({
                    testRunId: testRunId,
                    user: userId,
                }));

                return res.status(200).send({
                    message: 'Test run edited successfully.'
                });
            } catch (err) {
                console.error(err);
                return res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    deleteTestRun: [
        extractProjectFromTestCase, // Adjust accordingly if necessary
        filterRoleOr(['manager']),
        async (req, res) => {
            try {
                const { testRunId } = req.params;

                const testRun = await db.TestRun.findByPk(testRunId);
                if (!testRun) {
                    return res.status(400).send('Test run does not exist.');
                }

                await testRun.destroy();

                // Assuming activity logging is desired
                activityHelper.createActivity(projectId, userId, 'DeleteTestRun', JSON.stringify({
                    testRunId: testRunId,
                    user: userId,
                }));

                return res.status(200).send({
                    message: 'Test run deleted successfully.'
                });
            } catch (err) {
                console.error(err);
                return res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ]
};

module.exports = controller;