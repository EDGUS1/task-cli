const { prompt } = require('inquirer');
const db = require('../config/db');

function completeActivity() {
  db.all('SELECT * FROM activity', (err, rows) => {
    prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Seleccione la actividad',
        choices: rows.map(e => e.activity_id + '-' + e.name),
        default: 0,
      },
    ]).then(res => {
      db.all(
        `SELECT * FROM reference where activity_id =${
          res.id.split('-')[0]
        } and completed = 0`,
        (err, rows) => {
          prompt([
            {
              type: 'checkbox',
              name: 'complete',
              message: 'Seleccione los references',
              choices: rows.map(e => e.reference_id + '-' + e.url),
              default: 0,
            },
          ]).then(select => {
            if (select.complete?.length > 0) {
              const stmt = db.prepare(
                "UPDATE reference set completed=1, completed_at=datetime('now','localtime') where reference_id = ?"
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
  db.close();
}

module.exports = { completeActivity };
