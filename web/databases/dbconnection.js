var mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'academic-mysql.cc.gatech.edu',
    user: 'cs4400_Group_111',
    password: 'u1kjn118',
    database: 'cs4400_Group_111'
});

module.exports = connection;