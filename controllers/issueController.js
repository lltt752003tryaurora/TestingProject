const db = require('../models/index');



const controller = {
    getIssueById: [async (req, res) => {
        const { issueId } = req.params;
        try {
            const issue = await db.Issue.findByPk(issueId);
            if (issue) {
                res.send({
                    issue: issue.toJSON()
                })
            } else {
                res.status(404).send({
                    message: 'Issue not found.'
                });
            }
        } catch (error) {
            res.status(500).send({
                message: 'Internal server error.'
            });
        } 
    },],

    getIssueComments: async (req, res) => {
        const { issueId } = req.params;
        try {
            const comments = await db.IssueComment.findAll({
                where: {
                    issueId: issueId
                },
                order: [['createdAt', 'ASC']]
            });
            return res.send({
                comments: comments.map(comment => comment.toJSON())
            });
        } catch (error) {
            res.status(500).send({
                message: 'Internal server error.'
            });
        } 
    }
};

module.exports = controller;