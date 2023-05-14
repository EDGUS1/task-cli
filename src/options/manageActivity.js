const inquirer = require('inquirer');

const {
  getAllActiveActivities,
  updateActivity,
  getActiveActivityById,
  deleteActivity,
} = require('./database/activity');
const { getAllActiveTypePriority } = require('./database/typePriority');
const { log_error } = require('../utils/print');

async function updateActivityPrompt(database) {
  const data = await getAllActiveActivities(database);

  const options = [
    {
      type: 'list',
      name: 'actv',
      message: 'Seleccione la actividad',
      choices: data.map(e => e.activity_id + '. ' + e.name),
      default: 0,
    },
  ];

  return inquirer
    .prompt(options)
    .then(async res => {
      const id = res.actv.split('.')[0];
      const data_activity = await getActiveActivityById(database, id);
      const data_type = await getAllActiveTypePriority(database);

      const update_options = [
        {
          type: 'input',
          name: 'name',
          message: 'Ingrese nuevo nombre',
          default: data_activity.name,
        },
        {
          type: 'input',
          name: 'description',
          message: 'Ingrese nueva descripcion',
          default: data_activity.description,
        },
        {
          type: 'list',
          name: 'type',
          message: 'Seleccione el nuevo tipo',
          choices: data_type.map(e => e.type_priority_id + '. ' + e.name),
          default: data_activity.type_priority_id - 1,
        },
      ];

      return inquirer
        .prompt(update_options)
        .then(async response => {
          await updateActivity(
            database,
            response.name,
            response.description,
            response.type.split('.')[0],
            id
          );
          return response;
        })
        .catch(err => {
          log_error(err.message);
          return err;
        });
    })
    .catch(err => {
      log_error(err.message);
      return err;
    });
}

async function deleteActivityPrompt(database) {
  const data = await getAllActiveActivities(database);

  const options = [
    {
      type: 'list',
      name: 'actv',
      message: 'Seleccione la actividad para eliminar',
      choices: data.map(e => e.activity_id + '. ' + e.name),
      default: 0,
    },
    {
      type: 'confirm',
      name: 'delete',
      message: '¿Seguro que desear eliminar?',
      default: true,
    },
  ];

  return inquirer
    .prompt(options)
    .then(res => {
      if (res.delete) deleteActivity(database, res.actv.split('.')[0]);
      return res;
    })
    .catch(err => {
      log_error(err.message);
      return err;
    });
}

module.exports = { updateActivityPrompt, deleteActivityPrompt };
