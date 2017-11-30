
exports.auth = function (req, res, next) {
    // temparatly disbale the passcode
    return next();

    // verify if user has sign-in successfully
    var sess = global.session;
    if (typeof sess == 'undefined' || typeof sess.authenticated == 'undefined'
        || !sess.authenticated) {
        res.send({
            "code": 200,
            "statusCode": "NOT_AUTHORIZED",
            "success": "<h2>You're not authorized to use the API</h2>"
        });
        res.end();
    }
    else
        // user has been authenticated
        return next(); // proceed to the next step
}