const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "employee_DB"
});

module.exports = connection;