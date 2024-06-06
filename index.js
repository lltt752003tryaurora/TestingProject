"use strict"; // avoid using variables which is not declared

// Init
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const expressHandlebars = require('express-handlebars');

// config public static folder => express will return Free Template
app.use(express.static(__dirname + '/'))

app.engine("hbs", expressHandlebars.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "layout"
}))
app.set("view engine", "hbs");


// routes
app.use("/", require('./routes/indexRouter'))

// Init web server
router.listen(port, () => {
    console.log(`listening on port ${port}`);
})