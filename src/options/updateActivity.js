const { prompt } = require('inquirer');
const { log_warn } = require('../utils/print');
const { insertBitacora } = require('./database/bitacora');
const {
  getAllActiveIncompleteDailyActivities,
} = require('./database/activity');

async function completeActvDaily(database) {
  const data = await getAllActiveIncompleteDailyActivities(database);

  if (data && data.length > 0) {
    prompt([
      {
        type: 'checkbox',
        name: 'complete',
        message: 'Seleccione la(s) actividad(es)',
        choices: data.map(e => e.activity_id + '. ' + e.name),
        default: 0,
      },
    ])
      .then(async select => {
        if (select.complete?.length > 0) {
          select.complete.forEach(async element => {
            await insertBitacora(database, element.split('.')[0]);
          });
        }
      })
      .catch(error => log_error(error.message));
  } else {
    log_warn('Todas las actividades han sido completadas');
  }
}

module.exports = { completeActvDaily };
