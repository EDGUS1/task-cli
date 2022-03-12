const { program } = require('commander');
const { prompt } = require('inquirer');
let fs = require('fs');
const db = require('./db');
const {
  listarActividades,
  agregarActividad,
  gestionarActividades,
  listarActividadesDiarias,
  saveLink,
  completeActividad,
  updateActividad,
} = require('./options');

program
  .name('Task Cli')
  .description('Ordenar actvidades pendientes')
  .version('1.0')
  .option('-l, --list', 'Listar Actividades')
  .option('-ld, --listd', 'Listar Actividades Diarias')
  .option('-lk, --link-type <type>', 'Guardar link')
  .option('-s, --save', 'Agregar Actividad')
  .option('-u, --update', 'Actualizar estado de actividad diaria');

program.command('act');

program
  .command('config')
  .description('Se configura la base de datos')
  .action(async () => {
    fs.readFile('./src/schema.sqlite3', 'utf-8', (err, data) => {
      if (err) {
        console.log('error: ', err);
      } else {
        data
          .split(';')
          .map(e => e.replace(/\n|\r/g, ''))
          .forEach(e => db.run(e));

        db.close(err => {
          if (err) return console.error(err.message);
        });
      }
    });
  });

program
  .command('interface')
  .description('Se muestra las opciones')
  .action(async () => {
    await prompt({
      type: 'list',
      name: 'opcion',
      message: 'Opciones',
      choices: [
        'Listar actvividades diarias',
        'Agregar actividad',
        'Listar todas las actvidades',
        'Gestionar actividades',
        'Agregar Link',
        'Marcar completado',
        'Salir',
      ],
    })
      .then(ans => {
        if (ans.opcion == 'Agregar actividad') {
          agregarActividad();
        } else if (ans.opcion == 'Listar todas las actvidades') {
          listarActividades();
        } else if (ans.opcion == 'Listar actvividades diarias') {
          listarActividadesDiarias();
        } else if (ans.opcion == 'Gestionar actividades') {
          gestionarActividades();
        } else if (ans.opcion == 'Agregar Link') {
          saveLink(null, false);
        } else if (ans.opcion == 'Marcar completado') {
          completeActividad();
        }
      })
      .catch(error => {
        console.error('Menu principal');
        console.error(error);
      });
  });

program.parse(process.argv);
const options = program.opts();
if (options.list) listarActividades();
if (options.listd) listarActividadesDiarias();
if (options.linkType) saveLink(options.linkType, true);
if (options.save) agregarActividad();
if (options.update) updateActividad();
