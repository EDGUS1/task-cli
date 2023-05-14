const inquirer = require('inquirer');

const {
  getAllActiveReferences,
  getReferenceById,
  updateReference,
  deleteReference,
} = require('./database/reference');
const { getAllActiveTypeReferences } = require('./database/typeReference');
const { log_error } = require('../utils/print');

async function updateReferencePrompt(database) {
  const data = await getAllActiveReferences(database);
  const options = [
    {
      type: 'list',
      name: 'ref',
      message: 'Seleccione la referencia',
      choices: data.map(e => e.reference_id + '. ' + e.url),
      default: 0,
    },
  ];

  return inquirer
    .prompt(options)
    .then(async res => {
      const id = res.ref.split('.')[0];

      const selected_ref = await getReferenceById(database, id);
      const data_type = await getAllActiveTypeReferences(database);

      const update_options = [
        {
          type: 'input',
          name: 'url',
          message: 'Ingrese nueva url',
          default: selected_ref.url,
        },
        {
          type: 'input',
          name: 'description',
          message: 'Ingrese nueva descripcion',
          default: selected_ref.description,
        },
        {
          type: 'input',
          name: 'minute',
          message: 'Ingrese minuto pendiente',
          default: selected_ref.minute,
        },
        {
          type: 'input',
          name: 'completed',
          message: 'Actualizar estado',
          default: selected_ref.completed,
        },
        {
          type: 'list',
          name: 'type',
          message: 'Seleccione el nuevo tipo',
          choices: data_type.map(e => e.type_reference_id + '. ' + e.name),
          default: selected_ref.type_reference_id - 1,
        },
      ];
      return inquirer
        .prompt(update_options)
        .then(async response => {
          await updateReference(
            database,
            response.description,
            response.type.split('.')[0],
            response.url,
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

async function deleteReferencePrompt(database) {
  const data = await getAllActiveReferences(database);

  const options = [
    {
      type: 'list',
      name: 'ref',
      message: 'Seleccione la referencia para eliminar',
      choices: data.map(e => e.reference_id + '. ' + e.url),
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
      if (res.delete) deleteReference(database, res.ref.split('.')[0]);
      return res;
    })
    .catch(err => {
      log_error(err.message);
      return err;
    });
}

module.exports = { updateReferencePrompt, deleteReferencePrompt };
