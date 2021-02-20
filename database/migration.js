const mysql = require('mysql');
var migration = require('mysql-migrations');
const router = require('express').Router();


const connection = mysql.createPool({
  connectionLimit : 10,
  host     : '138.201.49.147',
  user     : 'evergene-test',
  password : 'evergene1234',
  database : 'evergene-test'
});

migration.init(connection, __dirname + '/migrations', function() {
  console.log("finished running migrations");
});

module.exports = router;