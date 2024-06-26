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

const activityExplainer = async (keyname, value) => {
	switch (keyname) {
		case 'project':
			let project = await db.Project.findByPk(value, {
				attributes: ['name'],
				paranoid: false,
			})
			return project?.name;
		case 'user':
		case 'target':
			let user = await db.User.findByPk(value, {
				attributes: ['username', 'fullName'],
				paranoid: false,
			})
			return user?.fullName
		case 'releaseId':
			let release = await db.Release.findByPk(value, {
				attributes: ['name'],
				paranoid: false,
			})
			return release?.name;
		case 'requirementId':
			let requirement = await db.Requirement.findByPk(value, {
				attributes: ['name'],
				paranoid: false,
			})
			return requirement?.name;
		case 'testPlanId':
			let testPlan = await db.TestPlan.findByPk(value, {
				attributes: ['name'],
				paranoid: false,
			})
			return testPlan?.name;
		default:
			return value;
	}
	return '';
} 

module.exports = {
	createActivity,
	activityExplainer
};