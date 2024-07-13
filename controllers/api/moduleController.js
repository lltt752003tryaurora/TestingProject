const db = require('../../models/index');

const activityHelper = require('../helpers/activityHelper');
const queryHelper = require('../helpers/queryHelper');

const { isUserProjectMember, isUserManager, isUserManagerOrTester, filterRoleOr } = require('../filters/projectRoleFilters');

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
    },
    
    getModules: [
        queryHelper.pagination,
        queryHelper.search,
        queryHelper.sort,
        async (req, res) => {
            const { projectId } = req.params;
            const options = {
                where: {
                    projectId: projectId,
                },
                include: [{
                    model: db.Module,
                    as: 'childModules',
                    attributes: ['id'],
                    required: false
                }],
                order: [['id', 'ASC']],
                distinct: true,
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
                const projectFirstLevelModules = await db.Module.findAndCountAll(options);
                return res.send({
                    numPage: req.size ? Math.ceil(projectFirstLevelModules.count / req.size) : 0,
                    numModules: projectFirstLevelModules.count,
                    modules: projectFirstLevelModules.rows.map(module => {
                        return {
                            ...module.toJSON(),
                        };
                    })
                });
            } catch (error) {
                console.log(error);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        },
    ],

    createModule: [
        async (req, res) => {
            try {
                const userId = req.user.id;
                const { projectId } = req.params;

                let { name, parentModule } = req.body;

                if (!name) {
                    res.status(400).send({
                        message: "Failed to create module, name can't be empty!"
                    })
                    return;
                }

                const newModule = await db.Module.create({
                    name: name,
                    projectId: projectId,
                    parentModuleId: parentModule ? parseInt(parentModule) : null
                });

                activityHelper.createActivity(projectId, userId, 'CreateModule', JSON.stringify({
                    moduleId: newModule.id,
                }));

                res.status(200).send({
                    message: "Successfully created module"
                })
         
            } catch (error) {
                console.log(error);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        },
    ],

    editModule: [
        async (req, res) => {
            try {
                const userId = req.user.id;
                const { projectId, moduleId } = req.params;
                let { name } = req.body;

                const module = await db.Module.findByPk(moduleId);

                if (!module) {
                    res.status(400).send({
                        message: "Module not found"
                    })
                }

                await module.update({
                    name: name
                })

                activityHelper.createActivity(projectId, userId, 'UpdateModule', JSON.stringify({
                    moduleId: module.id,
                    name: name
                }));

                res.status(200).send({
                    message: "Successfully updated module"
                })
         
            } catch (error) {
                console.log(error);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        },
    ],

    deleteModule: [
        async (req, res) => {
            try {
                const userId = req.user.id;
                const { projectId, moduleId } = req.params;

                const module = await db.Module.findByPk(moduleId);

                if (!module) {
                    res.status(400).send({
                        message: "Module not found"
                    })
                }

                await module.destroy()

                activityHelper.createActivity(projectId, userId, 'DeleteModule', JSON.stringify({
                    moduleId: module.id
                }));

                res.status(200).send({
                    message: "Successfully deleted module"
                })
         
            } catch (error) {
                console.log(error);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        },
    ],
};

module.exports = controller;