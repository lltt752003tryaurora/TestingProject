const db = require('../models/index');

const controller = {
    getModuleById: async (req, res) => {
        const { moduleId } = req.params;
        try {
            const module = await db.Module.findByPk(moduleId);
            if (module) {
                res.send(module.toJSON());
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