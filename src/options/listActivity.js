const db = require('../config/db');

function print_table(query, params) {
  db.all(query, params, (err, rows) => {
    if (rows && rows.length > 0) console.table(rows, Object.keys(rows[0]));
    else console.log('No hay datos guardados');
  });
  db.close();
}

function listActivities() {
  const query =
    'SELECT a.name, a.description, t.name AS priority FROM activity a INNER JOIN type_priority t ON a.type_priority_id = t.type_priority_id WHERE a.active = 1';
  print_table(query);
}

function listActivitiesByDay() {
  const query =
    "SELECT a.name, a.description, (CASE WHEN ((SELECT b.completed FROM bitacora b WHERE b.active = 1 AND b.activity_id = a.activity_id) IS NULL) THEN 'TODO' ELSE 'COMPLETED' END) AS estado FROM activity a WHERE a.active = 1 AND a.type_priority_id = 2";
  print_table(query);
}

function getActivityById(id) {
  const query = 'SELECT * FROM activity WHERE activity_id = ?';
  print_table(query, [id]);
}

module.exports = { listActivities, listActivitiesByDay, getActivityById };
