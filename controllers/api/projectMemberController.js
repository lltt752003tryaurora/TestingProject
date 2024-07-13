const db = require('../../models/index');
const Sequelize = require('sequelize');
const activityHelper = require('../helpers/activityHelper');

const { extractUserRole } = require('../helpers/userRoleHelper')

const { isUserProjectMember, isUserManager, isUserManagerOrTester, filterRoleOr } = require('../filters/projectRoleFilters');

const controller = {
    getProjectMembers: [
        // isUserProjectMember,
        // isUserManagerOrTester,
        async (req, res) => {
            const { projectId } = req.params;
            try {
                let { page, size, search } = req.query;
                const options = {
                    include: [{
                        model: db.User,
                        as: 'user',
                        attributes: ['id', 'username', 'fullName', 'avatar'],
                        where: {}
                    }],
                    where: {
                        projectId: projectId
                    },
                    attributes: ['role']
                }
                if (search) {
                    options.include[0].where.username = {
                        [Op.iLike]: `%${search}%`
                    }
                }
                const projectMembers = await db.ProjectMember.findAll(options);
                res.send(projectMembers);
            } catch (error) {
                console.error(error);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    getProjectNonMembers: [
        async (req, res) => {
            try {
                const userId = req.user.id;
                const { projectId } = req.params;
                let { page, size, search } = req.query;
                const userRole = await extractUserRole(projectId, userId);
                if (userRole?.role != 'manager') {
                    return res.status(403).send({
                        message: 'Access denied.'
                    })
                }

                const projectMembers = await db.ProjectMember.findAll({
                    where: { projectId: projectId },
                    attributes: ['userId']
                });
                  
                const memberUserIds = projectMembers.map(member => member.userId);
                
                const options = {
                    where: {
                        id: {
                          [Op.notIn]: memberUserIds
                        }
                    },
                    attributes: ['id', 'username', 'fullName', 'avatar']
                };
                if (search) {
                    options.where.username = {
                        [Op.iLike]: `%${search}%`
                    }
                }
                let users = await db.User.findAll(options)

                res.status(200).send(users);
            }
            catch (error) {
                console.error(error);
                res.status(500).send({
                    message: "Error getting nonmembers"
                });
            }
        }
    ],

    addProjectMembers: [
        async (req, res) => {
            try {
                const userId = req.user.id;
                const { projectId } = req.params;
                const { role, user } = req.body;
                const userRole = await extractUserRole(projectId, userId);
                if (userRole?.role != 'manager') {
                    return res.status(403).send({
                        message: 'Access denied.'
                    })
                }
                if (!role in ['manager', 'tester', 'developer']) {
                    return res.status(400).send({
                        message: 'invalid role'
                    })
                }

                let targetUser = await db.User.findOne({
                    where: {
                        username: user
                    }
                });

                if (!targetUser) {
                    return res.status(400).send({
                        message: `User doesn't exist`
                    })
                }

                let checkExist = await db.ProjectMember.findOne({
                    where: {
                        userId: targetUser.id,
                        role: role,
                        projectId: projectId
                    }
                })

                if (checkExist) {
                    return res.status(400).send({
                        message: 'Role already exists'
                    })
                }

                await db.ProjectMember.create({
                    role: role,
                    projectId: projectId,
                    userId: targetUser.id
                })

                activityHelper.createActivity(projectId, userId, 'EditProjectMember', JSON.stringify({
                    project: projectId,
                    user: userId,
                    target: targetUser.id,
                    role: role
                }));

                res.status(200).send({
                    message: "Succesfully added user role"
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).send({
                    message: "Error adding user role"
                });
            }
        }
    ],

    setProjectMember: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { projectId } = req.params;
            const { user, role } = req.body;

            const targetUser = await db.User.findByPk(user);
            if (!targetUser) {
                res.status(404).send({
                    message: 'User does not exist.'
                });
            }

            const projectMember = await db.ProjectMember.findOne({
                where: { projectId, userId: user }
            });
            if (!projectMember) {
                const newProjectMember = await db.ProjectMember.create({
                    projectId,
                    userId: user,
                    role: role
                });
                activityHelper.createActivity(projectId, userId, 'AddProjectMember', JSON.stringify({
                    project: projectId,
                    user: userId,
                    target: user.id,
                    role: role
                }));
            } else {
                projectMember.role = role;
                await projectMember.save();
                activityHelper.createActivity(projectId, userId, 'EditProjectMember', JSON.stringify({
                    project: projectId,
                    user: userId,
                    target: user.id,
                    role: role
                }));
            }
            
            res.status(200).send({
                message: 'User role assigned successfully.'
            });
        } catch (err) {
            console.error(err);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    }
};

module.exports = controller;