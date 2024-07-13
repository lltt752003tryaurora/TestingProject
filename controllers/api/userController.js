const db = require('../../models/index');
const { responseData } = require("../../utils/response")

const controller = {
    getUserSelf: async (req, res) => {
        const userId = req.user.id;
        try {
            const user = await db.User.findByPk(userId, {
                attributes: ['id', 'avatar', 'username', 'fullName', 'isAdmin']
            });
            if (user) {
                return res.send(user);
            } else {
                return res.status(404).send({
                    message: 'User does not exist.'
                });
            }
        } catch (error) {
            console.error(error);
            responseData(res, "Failed to get user", "", 500);
        }
    },

    editUserSelf: async (req, res) => {
        const userId = req.user.id;
        try {
            const { fullName } = req.body;
            const user = await db.User.findByPk(userId);
            if (user) {
                await user.update({
                    fullName: fullName
                });
                responseData(res, "Succesfully updated user fullname", "", 200);
            } else {
                return res.status(404).send({
                    message: 'User does not exist.'
                });
            }
        } catch (error) {
            console.error(error);
            responseData(res, "Failed to update user fullname", "", 500);
        }
    },

    deleteUserSelf: async (req, res) => {
        const userId = req.user.id;
        try {
            const user = await db.User.findByPk(userId);
            if (user) {
                await user.destroy();
                responseData(res, "Succesfully deleted user", "", 200);
            } else {
                return res.status(404).send({
                    message: 'User does not exist.'
                });
            }
        } catch (error) {
            console.error(error);
            responseData(res, "Failed to delete user", "", 500);
        }
    },

    getUserById: async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await db.User.findByPk(userId, {
                attributes: ['id', 'avatar', 'username', 'fullName', 'isAdmin']
            });
            if (user) {
                return res.send(user);
            } else {
                return res.status(404).send({
                    message: 'User does not exist.'
                });
            }
        } catch (error) {
            console.error(error);
            responseData(res, "Failed to get user", "", 500);
        }
    },

    createUser: async (req, res) => {

    },

    editUser: async (req, res) => {
        const { userId } = req.params;
        try {
            const { username, fullName, isAdmin } = req.body;
            const user = await db.User.findByPk(userId);
            if (user) {
                await user.update({
                    username,
                    fullName,
                    isAdmin
                });
                responseData(res, "Succesfully updated user", "", 200);
            } else {
                return res.status(404).send({
                    message: 'User does not exist.'
                });
            }
        } catch (error) {
            console.error(error);
            responseData(res, "Failed to update user", "", 500);
        }
    },

    deleteUser: async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await db.User.findByPk(userId);
            if (user) {
                await user.destroy();
                responseData(res, "Succesfully deleted user", "", 200);
            } else {
                return res.status(404).send({
                    message: 'User does not exist.'
                });
            }
        } catch (error) {
            console.error(error);
            responseData(res, "Failed to delete user", "", 500);
        }
    },
}

module.exports = controller;