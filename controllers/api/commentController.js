const db = require('../../models/index');
const Sequelize = require('sequelize');
const { extractUserRole } = require('../filters/projectRoleFilters');

const controller = {
    getComments: [
        async (req, res) => {
            const userId = req.user.id;
            const { projectId, issueId } = req.params;
            try {
                const comments = await db.IssueComment.findAll({
                    where: {
                        issueId: issueId
                    },
                    sort: [['id', 'ASC']],
                    include: [{
                        model: db.Issue,
                        as: "issue",
                        attributes: [],
                        required: true,
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
                    }],
                    order: [['createdAt', 'ASC']]
                });
                return res.send({
                    comments: comments.map(comment => comment.toJSON())
                });
                
            } catch (error) {
                console.log(error);
                res.status(500).send({
                    message: 'Internal server error.'
                });
            } 
        }
    ],
    addComment: [
        async (req, res) => {
            try {
                const userId = req.user.id;
                const { issueId } = req.params;
                const { comment } = req.body;
                const newComment = await db.IssueComment.create({
                    issueId: issueId,
                    userId: userId,
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
                const userId = req.user.id;
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