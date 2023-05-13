const { prompt } = require('inquirer');

const { addActivity } = require('../options/addActivity');
const {
  listActivities,
  listActivitiesByDay,
} = require('../options/listActivity');
const {
  updateActivityPrompt,
  deleteActivityPrompt,
} = require('../options/manageActivity');
const {
  markAsCompleteReferenceByActivity,
} = require('../options/completeReference');
const { saveReference } = require('../options/saveReference');

const { log_error } = require('../utils/print');

const menu = async database => {
  await prompt({
    type: 'list',
    name: 'opcion',
    message: 'Opciones',
    choices: [
      'Listar actvividades diarias',
      'Agregar actividad',
      'Listar todas las actvidades',
      'Agregar referencia (url)',
      'Marcar referencia completada',
      'Actualizar actividad',
      'Eliminar actividad',
      'Salir',
    ],
  })
    .then(ans => {
      if (ans.opcion == 'Agregar actividad') {
        addActivity(database);
      } else if (ans.opcion == 'Listar todas las actvidades') {
        listActivities(database);
      } else if (ans.opcion == 'Listar actvividades diarias') {
        listActivitiesByDay(database);
      } else if (ans.opcion == 'Agregar referencia (url)') {
        saveReference(database, false);
      } else if (ans.opcion == 'Marcar referencia completada') {
        markAsCompleteReferenceByActivity(database);
      } else if (ans.opcion == 'Actualizar actividad') {
        updateActivityPrompt(database);
      } else if (ans.opcion == 'Eliminar actividad') {
        deleteActivityPrompt(database);
      }
    })
    .catch(error => log_error(error.message));
};

module.exports = { menu };
