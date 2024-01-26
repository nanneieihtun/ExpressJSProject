const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

dbConnection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("DB " + dbConnection.state);
});

module.exports = dbConnection;
