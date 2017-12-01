const db   = require('../dbconnection');
const md5  = require ('md5');
const rmd5 = require('reverse-md5');

var user = {  // test user
    name: "Tony",
    password: "test"
}

// handler for user login
exports.login = function (req, res) {
    console.log("req", req.body);

    var name = req.body.username;
    var passwd = req.body.password; 
    var password = md5(passwd); // md5 hash password

    // init session
    if (typeof global.session != 'undefined' &&
        typeof global.session.authenticated != 'undefined')
        global.session.authenticated = false;

    var sSql = "SELECT * FROM User";

    sSql += " WHERE Username = '" + name + "'";
    sSql += " and Password = '" + password + "'";
    sSql += ";";

    console.log(sSql);
    db.query(sSql, function (error, results, fields) {
        if (error) {
            console.log("error ocurred",error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            if (results.length > 0) {   // login successfully?
                console.log("login sucessfully");
                res.send({
                    "code": 200,
                    "statusCode": "OK",
                    "isAdmin": results[0].IsAdmin,
                    "message": "login sucessfully"
                }).end();
            }
            else{
                res.send({
                    "code": 200,
                    "statusCode": "FAIL",
                    "message": "Invalid user or password"
                }).end();
            }
        }
    });
}

exports.logout = function (req, res) {
    req.session.destroy();
    global.session = req.session;
}