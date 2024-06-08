const db = require('../models/index');

const controller = {
    getReleaseById: async (req, res) =>  {
        const { releaseId } = req.params;
        const options = {
            where: {
                id: releaseId
            },
            include: [{
                model: db.TestPlan,
                as: 'testPlans',
                attributes: ['id']
            }]
        }
        try {
            const release = await db.Release.findAll(options);
            if (release && release.length === 1) {
                res.send({
                    release: release[0].toJSON()
                });
            } else {
                res.status(404).send({
                    messsage: 'Release does not exist.'
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