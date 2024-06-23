const db = require('../../models/index');

const createActivity = (projectId, userId, type, detail) => {
	db.Activity.create({
		userId: userId,
		projectId: projectId,
		type,
		detail,
	}).then(res => {
		
	}).catch(err => {
		console.log("Error in creating activity: ", err);
	})
}

module.exports = {
	createActivity,
};