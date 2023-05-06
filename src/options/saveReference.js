const { prompt } = require('inquirer');
const db = require('../config/db');

function saveReferenceActiv(reference, desc) {
  db.all(
    'SELECT activity_id, name FROM activity WHERE active = 1',
    async (err, rows_act) => {
      db.all(
        'SELECT * FROM type_reference WHERE active = 1',
        async (err, rows_type_ref) => {
          const options = desc
            ? [
                {
                  type: 'list',
                  name: 'reference',
                  message: 'Seleccione la actividad',
                  choices: rows_act.map(e => e.activity_id + '-' + e.name),
                  default: 0,
                },
              ]
            : [
                {
                  type: 'input',
                  name: 'url',
                  message: 'Ingrese url del recurso',
                },
                {
                  type: 'list',
                  name: 'reference',
                  message: 'Seleccione la actividad',
                  choices: rows_act.map(e => e.activity_id + '-' + e.name),
                  default: 0,
                },
                {
                  type: 'input',
                  name: 'descripcion',
                  message: 'Ingrese descripcion',
                },
                {
                  type: 'list',
                  name: 'type_ref',
                  message: 'Seleccione el tipo de referencia',
                  choices: rows_type_ref.map(
                    e => e.type_reference_id + '-' + e.name
                  ),
                  default: 0,
                },
              ];

          await prompt(options).then(res => {
            const stmt_reference = db.prepare(
              'INSERT INTO reference (type_reference_id, description, url) VALUES (?, ?, ?)'
            );
            stmt_reference.run(
              res.type_ref.split('-')[0] || 1,
              res.descripcion || null,
              res.url || reference
            );
            stmt_reference.finalize();

            db.all(
              'SELECT MAX(reference_id) as id FROM reference',
              (err, rows) => {
                const stmt = db.prepare(
                  'INSERT INTO reference_activity (activity_id, reference_id) VALUES (?, ?)'
                );
                stmt.run(res.reference.split('-')[0], rows[0].id);
                stmt.finalize();
              }
            );
          });
        }
      );
    }
  );
}

async function saveReference(reference) {
  if (typeof reference == typeof '') {
    const stmt = db.prepare(
      'INSERT INTO reference (type_reference_id, url) VALUES (1, ?)'
    );
    stmt.run(reference);
    stmt.finalize();
  } else {
    db.all(
      'SELECT type_reference_id, name FROM type_reference WHERE active = 1 ORDER BY type_reference_id',
      async (err, rows) => {
        const options = [
          {
            type: 'input',
            name: 'url',
            message: 'Ingrese url del recurso',
          },
          {
            type: 'input',
            name: 'descripcion',
            message: 'Ingrese descripcion',
          },
          {
            type: 'list',
            name: 'id',
            message: 'Seleccione el tipo de referencia',
            choices: rows.map(e => e.type_reference_id + '-' + e.name),
            default: 0,
          },
        ];
        await prompt(options).then(res => {
          const stmt = db.prepare(
            'INSERT INTO reference (type_reference_id, description, url) VALUES (?, ?, ?)'
          );
          stmt.run(
            res.id.split('-')[0] || 1,
            res.descripcion || null,
            res.url || reference
          );
          stmt.finalize();
        });
      }
    );
  }
}

module.exports = { saveReference, saveReferenceActiv };
