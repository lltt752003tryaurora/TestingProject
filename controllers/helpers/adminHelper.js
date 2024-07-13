const db = require('../../models/index');

const isAdmin = async (req, res, next) => {
    const userId = req.user.id;

	const user = await db.User.findByPk(userId);

	req.user.isAdmin = user?.isAdmin;
	next();
}

module.exports = {
	isAdmin
};