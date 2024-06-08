const db = require('../models/index');

const controller = {
    getTestPlanComponentById: async (req, res) => {
        const { testPlanComponentId } = req.params;
        try {
            const tpc = await db.TestPlanComponent.findByPk(testPlanComponentId);
            if (tpc) {
                return res.send({
                    testPlanComponent: tpc.toJSON()
                });
            } else {
                return res.status(404).send({
                    message: 'Test plan component not found.'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    }
};

module.exports = controller;