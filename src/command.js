const { program } = require('commander');

const {
  listActivities,
  listActivitiesByDay,
} = require('./options/listActivity');
const { addActivity } = require('./options/addActivity');
const { completeActvDaily } = require('./options/updateActivity');
const {
  saveReference,
  saveReferenceActiv,
} = require('./options/saveReference');
const {
  listAllReference,
  listReferenceByActvity,
  listReferenceByType,
} = require('./options/listReference');

const { configdb } = require('./commands/config');
const { menu } = require('./commands/menu');

program
  .name('Task Cli')
  .description('Gestor de actividades/tareas/referencias')
  .version('1.1');

program
  .command('task')
  .description('Opciones basicas para las actividaes/tareas')
  .option('-la, --list-all', 'Listar todas las actividades')
  .option('-ld, --list-daily', 'Listar actividades diarias')
  .option(
    '-a, --add [url]',
    'Agregar referencia a una actividad existente [url]'
  )
  .option('-s, --save', 'Agregar actividad')
  .option('-u, --update', 'Marcar como completado la actividad diaria')
  .action(options => {
    if (options.listAll) listActivities();
    else if (options.listDaily) listActivitiesByDay();
    else if (options.add) saveReferenceActiv(options.add, options.add === true);
    else if (options.save) addActivity();
    else if (options.update) completeActvDaily();
  });

program
  .command('ref')
  .description('Opciones basicas para las referencias')
  .option('-a, --add [url]', 'Guardar referencia [url]')
  .option('-l, --list-ref', 'Listar todas las referencias')
  .option('-la, --list-ref-act', 'Listar referencias por actividad')
  .option('-lt, --list-ref-type', 'Listar referencias por tipo')
  .action(options => {
    if (options.add) saveReference(options.add);
    else if (options.listRef) listAllReference();
    else if (options.listRefAct) listReferenceByActvity();
    else if (options.listRefType) listReferenceByType(2);
  });

program
  .command('config')
  .description('Se configura la base de datos')
  .action(configdb);

program
  .command('menu')
  .description('Se muestra toas las opciones disponibles')
  .action(menu);

program.parse(process.argv);
