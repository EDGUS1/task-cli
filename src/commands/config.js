let fs = require('fs');
const db = require('../config/db');
// const db = require('./config/db');

const configdb = async () => {
  fs.readFile('./src/schema.sqlite3', 'utf-8', (err, data) => {
    if (err) {
      console.log('error: ', err);
    } else {
      data
        .split(';')
        .map(e => e.replace(/\n|\r/g, ''))
        .forEach(e => db.run(e));

      db.close(err => {
        if (err) return console.error(err.message);
      });
    }
  });
};

module.exports = { configdb };
