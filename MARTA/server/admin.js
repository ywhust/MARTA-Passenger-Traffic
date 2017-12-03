exports.admin = function (req, res, next) {
    // temparatly disbale the passcode
    //return next();

    // verify if admin has sign-in successfully
    var sess = global.session;
    if (typeof sess == 'undefined' || typeof sess.authenticated == 'undefined'
        || !sess.authenticated ||
        typeof sess.admin != 'undefined' || sess.admin != 'YES') { // additinal check for admin
        res.send({
            "code": 200,
            "statusCode": "FAIL",
            "message": "<h2>You're not authorized to use the API (please sign in as admin)</h2>"
        });
        res.end();
    }
    else
        // user has been authenticated
        return next(); // proceed to the next step
}

