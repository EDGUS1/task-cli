const { program } = require('commander');

const {
  listActivities,
  listActivitiesByDay,
} = require('./options/listActivity');
const { saveLink } = require('./options/saveLink');
const { addActivity } = require('./options/addActivity');
const { updateActivity } = require('./options/updateActivity');
const { configdb } = require('./commands/config');
const { menu } = require('./commands/interface');

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
  .action(configdb);

program
  .command('interface')
  .description('Se muestra las opciones')
  .action(menu);

program.parse(process.argv);
const options = program.opts();
if (options.list) listActivities();
if (options.listd) listActivitiesByDay();
if (options.linkType) saveLink(options.linkType, true);
if (options.save) addActivity();
if (options.update) updateActivity();
