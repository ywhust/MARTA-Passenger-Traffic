const db = require('../databases/dbconnection');

exports.stationsListing = function(req, res) {
    // query database
    db.query('SELECT * FROM Station;', function (err, rows, fields) {
        console.log(rows);
        res.send(JSON.stringify(rows));
        res.end();
    });
}