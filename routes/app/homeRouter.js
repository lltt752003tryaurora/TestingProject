const express = require('express');
const router = express.Router({mergeParams: true});
const authMiddleware = require('../../middlewares/authMiddleware.js');
const userMiddleware = require('../../middlewares/userMiddleware.js');
const errorPage = require('../../utils/errorPage.js');

router.get('/',
			authMiddleware.isUserAuthenticated((authenticated, req, res, next) => {
				if (!authenticated) {
					res.redirect('/login');
					res.end();
				}
				else
					next();
			}),
			(req, res, next) => {
				res.render('project', {title: 'My Project'});
			}
);

router.use('/:projectId',
			authMiddleware.isUserAuthenticated((authenticated, req, res, next) => {
				if (!authenticated) {
					res.redirect('/login');
					res.end();
				}
				else
					next();
				
			}),
			userMiddleware.getUserOfProject,
			authMiddleware.isUserAuthorized((authorized, req, res, next) => {
				if (!authorized)
					errorPage.show403(res);
				else
					next();
			}),
			require('./projectRouter.js'));

module.exports = router;