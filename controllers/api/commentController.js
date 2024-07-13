const db = require('../../models/index');
const Sequelize = require('sequelize');
const { extractUserRole } = require('../filters/projectRoleFilters');

const controller = {
    addComment: [
        async (req, res) => {
            try {
                const { issueId } = req.params;
                const { userId, comment } = req.body; // Giả sử userId được lấy từ đâu đó, ví dụ: req.user.id nếu đã xác thực
                const newComment = await db.IssueComment.create({
                    issue_id: issueId,
                    user_id: userId,
                    comment: comment
                });
                res.status(201).send({
                    message: 'Comment added successfully',
                    data: newComment
                });
            } catch (error) {
                console.error('Add Comment Error:', error);
                res.status(500).send({ message: 'Internal server error while adding comment.' });
            }
        }
    ],
    deleteComment: [
    ]
};

module.exports = controller;