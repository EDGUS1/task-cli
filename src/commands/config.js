let fs = require('fs');
const path = require('node:path');

const db = require('../config/db');
const { log_error } = require('../utils/print');

const configdb = () => {
  fs.readFile(
    path.join(__dirname, '..', 'schema.sqlite3'),
    'utf-8',
    (err, data) => {
      if (err) {
        console.log('error: ', err);
      } else {
        db.serialize(() => {
          data
            .split(';')
            .map(e => e.replace(/\n|\r/g, ''))
            .forEach(e => db.run(e));
        });
        console.log('Objetos de DB creados correctamente');
        db.close(err => {
          if (err) return log_error(err.message);
        });
      }
    }
  );
};

module.exports = { configdb };
