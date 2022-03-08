const { program } = require('commander');
const { prompt } = require('inquirer');
let fs = require('fs');
const db = require('./db');

program
  .name('Task Cli')
  .description('Ordenar actvidades pendientes')
  .version('1.0');

program.command('config').action(async () => {
  fs.readFile('./src/schema.sqlite3', 'utf-8', (err, data) => {
    if (err) {
      console.log('error: ', err);
    } else {
      data.split(';').forEach(e => db.run(e));

      db.close(err => {
        if (err) return console.error(err.message);
      });
    }
  });
});

program.command('interface').action(async () => {
  await prompt([
    {
      type: 'list',
      name: 'opcion',
      message: 'Opciones',
      choices: [
        'Listar diario',
        'Agregar actividad',
        'Listar Actvidades',
        'Listar todos los elementos',
      ],
    },
  ])
    .then(async ans => {
      if (ans.opcion == 'Agregar actividad') {
        await prompt([
          {
            type: 'input',
            name: 'nombre',
            message: 'Nombre de la actividad',
          },
          {
            type: 'input',
            name: 'desc',
            message: 'Descripción de la actividad',
          },
          {
            type: 'list',
            name: 'prioridad',
            message: 'Prioridad de la actividad',
            choices: ['Diario', 'Default'],
            default: 1,
          },
        ])
          .then(response => {
            const stmt = db.prepare(
              "INSERT INTO actividad (nombre, descripcion, tipo_prioridad_id, fecha_creacion) VALUES (?,?,?,datetime('now','localtime'))"
            );
            stmt.run(
              response.nombre,
              response.desc,
              response.prioridad == 'Default' ? 1 : 0
            );
            stmt.finalize();
          })
          .catch(error => {
            console.log('Guardar nueva actividad');
            console.log(error);
          });
      } else if (ans.opcion == 'Listar Actvidades') {
        db.each('SELECT * FROM actividad', function (err, row) {
          console.log(row);
        });
      } else if (ans.opcion == 'Listar diario') {
        db.each(
          'SELECT * FROM actividad where tipo_prioridad_id = 0',
          function (err, row) {
            console.log(row);
          }
        );
      } else if (ans.opcion == 'Listar todos los elementos') {
        db.each('SELECT * FROM elemento', function (err, row) {
          console.log(row);
        });
      }
    })
    .catch(error => {
      console.log('Menu principal');
      console.log(error);
    });
});

program.parse(process.argv);
