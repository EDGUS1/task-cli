const inquirer = require('inquirer');

const { log_error, print_table } = require('../utils/print');
const {
  getAllActiveReferences,
  getAllActiveReferencesByType,
  getAllActiveReferencesByActivity,
} = require('./database/reference');
const { getAllActiveActivities } = require('./database/activity');
const { getAllActiveTypeReferences } = require('./database/typeReference');

async function listAllReference(database) {
  const data = await getAllActiveReferences(database);
  print_table(data);
  return data;
}

async function listReferenceByType(database) {
  const type_ref = await getAllActiveTypeReferences(database);

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Seleccione el tipo de referencia',
        choices: type_ref.map(t => t.type_reference_id + '. ' + t.name),
        default: 0,
      },
    ])
    .then(async response => {
      const id = response.id.split('.')[0];
      const data = await getAllActiveReferencesByType(database, id);
      print_table(data);
      return data;
    })
    .catch(error => {
      log_error(error.message);
      return error;
    });
}

async function listReferenceByActvity(database) {
  const data_activity = await getAllActiveActivities(database);
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Seleccione la actividad',
        choices: data_activity.map(d => d.activity_id + '. ' + d.name),
        default: 0,
      },
    ])
    .then(async res => {
      const id = res.id.split('.')[0];
      const data = await getAllActiveReferencesByActivity(database, id);
      print_table(data);
      return data;
    })
    .catch(error => {
      log_error(error.message);
      return error;
    });
}

module.exports = {
  listAllReference,
  listReferenceByActvity,
  listReferenceByType,
};
