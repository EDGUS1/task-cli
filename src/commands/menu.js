const { prompt } = require('inquirer');

const { addActivity } = require('../options/addActivity');
const {
  listActivities,
  listActivitiesByDay,
} = require('../options/listActivity');
const { completeActivity } = require('../options/completeActivity');
const {
  manageActivity,
  updateActivity,
  deleteActivity,
} = require('../options/manageActivity');
const { saveReference } = require('../options/saveReference');

const menu = async () => {
  await prompt({
    type: 'list',
    name: 'opcion',
    message: 'Opciones',
    choices: [
      'Listar actvividades diarias',
      'Agregar actividad',
      'Listar todas las actvidades',
      'Gestionar actividades',
      'Agregar referencia(url)',
      'Marcar actividad completada',
      'Actualizar actividad',
      'Eliminar actividad',
      'Salir',
    ],
  })
    .then(ans => {
      if (ans.opcion == 'Agregar actividad') {
        addActivity();
      } else if (ans.opcion == 'Listar todas las actvidades') {
        listActivities();
      } else if (ans.opcion == 'Listar actvividades diarias') {
        listActivitiesByDay();
      } else if (ans.opcion == 'Gestionar actividades') {
        manageActivity();
      } else if (ans.opcion == 'Agregar referencia(url)') {
        saveReference(null, false);
      } else if (ans.opcion == 'Marcar actividad completada') {
        completeActivity();
      } else if (ans.opcion == 'Actualizar actividad') {
        updateActivity();
      } else if (ans.opcion == 'Eliminar actividad') {
        deleteActivity();
      }
    })
    .catch(error => {
      console.error('Menu principal');
      console.error(error);
    });
};

module.exports = { menu };
