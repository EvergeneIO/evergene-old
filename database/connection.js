const mysql = require('mysql');
var migration = require('mysql-migrations');

const pool  = mysql.createPool({
  connectionLimit : 10,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PW,
  database: process.env.DATABASE_DB
});

migration.init(pool, __dirname + '/migrations', function() {
  console.log("finished running migrations");
});

module.exports = pool;