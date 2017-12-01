const db = require('../dbconnection');
const md5 = require('md5');

// hanlder for user registration
exports.register = function (req, res) {
    console.log("req", req.body);
    var user = {
        "username": req.body.username,
        "email": req.body.email,
        "password": req.body.password,
        "confirm_password": req.body.confirm_password,
        "use_exist_breezecard": req.body.use_exist_breezecard,
        "get_new_breezecard": req.body.get_new_breezecard,
        "breezecard_num": req.body.breezecard_num,
    }

    var bUseCard = (typeof user.use_exist_breezecard != 'undefined' &&
        user.use_exist_breezecard == 'on');

    var bGetNewCard = (typeof user.get_new_breezecard != 'undefined' &&
        user.get_new_breezecard == 'on');

    // remove white space from card number
    user.breezecard_num = user.breezecard_num.replace(/\s/g, "");

    // verify password and confirm_password
    if (user.password != user.confirm_password) {
        res.send({
            "code": 200,
            "statusCode": "FAIL",
            "message": "Password and Confirm Password do not match"
        }).end();
        return;
    }

    // verify that password has at least 8 characters
    if (user.password.length < 8) {
        res.send({
            "code": 200,
            "statusCode": "FAIL",
            "message": "Password must have at least 8 characters"
        }).end();
        return;
    }

    // when use_exist_breezecard option is selected 
    // verify that the card num is a 16 digit long integer
    if (bUseCard) {
        if (user.breezecard_num.length != 16 || // 16 digits ?
            isNaN(parseInt(user.breezecard_num))) { // is not a digit ?
            res.send({
                "code": 200,
                "statusCode": "FAIL",
                "message": "Card number must be 16 digit long"
            }).end();
            return;
        }
    }

    // verify that user name is unique
    // user tabel contains both passenger and admin
    // passenger table only contains the record for passenger
    // need to check user table to make sure that the passenger name entered 
    // is not the same as any admin
    var sSql = "SELECT * FROM user where username = '" + user.username + "';";
    db.query(sSql, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "database error ocurred"
            }).end();
            return;
        } else if (results.length > 0) {   // user already exists?
            console.log(user.username + " already exists");
            res.send({
                "code": 200,
                "statusCode": "FAIL",
                "message": "user already exists"
            }).end();
            return;
        }
    });

    // verify that email format is valid
    // must contain alphanumeric characters, bollowed by @, followed by alphanumeric characters, and then '.'
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var valid = regex.test(user.email);
    if (!valid) {
        console.log(user.email + " is not valid");
        res.send({
            "code": 200,
            "statusCode": "FAIL",
            "message": "email is not valid"
        }).end();
        return;
    }

    // verify that email is unique
    sSql = "SELECT * FROM passenger where email = '" + user.email + "';";
    db.query(sSql, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "database error ocurred"
            }).end();
            return;
        } else if (results.length > 0) {   // email already exists?
            console.log(user.email + " already exists");
            res.send({
                "code": 200,
                "statusCode": "FAIL",
                "message": "email already exists"
            }).end();
            return;
        }
    });

    // when use_exist_breezecard option is selected 
    // verify that the card is not assigned to another passenger
    // make sure to remove white space ' ' when serach the card number
    if (bUseCard) {
        sSql = "SELECT * FROM breezecard where replace(number, ' ', '')  = '" + user.breezecard_num + "'";
        sSql += " and owner != '" + user.username + "';";
        db.query(sSql, function (error, results, fields) {
            if (error) {
                console.log("error ocurred", error);
                res.send({
                    "code": 400,
                    "failed": "database error ocurred"
                }).end();
                return;
            } else if (results.length > 0) {   // card belongs to someone else?
                console.log(user.breezecard_num + " belongs to someone else");
                res.send({
                    "code": 200,
                    "statusCode": "FAIL",
                    "message": "card number belongs to another passenger"
                }).end();
                return;
            }
        });
    }

    // when get_new_breezecard option is selected 
    if (bGetNewCard) {
        var done = false;
        while (!done) {
            // generate a random 16 digit number and then check if it is unique
            user.breezecard_num = Math.floor(Math.random() * 1E16); // first digit could be zero     
            // Math.floor(1E16 + Math.random() * 9*1E15); - first digit will never be zero

            sSql = "SELECT * FROM breezecard where replace(number, ' ', '') = '" + user.breezecard_num + "';";
            db.query(sSql, function (error, results, fields) {
                if (error) {
                    console.log("error ocurred", error);
                    res.send({
                        "code": 400,
                        "failed": "database error ocurred"
                    }).end();
                    return;
                } else if (results.length == 0) {
                    // card number is unique
                    done = true;
                }
            });
        }
    }

    // ready to insert new record
    // insert new passenger into passenger and user tables
    console.log("ready to insert new record");

    // insert new breeze card into breezecard table
    // insert white space for card number - one white space every 4 digits


}
