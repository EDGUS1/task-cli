const { prompt } = require('inquirer');
const { insertReference, getLastIdReference } = require('./database/reference');
const { getAllActiveTypeReferences } = require('./database/typeReference');
const { getAllActiveActivities } = require('./database/activity');
const { insertActivityReference } = require('./database/referenceActivity');

async function saveReferenceActiv(database, reference, shortcut) {
  const data_activity = await getAllActiveActivities(database);
  const data_type_ref = await getAllActiveTypeReferences(database);

  const options = shortcut
    ? [
        {
          type: 'list',
          name: 'activity',
          message: 'Seleccione la actividad',
          choices: data_activity.map(e => e.activity_id + '. ' + e.name),
          default: 0,
        },
      ]
    : [
        {
          type: 'input',
          name: 'url',
          message: 'Ingrese url del recurso',
        },
        {
          type: 'list',
          name: 'activity',
          message: 'Seleccione la actividad',
          choices: data_activity.map(e => e.activity_id + '. ' + e.name),
          default: 0,
        },
        {
          type: 'input',
          name: 'description',
          message: 'Ingrese descripcion',
        },
        {
          type: 'list',
          name: 'type_ref',
          message: 'Seleccione el tipo de referencia',
          choices: data_type_ref.map(e => e.type_reference_id + '. ' + e.name),
          default: 0,
        },
      ];

  prompt(options)
    .then(async res => {
      const type = shortcut ? 1 : res.type_ref.split('.')[0];
      const activity_id = res.activity.split('.')[0];
      const description = shortcut ? null : res.description;
      const url = shortcut ? reference : res.url;

      await insertReference(database, type, description, url);

      const max_id = await getLastIdReference(database);

      await insertActivityReference(database, activity_id, max_id);
    })
    .catch(error => {
      log_error(error.message);
    });
}

async function saveReference(database, reference) {
  if (typeof reference == typeof '') {
    await insertReference(database, 1, '', reference);
  } else {
    const data = await getAllActiveTypeReferences(database);
    const options = [
      {
        type: 'input',
        name: 'url',
        message: 'Ingrese url del recurso',
      },
      {
        type: 'input',
        name: 'descripcion',
        message: 'Ingrese descripcion',
      },
      {
        type: 'list',
        name: 'id',
        message: 'Seleccione el tipo de referencia',
        choices: data.map(e => e.type_reference_id + '. ' + e.name),
        default: 0,
      },
    ];
    prompt(options)
      .then(async res => {
        const type = res.id.split('.')[0];
        await insertReference(database, type, res.descripcion, res.url);
      })
      .catch(error => {
        log_error(error.message);
      });
  }
}

module.exports = { saveReference, saveReferenceActiv };
