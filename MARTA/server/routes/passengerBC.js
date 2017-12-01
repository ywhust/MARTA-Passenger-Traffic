const db = require('../dbconnection');

exports.getBreezeCardNums = function (req, res) {

    // check data type
    if (typeof req.body == 'undefined') {
        res.send({
            "code": 200,
            "statusCode": "No parameter found",
            "success": "No parameter found"
        }).end();
        return;
    }

    // breeze card search option
    var cardnum = req.body.cardnum || "";
        
    // remove white space from card number
    cardnum = cardnum.replace(/\s/g, "");

    // prepre sql statement
    var sSql = "SELECT * FROM Breezecard";

    if (cardnum != "") {
        sSql += " where BreezecardNum = '" + cardnum + "';";
    }

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

exports.getStation = function (req, res) {
    
        // check data type
        if (typeof req.body == 'undefined') {
            res.send({
                "code": 200,
                "statusCode": "No parameter found",
                "success": "No parameter found"
            }).end();
            return;
        }
    
        // prepre sql statement
        var sSql = "SELECT * FROM Station";
    
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