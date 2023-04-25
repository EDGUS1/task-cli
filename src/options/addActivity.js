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
      console.error('Guardar nueva actividad');
      console.error(error);
    });
}

module.exports = { addActivity };
