const db = require('../../models/index');

const { extractUserRole } = require('../helpers/userRoleHelper')

const isUserProjectMember = async (req, res, next) => {
    const userId = req.user.id;
    const projectId = req.params.projectId || req.params.project_id;
    const projectMember = await extractUserRole(projectId, userId);
    if (projectMember !== null) {
        req.filter = projectMember;
        next();
    } else {
        return res.status(403).send({
            message: 'User is not a project member.'
        });
    }
}

const extractProjectIdFromRelease = async (req, res, next) => {
    const { releaseId } = req.params;
    const release = await db.Release.findByPk(releaseId);
    if (release) {
        req.project = {
            id: release.projectId
        };
        next();
    } else {
        return res.status(404).send({
            message: 'Release does not exist.'
        });
    }
}

const extractProjectFromTestPlan = async (req, res, next) => {
    const { testPlanId } = req.params;
    const testPlan = await db.TestPlan.findOne({
        where: { id: testPlanId },
        include: [{
            model: db.Release,
            as: 'release',
            attributes: ['projectId'],
        }]
    });
    if (testPlan) {
        req.project = {
            id: testPlan.projectId
        };
        next();
    } else {
        return res.status(404).send({
            message: 'Test pln does not exist.'
        });
    }
}

const extractProjectFromTestCase = async (req, res, next) => {
    const { testCaseId } = req.params;
    const testCase = await db.TestCase.findOne({
        where: { id: testCaseId },
        include: [{
            model: db.TestPlan,
            as: 'testPlan',
            attributes: [],
            include: [{
                model: db.Release,
                as: 'release',
                attributes: ['projectId']
            }]
        }]
    });
    if (testCase) {
        req.project = {
            id: testCase.projectId
        };
        next();
    } else {
        return res.status(404).send({
            message: 'Test case does not exist.'
        });
    }
}

const filterRoleOr = (roles) => {
    return async (req, res, next) => {
        const userId = req.user.id;
        const projectId = req.params.projectId || req.params.project_id || req.project?.id || req.body.projectId;
        if (!projectId) {
            return res.status(400).send({
                message: 'Missing project ID.'
            });
        }

        const projectMember = await extractUserRole(projectId, userId);

        if (projectMember !== null && roles.includes(projectMember.role)) {
            if (!req.project) {
                req.project = { id: projectId };
            }
            next();
        } else {
            return res.status(403).send({
                message: 'Invalid authority.'
            });

            return res.status(400).render('errors/bad_request', { message: 'Project does not exist, or user is not a project member.' });
        }
    }
}

const isUserManager = async (req, res, next) => {
    if (req.filter?.role === 'manager') {
        next();
    } else {
        return res.status(403).send({
            message: 'Access denied.'
        })
    }
}

const isUserManagerOrTester = async (req, res, next) => {
    if (req.filter && (req.filter.role === 'manager' || req.filter.role === 'tester')) {
        next();
    } else {
        return res.status(403).send({
            message: 'Access denied.'
        })
    }
}

module.exports = {
    extractUserRole,
    isUserProjectMember,
    isUserManager,
    isUserManagerOrTester,
    filterRoleOr,
    extractProjectIdFromRelease,
    extractProjectFromTestPlan,
    extractProjectFromTestCase,
};