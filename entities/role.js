const ProjectRole = Object.freeze({
    NONE: 0,
	MEMBER: 1,
    DEVELOPER: 2,
    TESTER: 4,
    MANAGER: 8,
    // OWNER: 16,
    ADMIN: 512,
});

const mapRole = (roleString) => {
	const map = {
		'member': ProjectRole.MEMBER,
		'developer': ProjectRole.DEVELOPER,
		'tester': ProjectRole.TESTER,
		'manager': ProjectRole.MANAGER,
		'admin': ProjectRole.ADMIN,
	};

	if (roleString in map)
		return map[roleString];

	return ProjectRole.NONE;
}

const mapRoleToString = (role) => {
	const map = {};
	map[ProjectRole.MEMBER] = 'Member';
	map[ProjectRole.DEVELOPER] = 'Developer';
	map[ProjectRole.TESTER] = 'Tester';
	map[ProjectRole.MANAGER] = 'Manager';
	map[ProjectRole.ADMIN] = 'Admin';

	if (role in map)
		return map[role];

	return "None";
}

const getRoleSpecificity = (roleString) => {
	roleString = roleString.toLowerCase().trim();
	return mapRole(roleString);
}

module.exports = {
	ProjectRole,
	mapRole,
	mapRoleToString,
	getRoleSpecificity,
}