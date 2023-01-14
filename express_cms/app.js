const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');

const config = require("./config/config")

const admin = require("./routes/admin");
const index = require("./routes/index");
const api = require("./routes/api");

const app = express();
app.engine("html", ejs.__express);
app.set("view engine", "html");

app.use(express.static("static"));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'this is session',
    name: 'itying',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30,
        secure: false
    },
    rolling: true
}))

app.use("/" + config.adminPath, admin)
app.use("/api", api);
app.use("/", index)

app.locals.adminPath = config.adminPath;

app.listen(8081)
console.log('Open the front page http://localhost:8081 in your browser');
console.log('Open the background Control panel http://localhost:8081/admin_express/ in your browser');