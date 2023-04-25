const db = require('../config/db');

async function listActivities() {
  db.all('SELECT nombre, descripcion FROM actividad', (err, rows) => {
    console.table(rows, Object.keys(rows[0]));
  });
}

function listActivitiesByDay() {
  db.all(
    'SELECT nombre, descripcion FROM actividad where tipo_prioridad_id = 0',
    function (err, row) {
      console.table(row, Object.keys(row[0]));
    }
  );
}

module.exports = { listActivities, listActivitiesByDay };
