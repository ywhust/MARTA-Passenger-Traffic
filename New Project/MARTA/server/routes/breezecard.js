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

    var bWhere = false;
    // prepre sql statement
    var sSql = "SELECT number, value, owner FROM BreezeCard";

    // prepare sql statement
    if (owner != "") {
        bWhere = true;   // where clause is added
        sSql += " where owner like '%" + owner + "%'";
    }

    if (cardnum != "") {
        if (!bWhere) // where clause added previously ?
        {
            bWhere = true;
            sSql += " where";
        }
        else
            sSql += " and";

        sSql += " number like '%" + cardnum + "%'";
    }

    // make sure to cast currency to decimal so that we can compare
    // 1) replace $ with "" first to remove the $ sign
    // 2) cast value to decimal
    var col_value = "cast(replace(value, '$','') as decimal(10,2))";
    if (min != "") {
        if (!bWhere) {
            bWhere = true;
            sSql += " where";
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

    sSql += ";";

    // search breeze card table based on owner
    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {

        if (typeof rows == 'undefined') {
            console.log("no matches found");
            res.send("").end();
        }
        else {
            console.log(rows); // results contains rows returned by server
            var json = JSON.stringify(rows);
            res.send(json).end();
        }
    });
}