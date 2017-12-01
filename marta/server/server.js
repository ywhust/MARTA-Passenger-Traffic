// include required modules - mysql, express and fs ....
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');



const router = express.Router();
const login = require('./routes/login'); // load loginroute.js

const port = 4000;
const db   = require("./dbconnection");
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
router.post('/register', login.register);
router.post('/login',  login.login);
router.post('/logout', login.logout);

// route to get breeze cards
router.get('/get_breeze_card', auth.auth, function (req, res) {

    // verify if user has sign-in successfully
    //if (!auth.isAuthenticated(req, res))
      //return;
    
    // query database
    db.query('SELECT * FROM Breezecard;',
        function (err, rows, fields) {
            console.log(JSON.stringify(rows)); // results contains rows returned by server
            res.send(JSON.stringify(rows));
            res.end();
        });
});

// route to get a list of stations
router.get('/get_station/:id', function (req, res) {
    var id = req.params.id;
    console.log('station id: ' + id);

    // query database
    db.query('SELECT * FROM Station;',
        function (err, rows, fields) {
            //console.log(rows[0]); // results contains rows returned by server
            res.send(JSON.stringify(rows));
            res.end();
        });
});

// route to get a list of users baed on a given partial user name
router.get('/get_user/:id', function (req, res) {
    var id = req.params.id;
    console.log('user id:' + id);
    // query database
    db.query('SELECT * FROM User where username like?', '%' + id + '%',
        function (err, rows, fields) {
            console.log(rows); // results contains rows returned by server
            res.send(JSON.stringify(rows));
            res.end();
        });
});

// apply the routes to our application
app.use('/', router);

app.listen(port, () => console.log('server listening on port ' + port));
