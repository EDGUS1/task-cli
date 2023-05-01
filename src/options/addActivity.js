const { prompt } = require('inquirer');
const db = require('../config/db');

async function addActivity() {
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
      choices: ['Default', 'Diario'],
      default: 0,
    },
  ])
    .then(response => {
      const stmt = db.prepare(
        'INSERT INTO activity (name, description, type_priority_id) VALUES (?,?,?)'
      );
      stmt.run(
        response.nombre,
        response.desc,
        response.prioridad == 'Default' ? 1 : 2
      );
      stmt.finalize();
      db.close();
    })
    .catch(error => {
      console.error('Guardar nueva actividad');
      console.error(error);
    });
}

module.exports = { addActivity };
