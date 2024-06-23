const db = require('../models/index');
const Sequelize = require('sequelize');
const { extractUserRole } = require('./helpers/userRoleHelper');
const { isValidDate } = require('./validation/validation');
const { extractProjectFromTestCase, filterRoleOr } = require('./filters/projectRoleFilters');
const activityHelper = require('./helpers/activityHelper');

const TEST_CASE_PRIORITIES = ['low', 'medium', 'high'];

const getTestCase = async (testCaseId, userId) => {
    const testCase = await db.TestCase.findOne({
        where: { id: testCaseId },
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
        }],
        attributes: {
            include: [
                [Sequelize.col('testPlan.release.project.id'), 'projectId']
            ]
        },
        raw: true,
        nest: true
    });
    if (testCase) {
        testCase.projectId = testCase.testPlan.release.project.id;
        delete testCase.testPlan;
        const projectMember = await extractUserRole(testCase.id, userId);
        if (!projectMember) {
            return null;
        }
        if (projectMember.role === 'manager' || projectMember.role === 'tester') {
            return { role: projectMember.role, testCase };
        }
    } else {
        return null;
    }
}

const controller = {
    getTestCaseById: async (req, res) => {
        const userId = req.user.id;
        const { testCaseId } = req.params;
        try {
            const { role, testCase } = await getTestCase(testCaseId, userId);
            if (testCase) {
                res.send({
                    testCase: testCase
                });
            } else {
                res.status(400).send({
                    message: 'TestCase does not exist or user does not have permission.'
                })
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    },

    getTestCaseTestRuns: async (req, res) => {
        const userId = req.user.id;
        const { testCaseId } = req.params;
        try {
            const { role, testCase } = await getTestCase(testCaseId, userId);
            const options = {
                where: {
                    testCaseId: testCaseId,
                },
                order: [['createdAt', 'ASC']]
            }
            if (testCase) {
                const testRuns = await db.TestRun.findAll(options);
                return res.send({
                    testRuns: testRuns.map(testRun => testRun.toJSON())
                });
            } else {
                res.status(400).send({
                    message: 'TestCase does not exist or user does not have permission.'
                })
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    },

    // createTestCase: async (req, res) => {
    //     try {
    //         const { moduleId, testPlanId, name, description, type, priority, detail } = req.body;
    //         const newTestCase = {
    //             moduleId: moduleId || 5,  // Default value as example
    //             testPlanId: testPlanId || 4,
    //             name,
    //             description,
    //             type,
    //             priority: priority || 'high',
    //             detail,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //             deletedAt: null
    //         };
    //         // Assume create method saves the test case in a database
    //         const savedTestCase = await model.TestCase.create(newTestCase);
    //         res.status(201).send(savedTestCase);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send({ message: "Error creating the test case" });
    //     }
    // },

    createTestCase: [
        filterRoleOr(['manager']),
        async (req, res, next) => {
            try {
                const userId = req.user.id;
                const projectId = req.project.id;
                const { testPlanId } =  req.body;
                if (!testPlanId) {
                    return res.status(400).send('Missing test plan ID.');
                }
                const name = req.body.name;
                if (!name || name.trim() === '') {
                    return res.status(400).send({
                        message: 'Test case name must not be empty.'
                    });
                }
                const description = req.body.description || '';
                const detail = req.body.detail || '';
                const moduleId = req.body.moduleId;
                if (!moduleId) {
                    return res.status(400).send({
                        message: 'Missing module ID.'
                    });
                }
                const type = req.body.type;
                if (!type) {
                    return res.status(400).send({
                        message: 'Missing type.'
                    });
                }
                const priority = req.body.priority;
                if (!priority || !TEST_CASE_PRIORITIES.includes(priority)) {
                    return res.status(400).send({
                        message: 'Invalid or missing priority.'
                    });
                }

                const newTestCase = await db.TestCase.create({
                    name,
                    description,
                    detail,
                    type,
                    priority,
                    testPlanId,
                    moduleId,
                });
                const testCaseId = newTestCase.id;

                activityHelper.createActivity(projectId, userId, 'CreateTestCase', JSON.stringify({
                    project: projectId,
                    testCaseId: testCaseId,
                    user: userId,
                }));

                return res.status(201).send({
                    message: 'Test case created successfully.',
                    testCaseId: testCaseId,
                });
            } catch (err) {
                if (err.name === 'SequelizeValidationError') {
                    return res.status(400).send({ message: 'Validation error.', details: err.errors });
                } else {
                    return res.status(500).send({ message: 'An error occurred while creating the test case.' });
                }
            }
        }
    ],

    editTestCase: [
        extractProjectFromTestCase,
        filterRoleOr(['manager']),
        async (req, res, next) => {
            try {
                const userId = req.user.id;
                const projectId = req.project.id;
                const { testCaseId } = req.params;
                const { name, description, detail, type, priority } = req.body;
                if (!testCaseId) {
                    return res.status(400).send('Missing test case ID.');
                }
                if (name && name.trim() === '') {
                    return res.status(400).send('Test case name must not be empty.');
                }

                const testCase = await db.TestCase.findByPk(testCaseId);
                if (!testCase) {
                    return res.status(400).send('Test case does not exist.');
                }
                if (name) testCase.name = name;
                if (description) testCase.description = description;
                if (detail) testCase.detail = detail;
                if (type) testCase.type = type;
                if (priority) {
                    if (!TEST_CASE_PRIORITIES.includes(priority)) {
                        return res.status(400).send({
                            message: 'Invalid priority.'
                        })
                    }
                    testCase.priority = priority;
                }

                await testCase.save();

                activityHelper.createActivity(projectId, userId, 'EditTestCase', JSON.stringify({
                    project: projectId,
                    testCaseId: testCaseId,
                    user: userId,
                }));

                return res.status(200).send({
                    message: 'Test case edited successfully.'
                });
            } catch (err) {
                return res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    deleteTestCase: [
        extractProjectFromTestCase,
        filterRoleOr(['manager']),
        async (req, res, next) => {
            try {
                const userId = req.user.id;
                const projectId = req.project.id;
                const { testCaseId } = req.params;

                const testCase = await db.TestCase.findByPk(testCaseId);
                if (!testCase) {
                    return res.status(400).send('Test case does not exist.');
                }

                await testCase.destroy();

                activityHelper.createActivity(projectId, userId, 'DeleteTestCase', JSON.stringify({
                    project: projectId,
                    testCaseId: testCaseId,
                    user: userId,
                }));

                return res.status(200).send({
                    message: 'Test case deleted successfully.'
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