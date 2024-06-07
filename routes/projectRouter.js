const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.get('/:projectId', async (req, res) => {
    const { projectId } = req.params;

    const project = await db.Project.findByPk(projectId);
    if (project) {
        res.send(project.toJSON());
    } else {
        console.log('Not found');
        res.status(404).send({
            message: 'Project not found.'
        })
    }
})

router.post('/create', (req, res) => {
    
})

module.exports = router;