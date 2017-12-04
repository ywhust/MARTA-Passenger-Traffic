const md5 = require('md5');
const db = require('../databases/dbconnection');

exports.login = function(req, res) {
    var sql = 'SELECT Username, Password, IsAdmin FROM User WHERE Username = ?;';
    // need to get the username and password via request
    var user = {
        "username": req.body.username,
        "password": req.body.password
    };

    // // init session
    // if (typeof global.session != 'undefined' &&
    //     typeof global.session.authenticated != 'undefined')
    //     global.session.authenticated = false;

    db.query(sql, user.username, function(err, rows, fields) {

        if (rows.length == 0) {
            res.send({
                "code": 200,
                "statusCode": "NO_USER",
                "success": "user does not exist"
            }).end();
            console.log("user does not exist");
            return;
        }

        var username = rows[0].Username;
        var password = rows[0].Password;
        var isAdmin = rows[0].IsAdmin;
        if (isAdmin == 0) {
            isAdmin = 'FALSE';
        } else if (isAdmin == 1) {
            isAdmin = 'TRUE';
        }

        if (user.username == username && md5(user.password) == password) {
            res.send({
                "code": 200,
                "statusCode": "OK",
                "isAdmin":  isAdmin,
                "success": "login sucessfull"
            });
            console.log("login sucessfull");
            // req.session.user  = name;
            // req.session.authenticated = true;
            // global.session = req.session; // store session info
        } else if (username == rows[0].Username && md5(password) != rows[0].Password) {
            res.send({
                "code": 200,
                "statusCode": "WRONG_PASSWORD",
                "success": "wrong password"
            });
            console.log("wrong password");
        }
        res.end();
    });
}