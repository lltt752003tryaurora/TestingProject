const db = require('../models/index');

controller = {
    getTestPlanById: async (req, res) => {
        const { testPlanId } = req.params;
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
        try {
            const testPlan = await db.TestPlan.findAll(options);
            if (testPlan && testPlan.length === 1) {
                res.send({
                    testPlan: testPlan[0].toJSON()
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