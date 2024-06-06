"use strict"

const express = require("express")
const router = express.Router();
const controller = require("../controllers/indexController")

// create table in database
router.get("/createTables", controller.createTables);


