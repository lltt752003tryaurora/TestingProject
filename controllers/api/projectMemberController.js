const db = require('../../models/index');
const { Op, where } = require('sequelize');
const activityHelper = require('../helpers/activityHelper');
const queryHelper = require('../helpers/queryHelper')
const { extractUserRole } = require('../helpers/userRoleHelper')
const {responseData} = require("../../utils/response")
const controller = {
    getProjectMembers: [
        queryHelper.pagination,
        queryHelper.search,
        queryHelper.sort,
        async (req, res) => {
            const { projectId } = req.params;
            try {
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
                    attributes: ['role'],
                    order: [['id', 'ASC']]
                }
                if (req.search) {
                    options.include[0].where.username = {
                        [Op.iLike]: `%${req.search}%`
                    }
                }
                const projectMembers = await db.ProjectMember.findAll(options);
                res.send(projectMembers);
            } catch (error) {
                console.error(error);
                responseData(res, "Failed to get project members", "", 500);
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

    changeProjectMembers: [
        async (req, res) => {
            try {
                console.log(req.body);
                const userId = req.user.id;
                const { projectId } = req.params;
                const { role, username } = req.body;

                let targetUser = await db.User.findOne({
                    where: {
                        username: username
                    }
                });

                if (!targetUser) {
                    return responseData(res, "User doesn't exist", "", 400);
                }

                let checkExist = await db.ProjectMember.findOne({
                    where: {
                        userId: targetUser.id,
                        projectId: projectId
                    }
                })

                if (checkExist) {
                    await checkExist.update({
                        role: role
                    });
                    return responseData(res, "Succesfully changed user role", "", 200);
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

                responseData(res, "Succesfully changed user role", "", 200);
            }
            catch (error) {
                console.error(error);
                responseData(res, "Failed to change user role", "", 200);
            }
        }
    ],

    deleteProjectMember: async (req, res, next) => {
        try {
            console.log(req.body);
            const userId = req.user.id;
            const { projectId } = req.params;
            const { username } = req.body;

            const targetUser = await db.User.findOne({
                where: { username },
            });

            if (!targetUser) {
                res.status(404).send({
                    message: 'User not found.'
                });
                return;
            }

            await db.ProjectMember.destroy({
                where: { userId: targetUser.id },
            });

            activityHelper.createActivity(projectId, userId, 'DeleteProjectMember', JSON.stringify({
                project: projectId,
                user: userId,
                target: targetUser.id,
            }));

            res.status(200).send({
                message: 'Project member deleted successfully.'
            });
        } catch (err) {
            console.error(err);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    },

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