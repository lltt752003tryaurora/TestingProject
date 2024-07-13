const db = require('../../models/index');
const {Op} = require('sequelize');
const activityHelper = require('../helpers/activityHelper');
const queryHelper = require('../helpers/queryHelper');
const { query } = require('express');

const controller = {
    getRequirementById: [
        queryHelper.pagination,
        queryHelper.filter,
        queryHelper.search,
        queryHelper.sort,
        async (req, res) => {
            try {
                const { requirementId } = req.params;
                const options = {
                    where: { id: requirementId },
                    include: [{
                        model: db.TestCase,
                        as: 'testCases',
                        attributes: ['id', 'name', 'description', 'type', 'priority', 'detail', 'createdAt', 'updatedAt']
                    },
                    {
                        model: db.Requirement,
                        as: 'childRequirements',
                        attributes: ['id', 'name', 'description', 'releaseId'],
                        required: false,
                        order: [['id', 'ASC']],
                        where: {}
                    }]
                };
                
                // Apply pagination and sorting if provided
                if (req.size && req.page) {
                    options.include[1].limit = req.size;
                    options.include[1].offset = (req.page - 1) * req.size;
                }
                if (req.sortBy && req.sortOrder) {
                    const sortField = req.sortBy === 'updatedAt' ? 'updatedAt' : 'id';
                    const sortOrder = req.sortOrder === 'asc' ? 'ASC' : 'DESC';
                    options.include[1].order = [[sortField, sortOrder]];
                }
                
                // Apply filtering and searching if provided
                if (req.filter) {
                    options.include[1].where.releaseId = {
                        [Op.eq]: req.filter
                    }
                }
                if (req.search) {
                    options.include[1].where.name = { [Op.iLike]: `%${req.search}%` }
                }
                
                // Count the number of child requirements before applying the limit
                const countOptions = {
                    where: { id: requirementId },
                    include: [{
                        model: db.Requirement,
                        as: 'childRequirements',
                        attributes: [],
                        required: false,
                        where: options.include[1].where
                    }]
                };
                const requirementCount = await db.Requirement.findOne({
                    ...countOptions,
                    attributes: [
                        [db.Sequelize.fn('COUNT', db.Sequelize.col('childRequirements.id')), 'childRequirementCount']
                    ],
                    group: ['Requirement.id']
                });
                
                const childRequirementCount = requirementCount ? requirementCount.get('childRequirementCount') : 0;
                
                // Fetch the requirement with limited child requirements
                const requirement = await db.Requirement.findOne(options);
                if (!requirement) {
                    return res.status(404).send({
                        message: 'Requirement does not exist.'
                    });
                }
                
                // Return the result with the count of child requirements
                return res.send({
                    data: requirement.toJSON(),
                    numRequirements: parseInt(childRequirementCount),
                    numPage: req.size ? Math.ceil(childRequirementCount / req.size) : 0
                });
            } catch (error) {
                console.error(error);
                return res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    getRequirements: [
        queryHelper.pagination,
        queryHelper.filter,
        queryHelper.search,
        queryHelper.sort,
        async (req, res) => {
            const { projectId } = req.params;
            const options = {
                where: { parentRequirementId: null },
                include: [
                    {
                        model: db.Requirement,
                        as: 'childRequirements',
                        attributes: ['id'],
                    },
                    {
                        model: db.Release,
                        as: 'release',
                        attributes: [],
                        required: true,
                        include: [{
                            model: db.Project,
                            as: 'project',
                            attributes: [],
                            where: { id: projectId }
                        }]
                    }
                ],
                order: [['id', 'ASC']],
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
            if (req.filter) {
                options.where.releaseId = {
                    [Op.eq]: req.filter
                }
            }
            if (req.search) {
                options.where.name = { [Op.iLike]: `%${req.search}%` }
            }
            try {
                const projectFirstLevelRequirements = await db.Requirement.findAndCountAll(options);
                console.log(projectFirstLevelRequirements.rows.length)
                return res.send({
                    numPage: req.size ? Math.ceil(projectFirstLevelRequirements.count / req.size) : 0,
                    numRequirements: projectFirstLevelRequirements.count,
                    requirements: projectFirstLevelRequirements.rows.map(requirement => {
                        return {
                            ...requirement.toJSON(),
                        };
                    })
                });
            } catch (error) {
                console.log(error);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    createRequirement: [
        async (req, res, next) => {
            try {
                const userId = req.user.id;
                const { projectId } = req.params;
                let { releaseId, name, description, parentRequirementId } = req.body;

                const release = await db.Release.findByPk(releaseId);
                if (!release) {
                    res.status(404).send({
                        message: 'Release does not exist.'
                    });
                    return;
                }

                if (release.projectId != projectId) {
                    res.status(404).send({
                        message: 'Release does not belong to this project.'
                    });
                    return;
                }

                const newRequirement = await db.Requirement.create({
                    releaseId,
                    name,
                    description,
                    parentRequirementId,
                });

                activityHelper.createActivity(projectId, userId, 'CreateRequirement', JSON.stringify({
                    user: userId,
                    releaseId: releaseId,
                    requirementId: newRequirement.id 
                }))

                res.status(200).send({
                    message: "Succesfully created new requirement"
                })
                
            } catch (err) {
                res.status(500).send({
                    message: "Failed to create new requirement"
                })
            }
        }
    ],

    editRequirement: [
        async (req, res, next) => {
            try {
                const userId = req.user.id;
                const projectId = req.project?.id;
                const {requirementId} = req.params;
                let {name, description} = req.body;

                const requmnt = await db.Requirement.findByPk(requirementId);

                if (!requmnt) {
                    return res.status(404).send({
                        message: "Requirement not found"
                    })
                }

                await requmnt.update({
                    name: name,
                    description: description
                })

                activityHelper.createActivity(projectId, userId, 'EditRequirement', JSON.stringify({
                    requirementId: requmnt.id 
                }))
                
                res.status(200).send({
                    message: "Update succeeded"
                })

            } catch (err) {
                console.error(err);
                return res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    deleteRequirement: [
        async (req, res, next) => {
            try {
                const {projectId, requirementId} = req.params;

                const requmnt = await db.Requirement.findByPk(requirementId, {
                    include: [{
                        model: db.Release,
                        as: 'release',
                        where: {
                            projectId: projectId
                        }
                    }]
                });

                if (!requmnt) {
                    res.status(404).send({
                        message: "Requirement not found"
                    })
                    return;
                }

                await requmnt.destroy();
                
                res.status(200).send({
                    message: "Delete succeeded"
                })
                
            } catch (err) {
                return res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ]
};

module.exports = controller;