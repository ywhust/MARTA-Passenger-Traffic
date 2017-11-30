const db = require('../dbconnection');  

var user = {  // test user
    name: "Tony",
    password: "test"
}

// handler for user login
exports.login = function (req, res) {
    console.log("req", req.body);

    var name = req.body.username;
    var password = req.body.password; // md5 conversion?
    
    // init session
    if (typeof global.session != 'undefined' && 
        typeof global.session.authenticated != 'undefined')
        global.session.authenticated = false;

    // check the database to see if the user exists 
    // and password matches. find the user type - passenger or admin
    if (user.name == name && user.password == password) {
        res.send({
            "code": 200,
            "statusCode": "OK",
            "isAdmin":  false,
            "message": "login sucessfull"
        });
        console.log("login sucessfull");
        req.session.user  = name;
        req.session.authenticated = true;
        global.session = req.session; // store session info
    }
    else if (user.name == name && user.password != password) {
        res.send({
            "code": 200,
            "statusCode": "WRONG_PASSWORD",
            "message": "wrong password"
        });
        console.log("wrong password");
    }
    else {
        res.send({
            "code": 200,
            "statusCode": "NO_USER",
            "message": "user does not exist"
        });
        console.log("user does not exist");
    }
    res.end();

    /****
    db.query('SELECT * FROM user WHERE Username = ?', [user],
        function (error, results, fields) {
            if (error) {
                // console.log("error ocurred",error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                // console.log('The solution is: ', results);
                if (results.length > 0) {
                    if ([0].password == password) {
                        res.send({
                            "code": 200,
                            "success": "login sucessfull"
                        });
                    }
                    else {
                        res.send({
                            "code": 204,
                            "success": "Email and password does not match"
                        });
                    }
                }
                else {
                    res.send({
                        "code": 204,
                        "success": "Email does not exits"
                    });
                }
            }
        });
        ***/
}

exports.logout = function (req, res) {
    req.session.destroy();
    global.session = req.session;
}