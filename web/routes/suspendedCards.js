const db = require('../databases/dbconnection');

var getCardsInfo = function(req, res) {
    var sql = `SELECT C.BreezecardNum, C.Username, C.DateTime, B.BelongsTo
               FROM Conflict AS C
               LEFT JOIN Breezecard AS B
               ON C.BreezecardNum = B.BreezecardNum;`
    db.query(sql, function(err, rows, fields) {
        console.log(rows);
        res.send(JSON.stringify(rows));
        res.end();
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

exports.getSuspendedCards = function(req, res) {
    getCardsInfo(req, res);
}

exports.assignToOldOwner = function(req, res) {
    var breezecard_num = req.body.breezecard_num;
    var new_owner = req.body.new_owner;
    var old_owner = req.body.old_owner;

    var sql = `DELETE FROM Conflict WHERE BreezecardNum = ${breezecard_num}`;
    db.query(sql, function(err, rows, fields) {
        if (err) {
            console.log('Error: ' + err);
        }
        getCardsInfo(req, res);
    });
}

exports.assignToNewOwner = function(req, res) {
    var breezecard_num = req.body.breezecard_num;
    var new_owner = req.body.new_owner;
    var old_owner = req.body.old_owner;

    db.query(`SELECT * FROM Breezecard WHERE BelongsTo = ?`, old_owner,
        function(err, rows, fields) {
            // assign this card to the selected new owner
            db.query(`UPDATE Breezecard SET BelongsTo = ? WHERE BreezecardNum = ?`,
                [new_owner, breezecard_num]);
            // check whether the previous owner has another card
            // if not, generate a new card for him
            if (rows.length <= 0) {
                db.query('SELECT BreezecardNum, BelongsTo FROM Breezecard',
                    function(err, rows, fields) {
                        var cards_list = [];
                        var users_list = [];
                        for (var i = 0; i < rows.length; i++) {
                            cards_list.push(rows[i].BreezecardNum);
                            users_list.push(rows[i].BelongsTo);
                        }
                        breezecard_num = randomString(16, '0123456789');
                        while (cards_list.indexOf(breezecard_num) > -1) {
                            breezecard_num = randomString(16, '0123456789');
                        }
                        db.query(`INSERT INTO Breezecard (BreezecardNum, Value, BelongsTo) VALUES (?, ?, ?);`,
                            [breezecard_num, 0.0, old_owner]);
                    });
            }
            // remove these conflicts and response with the current conflict info
            db.query(`DELETE FROM Conflict WHERE BreezecardNum = ${breezecard_num}`,
                function(err, rows, fields) {
                    getCardsInfo(req, res);
                });
        });
}