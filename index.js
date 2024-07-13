"use strict"; // avoid using variables which is not declared

// Init
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require("./middlewares/authMiddleware.js")
const errorPage = require('./utils/errorPage.js')

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
        },
        rawHelper: function(options) {
            return options.fn();
        }
    }
}))
app.set("view engine", "hbs");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// routes
// app.use("/", require('./routes/indexRouter.js'))
app.get('/createTables', (req, res) => {
    let models = require("./models");
    models.sequelize.sync().then(() => {
        res.send("Tables created !")
    })
})


app.use('/api', (req, res, next) => {
        req.environment = 'api';
        next();
    }, require('./routes/apiRouter.js'));

app.use('/project', (req, res, next) => {
        req.environment = 'app';
        next();
    }, require('./routes/app/homeRouter.js'));

app.use('/', require('./routes/app/entryRouter.js'))

//This must be last, for 404
app.use(function(req, res, next) {
    errorPage.show404(res);
});

// Init web server
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})