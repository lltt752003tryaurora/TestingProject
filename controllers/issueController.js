const db = require('../models/index');

const controller = {
    getIssueById: async (req, res) => {
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
                message: 'Internal server error'
            });
        } 
    },
};

module.exports = controller;