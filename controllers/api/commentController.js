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
        async (req, res) => {
            try {
                const { commentId } = req.params;
                const comment = await db.IssueComment.findByPk(commentId);
                if (!comment) {
                    return res.status(404).send({ message: 'Comment not found.' });
                }
                await comment.destroy();
                res.status(200).send({ message: 'Comment deleted successfully.' });
            } catch (error) {
                console.error('Delete Comment Error:', error);
                res.status(500).send({ message: 'Internal server error while deleting comment.' });
            }
        }
    ]
};

module.exports = controller;