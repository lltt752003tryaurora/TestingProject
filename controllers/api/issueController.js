const db = require('../../models/index');
const Sequelize = require('sequelize');
const { extractUserRole } = require('../filters/projectRoleFilters');
const queryHelper = require('../helpers/queryHelper')

const controller = {
    getIssues: [
        queryHelper.pagination,
        queryHelper.search,
        queryHelper.sort,
        async (req, res) => {
            const { projectId } = req.params;

            const options = {
                where: {},
                order: [['id', 'ASC']],
                include: [{
                    model: db.TestRun,
                    as: 'testRun',
                    attributes: [],
                    required: true,
                    include: [{
                        model: db.TestCase,
                        as: 'testCase',
                        attributes: [],
                        required: true,
                        include: [{
                            model: db.TestPlan,
                            as: 'testPlan',
                            attributes: [],
                            required: true,
                            include: [{
                                model: db.Release,
                                as: 'release',
                                attributes: [],
                                required: true,
                                include: [{
                                    model: db.Project,
                                    as: 'project',
                                    attributes: [],
                                    required: true,
                                    where: { id: projectId }
                                }]
                            }]
                        }]
                    }]
                }],
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
            if (req.search) {
                options.where.name = { [Op.iLike]: `%${req.search}%` }
            }

            try {
                const issues = await db.Issue.findAndCountAll(options);
                const issuesDetails = await Promise.all(issues.rows.map(async (is) => {
                    const assigned = await db.User.findByPk(is.assignedUserId, {
                        attributes: ['id', 'username', 'fullName', 'avatar']
                    });
                    const creator = await db.User.findByPk(is.creatorUserId, {
                        attributes: ['id', 'username', 'fullName', 'avatar']
                    });

                    let res = {
                        ...is.get({ plain: true }),
                        assigned,
                        creator
                    };

                    return res;
                }));
                issues.rows.forEach(async is => {
                })
                res.send({
                    numPage: req.size ? Math.ceil(issues.count / req.size) : 0,
                    numIssues: issues.count,
                    issues: issuesDetails
                });
            } catch (error) {
                console.error('Failed to get issues:', error);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    createIssue: [
        async (req, res, next) => {
            try {
                const userId = req.user.id;
                const projectId = req.project.id;

                let { name, description, priority, status, assignedUserId, testRunId } = req.body;

                if (!testRunId) {
                    return res.status(400).send({
                        message: 'Missing test run ID.'
                    });
                }

                const newIssue = await db.Issue.create({
                    name,
                    description,
                    priority,
                    status,
                    assignedUserId,
                    creatorUserId: userId,
                    testRunId
                });

                activityHelper.createActivity(projectId, userId, 'CreateIssue', JSON.stringify({
                    issueId: newIssue.id,
                }));

                res.status(200).send({
                    message: "Successfully created issue"
                });

            } catch (error) {
                console.error('Error while creating issue:', error);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    editIssues: [
        async (req, res) => {
            try {
                const { issueId } = req.params;
                const { name, description, priority, status, detail, assignedUserId } = req.body;

                const issue = await db.Issue.findByPk(issueId);
                if (!issue) {
                    return res.status(404).send({
                        message: "Issue not found"
                    });
                }

                if (name) issue.name = name.trim() ? name : issue.name;
                if (description) issue.description = description;
                if (priority) issue.priority = priority;
                if (status) issue.status = status;
                if (detail) issue.detail = detail;
                if (assignedUserId) issue.assignedUserId = assignedUserId;

                await issue.save();

                activityHelper.createActivity(issue.testRunId, req.user.id, 'EditIssue', JSON.stringify({
                    issueId: issue.id,
                    user: req.user.id
                }));

                return res.status(200).send({
                    message: 'Issue edited successfully.'
                });
            } catch (err) {
                console.error(err);
                return res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    deleteIssues: [
        async (req, res) => {
            try {
                const { issueId } = req.params;

                const issue = await db.Issue.findByPk(issueId);
                if (!issue) {
                    return res.status(404).send({
                        message: "Issue not found."
                    });
                }

                await issue.destroy();

                activityHelper.createActivity(issue.testRunId, req.user.id, 'DeleteIssue', JSON.stringify({
                    issueId: issue.id,
                    user: req.user.id
                }));

                res.status(200).send({
                    message: 'Issue successfully deleted.'
                });
            } catch (err) {
                console.error(err);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            }
        }
    ],

    changeStatus: [
        async (req, res) => {
            const { issueId, status } = req.body;
            try {
                const result = await db.Issue.update({ status }, {
                    where: { id: issueId }
                });
                res.status(200).send({ message: 'Status updated successfully', count: result[0] });
            } catch (error) {
                res.status(500).send({ message: 'Internal server error' });
            }
        }
    ],

    changePriority: [
        async (req, res) => {
            const { issueId, priority } = req.body;
            try {
                const result = await db.Issue.update({ priority }, {
                    where: { id: issueId }
                });
                res.status(200).send({ message: 'Priority updated successfully', count: result[0] });
            } catch (error) {
                res.status(500).send({ message: 'Internal server error' });
            }
        }
    ],

    changeSeverity: [
        async (req, res) => {
            const { issueIds, severity } = req.body;
            try {
                const result = await db.Issue.update({ detail: severity }, {
                    where: { id: issueIds }
                });
                res.status(200).send({ message: 'Severity updated successfully', count: result[0] });
            } catch (error) {
                res.status(500).send({ message: 'Internal server error' });
            }
        }
    ],

    assignUserToIssues: [
        async (req, res) => {
            const { issueIds, userId } = req.body; 

            try {
                if (!userId) {
                    return res.status(400).send({ message: "Invalid user ID provided." });
                }

                const result = await db.Issue.update({ assignedUserId: userId }, {
                    where: {
                        id: issueIds
                    }
                });

                res.status(200).send({
                    message: 'User assigned successfully to issues.',
                    updatedCount: result[0]  
                });
            } catch (error) {
                console.error('Error while assigning user to issues:', error);
                res.status(500).send({ message: 'Internal server error' });
            }
        }
    ]

};

module.exports = controller;