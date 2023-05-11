const sqlite3 = require('sqlite3').verbose();
const inquirer = require('inquirer');
const {
  listAllReference,
  listReferenceByType,
  listReferenceByActvity,
} = require('../options/listReference');
const { configdb } = require('../commands/config');
const { insertActivity } = require('../options/database/activity');
const {
  insertActivityReference,
} = require('../options/database/referenceActivity');
const { insertReference } = require('../options/database/reference');

describe('List references', () => {
  const db_test = new sqlite3.Database(':memory:');
  let backup;

  beforeAll(async () => {
    backup = inquirer.prompt;
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  });

  test('List all references prompt', async () => {
    const data = await listAllReference(db_test);
    expect(data.length).toBe(0);
  });

  test('List reference by type prompt', async () => {
    inquirer.prompt = questions => Promise.resolve({ id: '1. Default' });
    return listReferenceByType(db_test).then(answers => {
      expect(answers).toEqual([]);
    });
  });

  test('List reference by activity prompt', async () => {
    const name = 'Test';
    const description = 'Test description';
    const type = 1;

    inquirer.prompt = questions => Promise.resolve({ id: `1. ${name}` });

    await insertActivity(db_test, name, description, type);

    return listReferenceByActvity(db_test).then(answers => {
      expect(answers).toEqual([]);
    });
  });

  test('List reference by activity with inserted reference prompt', async () => {
    const name = 'Test';
    const description = 'Test description';
    const type = 1;
    const url = 'http://';

    inquirer.prompt = questions => Promise.resolve({ id: `1. ${name}` });

    await insertActivity(db_test, name, description, type);
    await insertReference(db_test, 1, description, url);
    await insertActivityReference(db_test, 1, 1);

    return listReferenceByActvity(db_test).then(answers => {
      expect(answers[0].url).toBe(url);
      expect(answers[0].description).toBe(description);
      expect(answers[0].name).toBe('Default');
    });
  });

  afterAll(() => {
    inquirer.prompt = backup;
    db_test.close();
  });
});
