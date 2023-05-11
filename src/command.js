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
const { db } = require('./config/db');
const { log_info } = require('./utils/print');

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
    if (options.listAll) listActivities(db);
    else if (options.listDaily) listActivitiesByDay(db);
    else if (options.add)
      saveReferenceActiv(db, options.add, options.add !== true);
    else if (options.save) addActivity(db);
    else if (options.update) completeActvDaily(db);
  });

program
  .command('ref')
  .description('Opciones basicas para las referencias')
  .option('-a, --add [url]', 'Guardar referencia [url]')
  .option('-l, --list-ref', 'Listar todas las referencias')
  .option('-la, --list-ref-act', 'Listar referencias por actividad')
  .option('-lt, --list-ref-type', 'Listar referencias por tipo')
  .action(options => {
    if (options.add) saveReference(db, options.add);
    else if (options.listRef) listAllReference(db);
    else if (options.listRefAct) listReferenceByActvity(db);
    else if (options.listRefType) listReferenceByType(db);
  });

program
  .command('config')
  .description('Se configura la base de datos')
  .action(() => configdb(db).then(res => log_info(res)));

program
  .command('menu')
  .description('Se muestra toas las opciones disponibles')
  .action(() => menu(db));

program.parse(process.argv);
