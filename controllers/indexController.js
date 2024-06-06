"use strict"

const controller = {}

controller.createTables = (req, res) => {
    let models = require("./models");
    models.sequelize.sync().then(() => {
        res.send("Tables created !")
    })
}

module.exports = controller;