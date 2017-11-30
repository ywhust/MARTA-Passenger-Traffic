// include required modules - mysql, express and fs ....
const express = require('express');
const session = require('express-session');
const app = express();
const router = express.Router();
const login = require('./routes/login');
const register = require('./routes/register');
const breezecard = require('./routes/breezecard');
const bodyParser = require('body-parser');
const port = 4000;
const db = require("./dbconnection");
const auth = require("./auth");

// try to connect to the database
db.connect(function (err) {
    if (!err) {
        console.log("Database is connected ...");
    } else {
        console.log("Error connecting database ...");
    }
});

app.set('json spaces', 10);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'cs4400-4d44-wjij',
    resave: false,
    saveUninitialized: true
}));

// allow cross domain access
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/', function (req, res) {
    res.send('<h1>API Home Page</h1>');
});

// route to handle user sign-in and registration
router.post('/login', login.login);
router.post('/logout', login.logout);
router.post('/register', register.register);
router.post('/getBreezeCard', auth.auth, breezecard.getBreezeCard);

// apply the routes to our application
app.use('/', router);

app.listen(port, () => console.log('server listening on port ' + port));
