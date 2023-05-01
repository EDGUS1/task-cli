const { prompt } = require('inquirer');
const db = require('../config/db');

function completeActvDaily() {
  db.all(
    'SELECT activity_id, name FROM activity where type_priority_id = 2 and activity_id NOT IN (SELECT activity_id from bitacora)',
    (err, rows) => {
      if (rows && rows.length > 0) {
        prompt([
          {
            type: 'checkbox',
            name: 'complete',
            message: 'Seleccione la(s) actividad(es)',
            choices: rows.map(e => e.activity_id + '-' + e.name),
            default: 0,
          },
        ]).then(select => {
          if (select.complete?.length > 0) {
            const stmt = db.prepare(
              "INSERT into bitacora (activity_id, completed, completed_at) VALUES (?,1,datetime('now','localtime'))"
            );
            select.complete.forEach(element => {
              stmt.run(element.split('-')[0]);
            });
            stmt.finalize();
          }
        });
      } else {
        console.log('Todas las actividades han sido completadas');
      }
    }
  );
  db.close();
}

module.exports = { completeActvDaily };
