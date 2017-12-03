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

    // select non-suspended breeze cards
    var sSql = "SELECT * FROM Breezecard WHERE BreezecardNum NOT IN (Select C.BreezecardNum from Conflict AS C)";

    if (cardnum != "") {
        sSql += " and BreezecardNum = '" + cardnum + "';";
    }

    // search breeze card table based on owner
    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {

        if (typeof rows == 'undefined') {
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


exports.checkForNull = function (req, res) {

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
    //var cardnum = req.body.cardnum || "";

    // prepre sql statement
    var sSql = "Select M.Enterfare, T1.StartTime, T1.BreezecardNum, M.Name from Trip AS T1, (Select * from Station AS S where S.StopID IN (Select StartsAt from Trip AS T where T.EndsAt is NULL)) AS M where T1.StartsAt = M.StopID;";

    // if (cardnum != "") {
    //     sSql += " where BreezecardNum = '" + cardnum + "';";
    // }

    // search breeze card table based on owner
    //console.log(sSql);
    db.query(sSql, function (err, rows, fields) {

        if (typeof rows == 'undefined') {
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

exports.getNewStations = function (req, res) {

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
    // var sSql = "SELECT * FROM Station where 'isTrain' = (SELECT 'isTrain'"
    //     + " FROM Station where (Select StopID from Station where Name = '" + req.body.startsAt + "'))";
    var sSql = "Select Name from Station AS S where S.IsTrain = (Select IsTrain FROM Station AS C where C.Name = '"
        + req.body.startsAt + "');"
    // search breeze card table based on owner
    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {

        if (typeof rows == 'undefined') {
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

exports.startTrip = function (req, res) {
    console.log("req", req.body);
    var trip = {
        "cardnum": req.body.cardnum,
        "startsAt": req.body.startsAt,
        "tripFare": req.body.tripFare,
        "startTime": req.body.startTime,
    }
    // check data type
    if (typeof req.body == 'undefined') {
        res.send({
            "code": 200,
            "statusCode": "No parameter found",
            "success": "No parameter found"
        }).end();
        return;
    }

    // prepre sql statement - inserting the new trip into the trip table
    var sSql = "INSERT INTO `Trip` (`Tripfare`, `StartTime`, `BreezecardNum`, `StartsAt`) VALUES ('" + trip.tripFare + "', '" + trip.startTime + "', '"
        + trip.cardnum + "',  (Select StopID from Station where Name = '" + trip.startsAt + "'));";

    // search breeze card table based on owner
    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {
        2
        if (err) {
            console.log("error ocurred", err);
            res.send({
                "message": err.message,
            }).end();
            return;
        } else {
            res.send({
                "message": "Trip started!",
                "sql": sSql
            }).end();
            return;
        }
    });

    // prepre sql statement - subtracting trip fare from balance of breezecard
    // var sSql2 = "Select Value from Breezecard where BreezecardNum = ''" + trip.cardnum + "', '" + trip.startTime + "', '"
    //     + trip.cardnum + "',  (Select StopID from Station where Name = '" + trip.startsAt + "');";

    // search breeze card table based on owner
    // console.log(sSql2);
    // db.query(sSql2, function (err, rows, fields) {
    //     if (err) {
    //         console.log("error ocurred", err);
    //         res.send({
    //             // "code": 400,
    //             // "failed": "database error ocurred"
    //         }).end();
    //         return;
    //     } else {
    //         res.send({

    //         })
    //     }
    // });
}

exports.endTrip = function (req, res) {
    console.log("req", req.body);
    var trip = {
        "cardnum": req.body.cardnum,
        "startsAt": req.body.startsAt,
        "tripFare": req.body.tripFare,
        "startTime": req.body.startTime,
        "endsAt": req.body.endsAt,
    }
    // check data type
    if (typeof req.body == 'undefined') {
        res.send({
            "code": 200,
            "statusCode": "No parameter found",
            "success": "No parameter found"
        }).end();
        return;
    }

    // prepre sql statement - inserting the new trip into the trip table
    var sSql = "UPDATE Trip SET EndsAt = (SELECT StopID from Station WHERE Name = '" + trip.endsAt
        + "') WHERE BreezecardNum = '" + trip.cardnum + "' AND StartTime = '" + trip.startTime + "';";

    // search breeze card table based on owner
    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {
        console.log(rows.affectedRows)
        if (err) {
            console.log("error ocurred", err);
            res.send({
                "message": err.message
            }).end();
            return;
        }  else if (rows.affectedRows == 0) {
            console.log("no matches found");
            res.send({
                "message": "Trip not able to be ended; update statement failed",
                "sql": sSql
            }).end();
        } else {
            res.send({
                "message": "Trip ended!",
                "sql": sSql
            }).end();
            return;
        }
    });
}

exports.subtractBalance = function (req, res) {
    console.log("req", req.body);
    var trip = {
        "cardnum": req.body.cardnum,
        "tripFare": req.body.tripFare, 
        "balance": req.body.balance,
    }
    // check data type
    if (typeof req.body == 'undefined') {
        res.send({
            "code": 200,
            "statusCode": "No parameter found",
            "success": "No parameter found"
        }).end();
        return;
    }

    // prepre sql statement - inserting the new trip into the trip table
    var sSql = "UPDATE Breezecard SET Value = " + trip.balance
        + " WHERE BreezecardNum = '" + trip.cardnum + "';";

    // search breeze card table based on owner
    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {
        if (err) {
            console.log("error ocurred", err);
            res.send({
                "message": err.message
            }).end();
            return;
        }  else {
            res.send({
                "message": "Balance updated: ",
                "sql": sSql
            }).end();
            return;
        }
    });
}

