const inquirer = require('inquirer');

const { getAllActiveActivities } = require('./database/activity');
const { markReferenceAsComplete } = require('./database/reference');
const { log_error } = require('../utils/print');
const {
  getAllActiveIncompleteReferencesByActivity,
} = require('./database/referenceActivity');

async function markAsCompleteReferenceByActivity(database) {
  const data = await getAllActiveActivities(database);
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Seleccione la actividad',
        choices: data.map(e => e.activity_id + '. ' + e.name),
        default: 0,
      },
    ])
    .then(async res => {
      const id = res.id.split('.')[0];
      console.log(id);
      const data_reference = await getAllActiveIncompleteReferencesByActivity(
        database,
        id
      );
      console.log(data_reference);
      if (data_reference && data_reference.length > 0)
        inquirer
          .prompt([
            {
              type: 'checkbox',
              name: 'complete',
              message: 'Seleccione las referencias',
              choices: data_reference.map(e => e.reference_id + '. ' + e.url),
              default: 0,
            },
          ])
          .then(select => {
            if (select.complete?.length > 0) {
              select.complete.forEach(element => {
                markReferenceAsComplete(database, element.split('.')[0]);
              });
            }
          })
          .catch(error => log_error(error.message));
    })
    .catch(error => log_error(error.message));
}

module.exports = { markAsCompleteReferenceByActivity };
