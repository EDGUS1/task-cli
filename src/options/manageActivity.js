const { prompt } = require('inquirer');
const db = require('../config/db');

function updateActivity() {
  db.all(
    'SELECT activity_id, name FROM activity WHERE active = 1 ORDER BY activity_id',
    (error, rows) => {
      const options = [
        {
          type: 'list',
          name: 'actv',
          message: 'Seleccione la actividad',
          choices: rows.map(e => e.activity_id + '. ' + e.name),
          default: 0,
        },
      ];
      prompt(options)
        .then(res => {
          const id = res.actv.split('.')[0];
          db.get(
            'SELECT type_priority_id, name, description FROM activity WHERE active = 1 AND activity_id = ?',
            [id],
            (err, row) => {
              db.all('SELECT * FROM type_priority WHERE active = 1', (e, x) => {
                const update_options = [
                  {
                    type: 'input',
                    name: 'name',
                    message: 'Ingrese nuevo nombre',
                    default: row.name,
                  },
                  {
                    type: 'input',
                    name: 'description',
                    message: 'Ingrese nueva descripcion',
                    default: row.description,
                  },
                  {
                    type: 'list',
                    name: 'type',
                    message: 'Seleccione el nuevo tipo',
                    choices: x.map(e => e.type_priority_id + '. ' + e.name),
                    default: row.type_priority_id - 1,
                  },
                ];
                prompt(update_options)
                  .then(response => {
                    db.run(
                      `UPDATE activity SET name = ?, description = ?, updated_at = datetime('now','localtime'), type_priority_id = ? WHERE activity_id = ?`,
                      [
                        response.name,
                        response.description,
                        response.type.split('.')[0],
                        id,
                      ],
                      function (err) {
                        if (err) {
                          return console.error(err.message);
                        }
                      }
                    );
                    db.close();
                  })
                  .catch(err => console.log(err));
              });
            }
          );
        })
        .catch(error => {
          console.log(error);
        });
    }
  );
}

function deleteActivity() {
  db.all(
    'SELECT activity_id, name FROM activity WHERE active = 1',
    (error, rows) => {
      console.log(rows);
      const options = [
        {
          type: 'list',
          name: 'actv',
          message: 'Seleccione la actividad para eliminar',
          choices: rows.map(e => e.activity_id + '. ' + e.name),
          default: 0,
        },
        {
          type: 'confirm',
          name: 'delete',
          message: '¿Seguro que desear eliminar?',
          default: true,
        },
      ];
      prompt(options).then(res => {
        if (res.delete)
          db.run(
            `UPDATE activity SET active = ?, updated_at = datetime('now','localtime') WHERE activity_id = ?`,
            [0, res.actv.split('.')[0]],
            function (err) {
              if (err) {
                return console.error(err.message);
              }
            }
          );
      });
    }
  );
}

module.exports = { updateActivity, deleteActivity };
