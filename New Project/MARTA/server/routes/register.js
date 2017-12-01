const db = require('../dbconnection');

// hanlder for user registration
exports.register = function (req, res) {
    console.log("req", req.body);
    var user = {
        "username": req.body.username,
        "password": req.body.password, // md5 conversion ?
        "confirm_password": req.body.confirm_password,
        "use_exist_breezecard": req.body.use_exist_breezecard,
        "get_new_breezecard": req.body.get_new_breezecard,
        "breezecard_num": req.body.breezecard_num,
    }

    // verify username (unique)
    var a = false;
    if (!a){
        res.send({
            "code": 200, 
            "statusCode": "USER_NAME_NOT_UNIQUE",
            "message": "User [" + user.username + "] exists. Please choose a differnet name"
        }).end();
    }
   
    // verify email
    var b = true;
    if (!b){
        res.send({
            "code": 200, 
            "statusCode": "EMAIL_NOT_UNIQUE",
            "message": "Email [" + user.email + "] exists. Please choose a differnet email"
        }).end();   
    }
   

    // verify if password and confirm_password are the same
    var c = true;
    if (!c){
        res.send({
            "code": 200, 
            "statusCode": "PASSWORD_DOES_NOT_MATCH",
            "message": "Password does not match"
        }).end();
    }
   
    // verfy password from database

    // use existing breeze card ?

    // get a new breeze card ?


    // return "OK" if all checks passed
    var ok = true;
    if (ok){
        res.send({
            "code": 200, 
            "statusCode": "OK",
            "message": "Success" 
        }).end(); 
    }
 
    /*
    db.query('INSERT INTO user SET ?', user, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            console.log('The solution is: ', results);
            res.send({
                "code": 200, 
                "success": "user registered sucessfully"
            });
        }
    });
*/
}
