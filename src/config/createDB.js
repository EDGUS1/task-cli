const sqlite3 = require('sqlite3').verbose();

const createDB = dbname => {
  return new sqlite3.Database(dbname, sqlite3.OPEN_READWRITE, err => {
    if (err) return console.error(err.message, dbname);
    // console.log('connected');
  });
};

module.exports = createDB;
