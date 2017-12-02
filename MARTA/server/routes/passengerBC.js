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
            console.log(rows); // results contains rows returned by server
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
    var sSql = "INSERT INTO `Trip` (`Tripfare`, `StartTime`, `BreezecardNum`, `StartsAt`) VALUES ('" + trip.tripFare + "', '2017-12-1 21:20:3', '"
        + trip.cardnum + "',  (Select StopID from Station where Name = '" + trip.startsAt + "'));";

    // search breeze card table based on owner
    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {
        if (err) {
            console.log("error ocurred", err);
            res.send({
                "message": err.message
            }).end();
            return;
        } else {
            res.send({
                "message": "Trip started!"
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