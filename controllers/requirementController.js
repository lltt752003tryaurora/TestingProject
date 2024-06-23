const db = require('../models/index');
const Sequelize = require('sequelize');
const activityHelper = require('./helpers/activityHelper');

const { extractUserRole } = require('./helpers/userRoleHelper')

const { isUserProjectMember, isUserManager, isUserManagerOrTester, filterRoleOr } = require('./filters/projectRoleFilters');

PAGE_LIMIT = 10

const controller = {
    getRequirements: [
        // isUserProjectMember,
        // isUserManager,
        filterRoleOr(['manager', 'developer']),
        async (req, res) => {
        const { projectId } = req.params;
        const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        const sortField = req.query.sort === 'updatedAt' ? 'updatedAt' : 'id';
        const sortOrder = req.query.order === 'asc' ? 'ASC' : 'DESC';
        const options = {
            where: { parentRequirementId: null },
            offset: PAGE_LIMIT * (page - 1),
            limit: PAGE_LIMIT,
            order: [[sortField, sortOrder]],
            include: [
                {
                    model: db.Requirement,
                    as: 'childRequirements',
                    attributes: ['id'],
                    required: false
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
            ]
        };
        const keyword = req.query.keyword || '';
        if (keyword.trim() !== '') {
            options.where.name = { [Op.iLike]: `%${keyword}%` }
        }
        try {
            const projectFirstLevelRequirements = await db.Requirement.findAll(options);
            const projectFirstLevelRequirementCount = await db.Requirement.count({
                where: options.where,
                include: options.include,
            });
            return res.send({
                page: page,
                totalPages: Math.ceil(projectFirstLevelRequirementCount / PAGE_LIMIT),
                requirements: projectFirstLevelRequirements.map(requirement => {
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
        filterRoleOr(['manager', 'developer']),
        async (req, res, next) => {
            try {
                const userId = req.user.id;
                const { projectId } = req.params;
                let { releaseId, name, description } = req.body;

                const newRequirement = await db.Requirement.create({
                    releaseId,
                    name,
                    description
                });

                activityHelper.createActivity(projectId, userId, 'CreateRequirement', JSON.stringify({
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
        filterRoleOr(['manager', 'developer']),
        async (req, res, next) => {
            try {
                const userId = req.user.id;
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
                return res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    deleteRequirement: [
        filterRoleOr(['manager', 'developer']),
        async (req, res, next) => {
            try {
                const {requirementId} = req.params;

                const requmnt = await db.Requirement.findByPk(requirementId);

                if (!requmnt) {
                    res.status(404).send({
                        message: "Requirement not found"
                    })
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