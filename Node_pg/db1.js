const { Client } = require("pg");

// initialize var
let DB_URI;

// set up databases
if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql:///testdb";
} else {
  DB_URI = "postgresql:///userdb";
}

// function to start connect
let db = new Client({
  connectionString: DB_URI,
});

// establishes connection
db.connect();

// makes accessible to other files.
module.exports = db;
