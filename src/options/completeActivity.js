const { prompt } = require('inquirer');
const db = require('../config/db');

function completeActivity() {
  db.all('SELECT * FROM actividad', (err, rows) => {
    prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Seleccione la actividad',
        choices: rows.map(e => e.actividad_id + '-' + e.nombre),
        default: 0,
      },
    ]).then(res => {
      db.all(
        `SELECT * FROM link where actividad_id =${
          res.id.split('-')[0]
        } and finalizado = 0`,
        (err, rows) => {
          prompt([
            {
              type: 'checkbox',
              name: 'complete',
              message: 'Seleccione los links',
              choices: rows.map(e => e.link_id + '-' + e.url),
              default: 0,
            },
          ]).then(select => {
            if (select.complete?.length > 0) {
              const stmt = db.prepare(
                "UPDATE link set finalizado=1, fecha_finalizado=datetime('now','localtime') where link_id = ?"
              );
              select.complete.forEach(element => {
                stmt.run(element.split('-')[0]);
              });
              stmt.finalize();
            }
          });
        }
      );
    });
  });
}

module.exports = { completeActivity };
