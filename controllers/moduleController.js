const db = require('../models/index');

const controller = {
    getModuleById: async (req, res) => {
        const { moduleId } = req.params;
        try {
            const module = await db.Module.findOne({
                where: {id: moduleId},
                include: [{
                    model: db.Module,
                    as: 'childModules',
                    attributes: ['id'],
                    required: false
                }]
            });
            if (module) {
                res.send(module);
            } else {
                res.status(404).send({
                    message: 'Module not found.'
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