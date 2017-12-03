const db = require('../databases/dbconnection');

exports.getStationById = function (req, res) {
    // check data type
    if (typeof req.body == 'undefined') {
        res.send({
            "code": 200,
            "statusCode": "No parameter found",
            "success": "No parameter found"
        }).end();
        return;
    }

    var id = req.params.id;

    // prepre sql statement
    var sSql = "SELECT * FROM Station where StopID = '" + id + "'";

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


exports.updateFare = function (req, res) {

    // check data type
    if (typeof req.body == 'undefined') {
        res.send({
            "code": 200,
            "statusCode": "No parameter found",
            "success": "No parameter found"
        }).end();
        return;
    }

    var fare = req.body.fare;
    var id = req.params.id;

    console.log(fare);
    console.log(id);

    //prepre sql statement
    var sSql = "Update Station SET EnterFare = '" + fare + "' where StopID = '" + id + "'";


    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {

        if (typeof rows == 'undefined') {
            console.log("no matches found");
            res.send("").end();
        }
        else {

            // console.log(rows); // results contains rows returned by server
            // var json = JSON.stringify(rows);
            // res.send(json).end();

            res.send({
                "message": "fare updated",
                "sql": sSql
            }).end();
            return;
        }
    });
}



exports.updateStatus = function (req, res) {

    // check data type
    if (typeof req.body == 'undefined') {
        res.send({
            "code": 200,
            "statusCode": "No parameter found",
            "success": "No parameter found"
        }).end();
        return;
    }

    var status = req.body.status;
    var id = req.params.id;


    //prepre sql statement
    var sSql = "Update Station set ClosedStatus = '" + status + "' where StopID = '" + id + "'";


    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {

        if (typeof rows == 'undefined') {
            console.log("no matches found");
            res.send("").end();
        }
        else {

            // console.log(rows); // results contains rows returned by server
            // var json = JSON.stringify(rows);
            // res.send(json).end();

            res.send({
                "message": "closedstatus updated to " + status,
                "sql": sSql
            }).end();
            return;
        }
    });
}



exports.createStation = function (req, res) {

    // check data type
    if (typeof req.body == 'undefined') {
        res.send({
            "code": 200,
            "statusCode": "No parameter found",
            "success": "No parameter found"
        }).end();
        return;
    }

    var name = req.body.name;
    var stopid = req.body.StopID;
    var fare = req.body.fare;
    var isTrain = req.body.isTrain;
    var closedstatus = req.body.closedstatus;


    //prepre sql statement
    var sSql = "Insert into Station(StopID, Name, EnterFare, ClosedStatus, IsTrain) ";
    sSql += "Values('" + stopid + "', '" + name + "', " + fare + ", ";
    sSql += isTrain + ", " + closedstatus + ")";



    console.log(sSql);
    db.query(sSql, function (err, rows, fields) {

        if (typeof rows == 'undefined') {
            console.log(err.sqlMessage);
            console.log("no matches found");

            res.send("").end();
        }
        else {

            res.send("New Station created!").end();
            return;
        }
    });
}