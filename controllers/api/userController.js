const { Op } = require('sequelize');
const db = require('../../models/index');

const controller = {
    getUserById: async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await db.User.findByPk(userId);
            if (user) {
                return res.send({
                    user: user.toJSON()
                });
            } else {
                return res.status(404).send({
                    message: 'User does not exist.'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    },

    getUsersByUsername: async (req, res) => {
        try {
            const keyword = req.query.username?.toLowerCase().trim();
            const users = await db.User.findAll({
                where: { username: { [Op.iLike]: `%${keyword}%` } }
            });
            res.send({
                data: users.map(item => item.toJSON())
            });
        } catch (err) {
            console.error(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        }
    }
}

module.exports = controller;