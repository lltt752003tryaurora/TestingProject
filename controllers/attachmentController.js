const path = require('path');
const fs = require('fs');
const db = require('../models/index');

const controller = {
    getAttachmentByName: async (req, res) => {
        const fileName = req.query.name;
        const invalidFileName = fileName.includes('/') || (fileName.match(/\./g) || []).length > 1;
        if (invalidFileName) {
            return res.status(400).send('Invalid filename');
        }

        const filePath = path.join(__dirname, '..', 'uploads', fileName);

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).send('File not found.');
            }
    
            res.sendFile(filePath, (err) => {
                if (err) {
                    res.status(500).send('Internal server error.');
                }
            });
        });
    },

    getAttachmentById: async (req, res) => {
        const { attachmentId } = req.params;
        try {
            const attachment = await db.Attachment.findByPk(attachmentId);
            if (attachment) {
                const fileName = attachment.toJSON().fileName;

                const filePath = path.join(__dirname, '..', 'uploads', fileName);

                fs.access(filePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        return res.status(404).send('File not found.');
                    }
                    res.sendFile(filePath, (err) => {
                        if (err) {
                            res.status(500).send('Internal server error.');
                        }
                    });
                });
            } else {
                return res.status(404).send({
                    message: 'Attachment not found.'
                });
            }
        } catch (error) {
            res.status(500).send({
                message: 'Internal server error.'
            })
        }
    }
};

module.exports = controller;