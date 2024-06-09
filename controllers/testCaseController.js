const db = require('../models/index');
const Sequelize = require('sequelize');
const { extractUserRole } = require('./filters/projectRoleFilters');

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
};

module.exports = controller;