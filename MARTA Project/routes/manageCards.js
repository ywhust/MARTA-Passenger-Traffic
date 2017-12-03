const db = require('../databases/dbconnection');

//
var getCardsInfo = function(req, res, belongsTo) {
    var sql = `SELECT BreezecardNum, Value FROM Breezecard
               WHERE BelongsTo = ? AND BreezecardNum NOT IN (SELECT BreezecardNum FROM Conflict);`
    db.query(sql, belongsTo, function (err, rows, fields) {
        console.log(rows);
        res.send(JSON.stringify(rows));
        res.end();
    });
}

exports.getBreezecards = function(req, res) {
    var belongsTo = req.query.belongsTo;
    // query database
    getCardsInfo(req, res, belongsTo);
}

exports.removeBreezecard = function(req, res) {
    var belongsTo = req.body.belongsTo;
    var breezecardNum = req.body.breezecardNum;
    var sql = `UPDATE Breezecard SET BelongsTo = NULL
               WHERE BreezecardNum = ? AND
                   (BreezecardNum NOT IN (SELECT BreezecardNum FROM Trip) OR
                   (SELECT EndsAt FROM Trip WHERE BreezecardNum = ?) IS NOT NULL);`;
    db.query(sql, [breezecardNum, breezecardNum], function(err, rows, fields) {
        console.log(rows);
        if (rows.affectedRows == 0) {
            res.send({
                "message": "You cannot remove a in-trip card."
            })
        } else {
            getCardsInfo(req, res, belongsTo);
        }
    });
}

exports.addBreezecard = function(req, res) {
    var belongsTo = req.body.belongsTo;
    var breezecardNum = req.body.breezecardNum;
    // get all breezecard number first
    db.query('SELECT BreezecardNum, BelongsTo FROM Breezecard', function(err, rows, fields) {
        cards_list = [];
        users_list = [];
        for (var i = 0; i < rows.length; i++) {
            cards_list.push(rows[i].BreezecardNum);
            users_list.push(rows[i].BelongsTo);
        }
        var index = cards_list.indexOf(breezecardNum);

        // if the card exist and has an owner, generated a new conflict
        // if card exist but no owner, assign it to this user
        // otherwise add this card to this user
        if (index > -1 && users_list[index] != null) {
            db.query(`INSERT INTO Conflict (Username, BreezecardNum) VALUE (?, ?)`,
                [belongsTo, cards_list[index]], function(err, rows, fields) {
                    if (err) {
                        console.log('Conflict already exist.');
                    }
                });
        } else if (index > -1 && users_list[index] == null) {
            db.query(`UPDATE Breezecard SET BelongsTo = ? WHERE BreezecardNum = ?`,
                [belongsTo, breezecardNum], function(err, rows, fields) {
                    getCardsInfo(req, res, belongsTo);
                });
        } else {
            db.query(`INSERT INTO Breezecard (BreezecardNum, Value, BelongsTo) VALUES (?, ?, ?);`,
                [breezecardNum, 0.0, belongsTo], function(err, rows, fields) {
                    getCardsInfo(req, res, belongsTo);
                });
        }
    });
}

exports.addValueBreezecard = function(req, res) {
    var breezecardNum = req.body.breezecardNum;
    var value = req.body.value;
    var belongsTo = req.body.belongsTo;
    db.query('UPDATE Breezecard SET Value = Value + ? WHERE BreezecardNum = ?',
        [value, breezecardNum], function(err, rows, fields) {
            getCardsInfo(req, res, belongsTo);
        });
}

// generate randon string
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}