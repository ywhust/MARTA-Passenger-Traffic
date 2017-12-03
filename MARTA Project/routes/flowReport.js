const db = require('../databases/dbconnection');

exports.flowReport = function(req, res) {
    var starttime = req.query.starttime;
    var endtime = req.query.endtime;

    console.log(typeof starttime);
    console.log(typeof endtime);

    var constraint = '';
    if (typeof starttime != 'undefined' && starttime.trim() != '') {
        if (constraint == '') {
            constraint += 'WHERE ';
        } else {
            constraint += ' AND ';
        }
        constraint += `StartTime >= '${starttime}'`;
    }

    if (typeof endtime != 'undefined' && endtime.trim() != '') {
        if (constraint == '') {
            constraint += 'WHERE ';
        } else {
            constraint += ' AND ';
        }
        constraint += `StartTime <= '${endtime}'`;
    }

    console.log(constraint);

    var sql = `SELECT IFNULL(M.StartsAt, M.EndsAt) AS StartsAt, M.FlowIn, M.FlowOut, (M.FlowIn - M.FlowOut) AS Flow, M.Tripfare
               FROM (
                   SELECT X.StartsAt, X.EndsAt, IFNULL(X.FlowIn, 0) AS FlowIn, IFNULL(X.FlowOut, 0) AS FlowOut, IFNULL(X.Tripfare, 0) AS Tripfare
                   FROM (
                       SELECT * FROM (
                           SELECT StartsAt, count(*) AS FlowIn, SUM(Tripfare) AS Tripfare
                           FROM Trip
                           ${constraint}
                           GROUP BY StartsAt
                           ) AS S
                       LEFT JOIN (
                           SELECT EndsAt, count(*) AS FlowOut
                           FROM Trip
                           ${constraint}
                           GROUP BY EndsAt
                           ) AS E
                       ON S.StartsAt = E.EndsAt
                       UNION
                       SELECT * FROM (
                           SELECT StartsAt, count(*) AS FlowIn, SUM(Tripfare) AS Tripfare
                           FROM Trip
                           ${constraint}
                           GROUP BY StartsAt
                           ) AS S
                       RIGHT JOIN (
                           SELECT EndsAt, count(*) AS FlowOut
                           FROM Trip
                           ${constraint}
                           GROUP BY EndsAt
                           ) AS E
                       ON S.StartsAt = E.EndsAt
                       ) AS X
                   WHERE X.StartsAt IS NOT NULL OR X.EndsAt IS NOT Null
                   ) AS M;`;
    db.query(sql, function(err, rows, fields) {
        console.log(rows);
        res.send(JSON.stringify(rows));
        res.end();
    });
}