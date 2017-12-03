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