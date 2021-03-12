const mysql = require('mysql');

const pool  = mysql.createPool({
  connectionLimit : 10,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PW,
  database: process.env.DATABASE_DB
});

module.exports = pool;