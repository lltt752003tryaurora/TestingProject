const db = require('../models/index');
const Sequelize = require('sequelize');
const { extractUserRole } = require('./filters/projectRoleFilters');

const getIssue = async (issueId, userId) => {
    const issue = await db.Issue.findOne({
        where: { id: issueId },
        include: [{
            model: db.TestRun,
            as: 'testRun',
            attributes: ['id'],
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
                            attributes: ['id'],
                            required: true
                        }]
                    }]
                }]
            }]
        }],
        attributes: {
            include: [
                [Sequelize.col('testRun.testCase.testPlan.release.project.id'), 'projectId']
            ]
        },
        raw: true,
        nest: true
    });
    if (issue) {
        issue.projectId = issue.testRun.testCase.testPlan.release.project.id;
        delete issue.testRun;
        const projectMember = await extractUserRole(issue.projectId, userId);
        if (!projectMember) {
            return null;
        }
        if (projectMember.role === 'manager' || projectMember.role === 'tester') {
            return { role: projectMember.role, issue };
        } else if (projectMember.role === 'developer' && issue.assignedUserId === userId) {
            return { role: projectMember.role, issue };
        }
    } else {
        return null;
    }
}

const controller = {
    getIssueById: async (req, res) => {
        const userId = req.user.id;
        const { issueId } = req.params;
        try {
            const { role, issue } = await getIssue(issueId, userId);
            if (issue) {
                res.send({
                    issue: issue
                });
            } else {
                res.status(400).send({
                    message: 'Issue does not exist or user does not have permission.'
                })
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        } 
    },

    getIssueComments: async (req, res) => {
        const userId = req.user.id;
        const { issueId } = req.params;
        try {
            const { role, issue } = await getIssue(issueId, userId);
            if (issue) {
                const comments = await db.IssueComment.findAll({
                    where: {
                        issueId: issueId
                    },
                    order: [['createdAt', 'ASC']]
                });
                return res.send({
                    comments: comments.map(comment => comment.toJSON())
                });
            } else {
                res.status(400).send({
                    message: 'Issue does not exist or user does not have permission.'
                })
            }
            
        } catch (error) {
            res.status(500).send({
                message: 'Internal server error.'
            });
        } 
    },

    getIssueAttachments: async (req, res) => {
        const userId = req.user.id;
        const { issueId } = req.params;
        try {
            const { role, issue } = await getIssue(issueId, userId);
            if (issue) {
                const attachments = await db.IssueAttachment.findAll({
                    where: {
                        issueId: issueId
                    },
                });
                return res.send({
                    attachments: attachments.map(attachment => attachment.toJSON())
                });
            } else {
                res.status(400).send({
                    message: 'Issue does not exist or user does not have permission.'
                })
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Internal server error.'
            });
        } 
    }
};

module.exports = controller;