const db = require('../dbconnection');

exports.getBreezeCard = function (req, res) {

    // check data type
    if (typeof req.body == 'undefined') {
        res.send({
            "code": 200,
            "statusCode": "No parameter found",
            "success": "No parameter found"
        }).end();
        return;
    }

    // breeze card search options
    var owner = req.body.owner || "";
    var cardnum = req.body.cardnum || "";
    var min = req.body.min || "";
    var max = req.body.max || "";
    var suspended = req.body.suspended;
    var bWhere = false;

    // remove white space from card number
    cardnum = cardnum.replace(/\s/g, "");

    // prepre sql statement
    if (suspended === "true") {
        var sSql = "Select B. BreezecardNum, B.Value, IF(B.BreezecardNum not in (select BreezecardNum from Conflict), B.BelongsTo, 'Suspended') AS BelongsTo from Breezecard AS B";
    } else {
        var sSql = "SELECT * FROM Breezecard";
    }

    // prepare sql statement
    if (owner != "") {
        bWhere = true;   // where clause is added
        sSql += " WHERE BelongsTo like '%" + owner + "%'";
    }

    if (cardnum != "") {
        if (!bWhere) // where clause added previously ?
        {
            bWhere = true;
            sSql += " WHERE";
        }
        else
            sSql += " and";

        //sSql += " replace(number, ' ', '') like '%" + cardnum + "%'"; // card includes 'cardnum'
        sSql += " replace(BreezecardNum, ' ', '') like '" + cardnum + "%'"; // card start with 'cardnum'
    }

    // make sure to cast currency to decimal so that we can compare
    // 1) replace $ with "" first to remove the $ sign
    // 2) cast value to decimal
    var col_value = "cast(replace(value, '$','') as decimal(10,2))";
    if (min != "") {
        if (!bWhere) {
            bWhere = true;
            sSql += " WHERE";
        }
        else
            sSql += " and";

        sSql += " " + col_value + ">=" + min;
    }


    if (max != "") {
        if (!bWhere) {
            bWhere = true;
            sSql += " where";
        }
        else
            sSql += " and";

        sSql += " " + col_value + "<=" + max;
    }
    console.log(suspended);
    if (suspended == undefined || suspended === "false") {
        if (!bWhere) {
            bWhere = true;
            sSql += " where";
        }
        else
            sSql += " and";
        sSql += " BreezecardNum not in (select BreezecardNum from Conflict)";
    }

    sSql += ";";

    // search breeze card table based on owner
    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {
        if (err) {
            console.log("error ocurred", err);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        }
        else if (typeof rows == 'undefined') {
            console.log("no matches found");
            res.send("").end();
        }
        else {
            // console.log(rows); // results contains rows returned by server
            var json = JSON.stringify(rows);
            res.send(json).end();
        }
    });
}

//////////newly added pumpkin////////////////////////////////////////

exports.updateBCValue = function (req, res) {

    // check data type
    if (typeof req.body == 'undefined') {
        res.send({
            "code": 200,
            "statusCode": "No parameter found",
            "success": "No parameter found"
        }).end();
        return;
    }

    var value = req.body.updatedValue;
    var num = req.body.num;

    // prepre sql statement
    var sSql = "Update Breezecard SET Value = '" + value + "' where BreezecardNum = '" + num + "'";

    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {

        if (typeof rows == 'undefined') {
            console.log("no matches found");
            res.send("").end();
        }
        else {
            console.log(rows); // results contains rows returned by server
            res.send("fare updated").end();
        }
    });
}


exports.deleteFromConflict = function (req, res) {

    // check data type
    if (typeof req.body == 'undefined') {
        res.send({
            "code": 200,
            "statusCode": "No parameter found",
            "success": "No parameter found"
        }).end();
        return;
    }

    var num = req.body.num;

    // prepre sql statement
    var sSql = "Delete from Conflict where BreezecardNum = '" + num + "'";

    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {

        if (typeof rows == 'undefined') {
            console.log("no matches found");
            res.send("").end();
        }
        else {
            // console.log(rows); // results contains rows returned by server
            res.send("if card exists in conflict table, deleted").end();
        }
    });
}

exports.updateOwner = (req, res) => {
    if (typeof req.body == 'undefined') {
        res.send({
            "code": 200,
            "statusCode": "No parameter found",
            "success": "No parameter found"
        }).end();
        return;
    }

    var updatedOwner = req.body.updatedOwner;
    var num = req.body.num;


    var sSql = "Update Breezecard set BelongsTo = '" + updatedOwner + "' ";
    sSql += "where BreezecardNum = '" + num + "';";

    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {

        if (typeof rows == 'undefined') {
            console.log(err);
            console.log("no matches found");
            res.send("").end();
        }
        else {
            // console.log(rows); // results contains rows returned by server
            res.send("owner updated").end();
        }
    });
}


exports.checkPrevious = (req, res) => {
    if (typeof req.body == 'undefined') {
        res.send({
            "code": 200,
            "statusCode": "No parameter found",
            "success": "No parameter found"
        }).end();
        return;
    }

    var previousOwner = req.body.previousOwner;
    console.log(sSql);

    var sSql = "Select count(*) from Breezecard where BelongsTo = '" + previousOwner + "'";

    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {

        if (typeof rows == 'undefined') {
            console.log(err);
            console.log("no matches found");
            res.send("").end();
        }
        else {
            console.log("row is" + rows); // results contains rows returned by server
            res.send(rows).end();
        }
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

// generate a breezecard number
exports.generateNewCard = function (req, res) {
    var previousOwner = req.body.previousOwner;
    card_num = randomString(16, '0123456789');
    console.log(previousOwner);
    console.log(card_num);

    generateIntoDB(previousOwner);

}

function generateIntoDB(previousOwner) {

    db.query('SELECT * FROM Breezecard WHERE BreezecardNum = ?',
        card_num, function (err, rows, fields) {
            if (rows.length > 0) {
                generateIntoDB(previousOwner);
            } else {

                var sSql = "INSERT INTO Breezecard (BreezecardNum, Value, BelongsTo)";
                sSql += "VALUES('" + card_num + "', " + 0.0 + ", '" + previousOwner + "';";
                console.log(sSql);
                db.query(
                    `INSERT INTO Breezecard (BreezecardNum, Value, BelongsTo)
                    VALUES (?, ?, ?);`,
                    [card_num, 0.0, previousOwner], (err, rows, fields) => {

                        if (typeof rows == 'undefined') {
                            console.log(err);
                            console.log("no matches found");
                        }
                        else {
                            console.log("A new breezecard has been generated for " + previousOwner);
                            console.log("row is" + rows); // results contains rows returned by server
                        }

                    });
            }
        });
}