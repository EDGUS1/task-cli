const { prompt } = require('inquirer');

const db = require('../config/db');

function print_table(query, params) {
  db.all(query, params, (err, rows) => {
    if (rows && rows.length > 0) console.table(rows, Object.keys(rows[0]));
    else console.log('No hay datos guardados');
  });
  db.close();
}

function listAllReference() {
  const query =
    'SELECT r.description, r.url, t.name FROM reference r LEFT JOIN type_reference t ON r.type_reference_id = t.type_reference_id WHERE r.active = 1';
  print_table(query, []);
}

function callRefByType(type) {
  const query =
    'SELECT url, description FROM reference WHERE active = 1 AND type_reference_id = ?';
  print_table(query, type);
}

function listReferenceByType() {
  db.all(
    'SELECT type_reference_id, name FROM type_reference WHERE active = 1 ORDER BY type_reference_id',
    (err, rows) => {
      prompt([
        {
          type: 'list',
          name: 'id',
          message: 'Seleccione el tipo de referencia',
          choices: rows.map(e => e.type_reference_id + '-' + e.name),
          default: 0,
        },
      ])
        .then(response => {
          callRefByType(response.id.split('-')[0]);
        })
        .catch(error => {
          console.error(error);
        });
    }
  );
}

function callDBRefByActvity(activity_id) {
  const query =
    'SELECT r.url, r.description, t.name FROM reference r INNER JOIN reference_activity a ON r.reference_id = a.reference_id INNER JOIN type_reference t ON t.type_reference_id = r.type_reference_id WHERE a.active = 1 AND a.activity_id = ?';
  print_table(query, [activity_id]);
}

function listReferenceByActvity() {
  db.all(
    'SELECT activity_id, name FROM activity WHERE active = 1 ORDER BY activity_id',
    (err, rows) => {
      prompt([
        {
          type: 'list',
          name: 'id',
          message: 'Seleccione la actividad',
          choices: rows.map(e => e.activity_id + '-' + e.name),
          default: 0,
        },
      ])
        .then(response => {
          callDBRefByActvity(response.id.split('-')[0]);
        })
        .catch(error => {
          console.error(error);
        });
    }
  );
}

module.exports = {
  listAllReference,
  listReferenceByActvity,
  listReferenceByType,
};
