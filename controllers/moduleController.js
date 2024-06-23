const db = require('../models/index');

const activityHelper = require('./helpers/activityHelper');

const { isUserProjectMember, isUserManager, isUserManagerOrTester, filterRoleOr } = require('./filters/projectRoleFilters');

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
        isUserProjectMember,
        isUserManagerOrTester,
        async (req, res) => {
            const { projectId } = req.params;
            const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
            const sortField = req.query.sort === 'updatedAt' ? 'updatedAt' : 'id';
            const sortOrder = req.query.order === 'asc' ? 'ASC' : 'DESC';
            const options = {
                where: {
                    projectId: projectId,
                },
                offset: PAGE_LIMIT * (page - 1),
                limit: PAGE_LIMIT,
                order: [[sortField, sortOrder]],
                include: [{
                    model: db.Module,
                    as: 'childModules',
                    attributes: ['id'],
                    required: false
                }]
            };
            const keyword = req.query.keyword || '';
            if (keyword.trim() !== '') {
                options.where.name = { [Op.iLike]: `%${keyword}%` }
            }
            try {
                const projectFirstLevelModules = await db.Module.findAll(options);
                const projectModuleCount = await db.Module.count({
                    where: options.where
                });
                return res.send({
                    page: page,
                    totalPages: Math.ceil(projectModuleCount / PAGE_LIMIT),
                    modules: projectFirstLevelModules.map(module => {
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
        isUserProjectMember,
        isUserManagerOrTester,
        async (req, res) => {
            try {
                const userId = req.user.id;
                const { projectId } = req.params;

                let {name} = req.body;

                const newModule = await db.Module.create({
                    name: name,
                    projectId: projectId
                })

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
        isUserProjectMember,
        isUserManagerOrTester,
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
        isUserProjectMember,
        isUserManagerOrTester,
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