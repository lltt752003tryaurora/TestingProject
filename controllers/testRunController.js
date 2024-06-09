const db = require('../models/index');
const Sequelize = require('sequelize');
const {extractUserRole} = require('./filters/projectRoleFilters');

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
};

module.exports = controller;