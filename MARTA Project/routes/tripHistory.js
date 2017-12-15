const db = require('../databases/dbconnection');

exports.tripHistory = function(req, res) {
    var username = req.query.username;
    var starttime = req.query.starttime;
    var endtime = req.query.endtime;

    console.log(username);
    console.log(starttime);
    console.log(endtime);

    var constraint = '';
    if (typeof starttime != 'undefined' && starttime.trim() != '') {
        constraint += ` AND StartTime >= '${starttime}'`;
    }

    if (typeof endtime != 'undefined' && endtime.trim() != '') {
        constraint += ` AND StartTime <= '${endtime}'`;
    }

    console.log(constraint);

    var sql = `SELECT I.StartTime, I.Name AS Source, S.Name AS Destination, I.Tripfare, I.BreezecardNum
               FROM (
                   SELECT T.StartTime, S.Name, T.EndsAt, T.Tripfare, T.BreezecardNum
                   FROM (
                       SELECT * FROM Trip
                       WHERE BreezecardNum NOT IN (
                           SELECT BreezecardNum FROM Conflict
                           ) AND BreezecardNum IN (
                           SELECT BreezecardNum FROM Breezecard WHERE BelongsTo = ?
                           ) ${constraint}
                       ) AS T, Station AS S
                   WHERE T.StartsAt = S.StopID
                   ) AS I, Station AS S
               WHERE I.EndsAt = S.StopID;`;
    db.query(sql, username, function(err, rows, fields) {
        console.log(rows);
        res.send(JSON.stringify(rows));
        res.end();
    });
}