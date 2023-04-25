const { prompt } = require('inquirer');
const db = require('../config/db');

function updateActivity() {
  db.all(
    'SELECT * FROM actividad where tipo_prioridad_id = 0 and actividad_id NOT IN (SELECT actividad_id from bitacora)',
    (err, rows) => {
      prompt([
        {
          type: 'checkbox',
          name: 'complete',
          message: 'Seleccione la(s) actividad(es)',
          choices: rows.map(e => e.actividad_id + '-' + e.nombre),
          default: 0,
        },
      ]).then(select => {
        if (select.complete?.length > 0) {
          const stmt = db.prepare(
            "INSERT into bitacora (actividad_id, hecho, fecha_creacion, fecha_hecho) VALUES (?,1,datetime('now','localtime'),datetime('now','localtime'))"
          );
          select.complete.forEach(element => {
            stmt.run(element.split('-')[0]);
          });
          stmt.finalize();
        }
      });
    }
  );
}

module.exports = { updateActivity };
