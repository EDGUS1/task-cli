const inquirer = require('inquirer');

const { insertActivity } = require('./database/activity');
const { log_error } = require('../utils/print');

function addActivity(database) {
  const options = [
    {
      type: 'input',
      name: 'name',
      message: 'Nombre de la actividad',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Descripción de la actividad',
    },
    {
      type: 'list',
      name: 'priority',
      message: 'Prioridad de la actividad',
      choices: ['Default', 'Diario'],
      default: 0,
    },
  ];
  return inquirer
    .prompt(options)
    .then(async response => {
      const priority = response.priority == 'Default' ? 1 : 2;
      await insertActivity(
        database,
        response.name,
        response.description,
        priority
      );
      return response;
    })
    .catch(err => {
      log_error(err.message);
      return err;
    });
}

module.exports = { addActivity };
