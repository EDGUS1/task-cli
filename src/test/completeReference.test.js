const sqlite3 = require('sqlite3').verbose();
const inquirer = require('inquirer');

const { configdb } = require('../commands/config');
const {
  markAsCompleteReferenceByActivity,
} = require('../options/completeReference');
const {
  insertActivity,
  getLastIdInserted,
} = require('../options/database/activity');
const {
  insertActivityReference,
} = require('../options/database/referenceActivity');
const {
  insertReference,
  getLastIdReference,
  getReferenceById,
} = require('../options/database/reference');

jest.mock('inquirer');

describe('Complete reference prompt', () => {
  const db_test = new sqlite3.Database(':memory:');

  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  });

  test('Mark completed', async () => {
    const name = 'Test';
    const description = 'Activity from test';
    const type = 1;
    const url = 'http://';

    await insertActivity(db_test, name, description, type);
    const activity_inserted = await getLastIdInserted(db_test);

    await insertReference(db_test, type, description, url);
    const reference_inserted = await getLastIdReference(db_test);

    await insertActivityReference(
      db_test,
      activity_inserted.id,
      reference_inserted.id
    );

    const mock_obj = {
      id: `${activity_inserted.id}. ${name}`,
      complete: [`${reference_inserted.id}. ${url}`],
    };

    inquirer.prompt = jest.fn().mockResolvedValue(mock_obj);
    await expect(markAsCompleteReferenceByActivity(db_test)).resolves.toEqual(
      mock_obj
    );

    const data = await getReferenceById(db_test, reference_inserted.id);
    expect(data.url).toBe(url);
    expect(data.description).toBe(description);
    expect(data.type_reference_id).toBe(type);
    expect(data.active).toBe(1);
    expect(data.completed).toBe(1);
    expect(data.completed_at).not.toBeNull();
    expect(data.updated_at).not.toBeNull();
  });

  afterAll(() => {
    db_test.close();
  });
});
