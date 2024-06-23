const db = require('../models/index');
const Sequelize = require('sequelize');
const {extractUserRole} = require('./helpers/userRoleHelper');

const getTestPlan = async (testPlanId, userId) => {
    const testPlan = await db.TestPlan.findOne({
        where: { id: testPlanId },
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
        }],
        attributes: {
            include: [
                [Sequelize.col('release.project.id'), 'projectId']
            ]
        },
        raw: true,
        nest: true
    });
    if (testPlan) {
        testPlan.projectId = testPlan.release.project.id;
        delete testPlan.release;
        const projectMember = await extractUserRole(testPlan.projectId, userId);
        if (!projectMember) {
            return null;
        }
        if (projectMember.role === 'manager' || projectMember.role === 'tester') {
            return { role: projectMember.role, testPlan };
        }
    } else {
        return null;
    }
}

controller = {
    getTestPlanById: async (req, res) => {
        const userId = req.user.id;
        const { testPlanId } = req.params;
        
        try {
            const { role, testPlan } = getTestPlan(testPlanId, userId);
            const options = {
                where: {
                    id: testPlanId
                },
                include: [
                    {
                        model: db.TestPlanComponent,
                        as: 'components',
                        attributes: ['id', 'name']
                    },
                    {
                        model: db.TestCase,
                        as: 'testCases',
                        attributes: ['id', 'name']
                    }
                ]
            }
            const testPlanWithComponents = await db.TestPlan.findAll(options);
            if (testPlanWithComponents && testPlanWithComponents.length === 1) {
                res.send({
                    testPlan: testPlanWithComponents[0].toJSON()
                });
            } else {
                res.status(404).send({
                    messsage: 'Test plan does not exist.'
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