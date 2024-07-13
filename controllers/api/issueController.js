const db = require('../../models/index');
const Sequelize = require('sequelize');
const { extractUserRole } = require('../filters/projectRoleFilters');

const controller = {
    getIssues: [
        async (req, res) => {
            const { projectId } = req.params;
            const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
            const sortField = req.query.sort === 'updatedAt' ? 'updatedAt' : 'id';
            const sortOrder = req.query.order === 'asc' ? 'ASC' : 'DESC';

            const options = {
                where: {},
                offset: PAGE_LIMIT * (page - 1),
                limit: PAGE_LIMIT,
                order: [[sortField, sortOrder]],
                include: [{
                    model: db.TestRun,
                    as: 'testRun', // Tên bí danh này phải phù hợp với khai báo trong mô hình của bạn
                    include: [{
                        model: db.Module, // Hoặc một bảng khác nếu Module không phù hợp
                        as: 'module',
                        where: { project_id: projectId },
                        required: true
                    }]
                }]
            };

            const keyword = req.query.keyword || '';
            if (keyword.trim() !== '') {
                options.where.name = { [Op.iLike]: `%${keyword}%` };
            }

            try {
                const issues = await db.Issue.findAll(options);
                const issueCount = await db.Issue.count({
                    where: options.where,
                    include: options.include
                });

                res.send({
                    page: page,
                    totalPages: Math.ceil(issueCount / PAGE_LIMIT),
                    issues: issues.map(issue => issue.toJSON())
                });
            } catch (error) {
                console.error('Lỗi khi lấy thông tin Issues:', error);
                res.status(500).send({
                    message: 'Lỗi server nội bộ.'
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
        async (req, res, next) => {
            try {

            } catch (err) {

            }
        }
    ],

    deleteIssues: [
        async (req, res, next) => {
            try {

            } catch (err) {

            }
        }
    ],


};

module.exports = controller;