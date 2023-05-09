let fs = require('fs');
const path = require('node:path');

const configdb = database => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, '..', 'schema.sqlite3'),
      'utf-8',
      (err, data) => {
        if (err) reject(err.message);
        database.serialize(() => {
          const d = data.split(';');
          let t = 0;
          d.map(e => e.replace(/\n|\r/g, '')).forEach(q => {
            database.run(q, function (err) {
              if (err) reject(err.message);
              if (d.length == ++t) resolve('Objetos creados correctamente');
            });
          });
        });
      }
    );
  });
};

module.exports = { configdb };
