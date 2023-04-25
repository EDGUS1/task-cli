const { prompt } = require('inquirer');
const { addActivity } = require('../options/addActivity');
const {
  listActivities,
  listActivitiesByDay,
} = require('../options/listActivity');
const { saveLink } = require('../options/saveLink');
const { completeActivity } = require('../options/completeActivity');
const { manageActivity } = require('../options/manageActivity');

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
      'Agregar Link',
      'Marcar completado',
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
      } else if (ans.opcion == 'Agregar Link') {
        saveLink(null, false);
      } else if (ans.opcion == 'Marcar completado') {
        completeActivity();
      }
    })
    .catch(error => {
      console.error('Menu principal');
      console.error(error);
    });
};

module.exports = { menu };
