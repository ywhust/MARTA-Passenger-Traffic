const md5 = require('md5');
const db = require('../databases/dbconnection');

// generate randon string
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

// generate a breezecard number
function getNewCard(username) {
    card_num = randomString(16, '0123456789');
    db.query('SELECT * FROM Breezecard WHERE BreezecardNum = ?',
        card_num, function(err, rows, fields) {
            if (rows.length > 0) {
                getNewCard(username);
            } else {
                db.query(
                    `INSERT INTO Breezecard (BreezecardNum, Value, BelongsTo)
                    VALUES (?, ?, ?);`,
                    [card_num, 0.0, username]);
            }
        });
}

exports.register = function(req, res) {
    var user = {
        "username": req.body.username,
        "password": req.body.password, // md5 conversion ?
        "email": req.body.email,
        "confirm_password": req.body.confirm_password, // check in front end
        "use_exist_breezecard": req.body.use_exist_breezecard,
        "get_new_breezecard": req.body.get_new_breezecard,
        "breezecard_num": req.body.breezecard_num,
        "time": req.body.time
    };

    if (user.password != user.confirm_password) {
        res.send({
            "code": 200,
            "statusCode": "PASSWORD_DOES_NOT_MATCH",
            "message": "Password does not match"
        }).end();
        return;
    }

    console.log(user);

    // check if the username and email have been used
    db.query('SELECT * FROM Passenger WHERE Username = ?', user.username,
        function(err, rows, fields) {
            if (rows.length > 0) {
                res.send({
                    "code": 200,
                    "statusCode": "USER_NAME_OR_EMAIL_NOT_UNIQUE",
                    "message": "User [" + user.username + "] or " + "Email [" + user.email + "] exists. Please choose a differnet name/email"
                }).end();
                console.log("user already exist");
                return;
            }
            // first insert new user
            db.query(
                'INSERT INTO User (Username, Password, IsAdmin) VALUES (?, ?, ?);',
                [user.username, md5(user.password), 0],
                function(err, rows, fields) {
                    // insert new passenger
                    db.query(
                        'INSERT INTO Passenger (Username, Email) VALUES (?, ?);',
                        [user.username, user.email]);
                    // check if use a existed breezecard
                    if (user.use_exist_breezecard) {
                        db.query('SELECT * FROM Breezecard WHERE BreezecardNum = ?',
                            user.breezecard_num, function(err, rows, fields) {
                                if (rows.length > 0 && rows[0].BelongsTo != null) {
                                    db.query(
                                        `INSERT INTO Conflict (Username, BreezecardNum) VALUE (?, ?)`,
                                        [user.username, user.breezecard_num],
                                        function (err, rows, fields) {
                                            getNewCard(user.username);
                                        });
                                } else if (rows[0].BelongsTo == null) {
                                    var breezecardNum = rows[0].BreezecardNum;
                                    db.query(`UPDATE Breezecard SET BelongsTo = ? WHERE BreezecardNum = ?`,
                                        [user.username, breezecardNum]);
                                }
                            });
                    } else {
                        getNewCard(user.username);
                    }
                });
        });
}