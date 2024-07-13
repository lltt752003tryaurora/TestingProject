const db = require('../../models/index');
const Sequelize = require('sequelize');
const {extractUserRole} = require('../helpers/userRoleHelper');
const activityHelper = require('../helpers/activityHelper');
const queryHelper = require('../helpers/queryHelper')
const { extractProjectFromTestPlan, isUserProjectMember, isUserManager, isUserManagerOrTester, filterRoleOr } = require('../filters/projectRoleFilters');


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
    },

    getTestPlans: [
        queryHelper.pagination,
        queryHelper.search,
        queryHelper.sort,
        async (req, res) => {
            const { projectId } = req.params;
            const options = {
                order: [['id', 'ASC']],
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
                ],
                distinct: true
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
                const projectTestPlans = await db.TestPlan.findAndCountAll(options);
                return res.send({
                    numPage: req.size ? Math.ceil(projectTestPlans.count / req.size) : 0,
                    numPlans: projectTestPlans.count,
                    testPlans: projectTestPlans.rows.map(testPlan => testPlan.toJSON())
                });
            } catch (error) {
                console.log(error);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        },
    ],

    createTestPlan: [
        async (req, res, next) => {
            try {
                const userId = req.user.id;
                const {projectId} = req.params;
                const { releaseId } =  req.body;
                if (!releaseId) {
                    return res.status(400).send('Missing release ID.');
                }
                const name = req.body.name;
                if (!name || name.trim() === '') {
                    return res.status(400).send({
                        message: 'Test plan name must not be empty.'
                    });
                }
                const description = req.body.description || '';
                const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
                const endDate = req.body.endDate ? new Date(req.body.endDate) : null;
                if (!endDate || endDate < startDate) {
                    return res.status(400).send({ message: 'Invalid timestamp.' });
                }

                const newTestPlan = await db.TestPlan.create({
                    name,
                    description,
                    releaseId,
                    startDate,
                    endDate
                });
                const testPlanId = newTestPlan.id;

                activityHelper.createActivity(projectId, userId, 'CreateTestPlan', JSON.stringify({
                    testPlanId: testPlanId,
                    releaseId: releaseId,
                    user: userId,
                }));

                return res.status(201).send({
                    message: 'Release created successfully.',
                    testPlanId: testPlanId,
                });
            } catch (err) {
                console.error(err);
                if (err.name === 'SequelizeValidationError') {
                    return res.status(400).send({ message: 'Validation error.', details: err.errors });
                } else {
                    return res.status(500).send({ message: 'An error occurred while creating the test plan.' });
                }
            }
        }
    ],

    editTestPlan: [
        async (req, res, next) => {
            try {
                const userId = req.user.id;
                const { projectId, testPlanId } = req.params;
                const { name, description, startDate, endDate, releaseId } = req.body;
                if (!releaseId) {
                    return res.status(400).send('Missing release ID.');
                }
                if (name && name.trim() === '') {
                    return res.status(400).send('Release name must not be empty.');
                }

                const testPlan = await db.TestPlan.findByPk(testPlanId);
                if (!testPlan) {
                    return res.status(400).send('Test plan does not exist.');
                }
                if (name) testPlan.name = name;
                if (description) testPlan.description = description;
                if (startDate && endDate) {
                    const newStartDate = new Date(startDate);
                    const newEndDate = new Date(endDate);
                    if (newStartDate > newEndDate) {
                        return res.status(400).send('Invalid timestamps.');
                    }
                    testPlan.startDate = newStartDate;
                    testPlan.endDate = newEndDate;
                } else if (startDate) {
                    const newStartDate = new Date(startDate);
                    if (newStartDate > testPlan.endDate) {
                        return res.status(400).send('Invalid timestamps.');
                    }
                    testPlan.startDate = newStartDate;
                } else if (endDate) {
                    const newEndDate = new Date(endDate);
                    if (testPlan.startDate > newEndDate) {
                        return res.status(400).send('Invalid timestamps.');
                    }
                    testPlan.endDate = newEndDate;
                }

                await testPlan.save();

                activityHelper.createActivity(projectId, userId, 'EditTestPlan', JSON.stringify({
                    testPlanId: testPlanId,
                    releaseId: releaseId,
                    user: userId,
                }));

                return res.status(200).send({
                    message: 'Test plan edited successfully.'
                });
            } catch (err) {
                return res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    deleteTestPlan: [
        async (req, res, next) => {
            try {
                const userId = req.user.id;
                const {projectId} = req.params;
                const { testPlanId } = req.params;

                console.log(req.user);

                const testPlan = await db.TestPlan.findByPk(testPlanId);
                if (!testPlan) {
                    return res.status(400).send('Test plan does not exist.');
                }

                await testPlan.destroy();

                activityHelper.createActivity(projectId, userId, 'DeleteTestPlan', JSON.stringify({
                    testPlanId: testPlanId,
                    user: userId,
                }));

                return res.status(200).send({
                    message: 'Test plan deleted successfully.'
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