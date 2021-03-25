const mysql = require("mysql");
const dotenv = require('dotenv');
dotenv.config();

const Endpoint = require("./InternEndpoint.js");


//! **************************************************
//! * vom root mit "node .\classes\test.js" starten! *
//! **************************************************


new Endpoint(null, "blah", {dynamic: "lmao"},null, function (res, req) {
    console.log("foo");
})
/*
 const pool = mysql.createPool({
     connectionLimit: 10,
     host: process.env.DATABASE_HOST,
     user: process.env.DATABASE_USER,
     password: process.env.DATABASE_PW,
     database: process.env.DATABASE_DB
 });

pool.query('SELECT * FROM user WHERE discordId = 310115562305093632', function (error, results, fields) {
     if (error) throw error;
     let test = JSON.stringify(results)
     console.log(test);
 });
*/
// const UserEndpoint = require("./UserEndpoint.js");

// new UserEndpoint(null, null, {}, function(res, req) {
//     console.log("foo");
// }, "12345678", "I-AM-A-KEY", true, ["KEY1", "KEY2"])