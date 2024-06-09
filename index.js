"use strict"; // avoid using variables which is not declared

// Init
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const expressHandlebars = require('express-handlebars');

// config public static folder => express will return Free Template
app.use(express.static(__dirname + '/public'))
app.use(express.json())

app.engine("hbs", expressHandlebars.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "layout",
    helpers: {
        equal: function(a, b, options) {
            if (a == b) {
              return options.fn(this);
            }
        }
    }
}))
app.set("view engine", "hbs");

// routes
// app.use("/", require('./routes/indexRouter.js'))
app.get('/createTables', (req, res) => {
    let models = require("./models");
    models.sequelize.sync().then(() => {
        res.send("Tables created !")
    })
})

app.use('/api', require('./routes/apiRouter.js'));

app.use('/', require('./routes/app/entryRouter.js'))
app.use('/project', require('./routes/app/homeRouter.js'))
// Init web server
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})