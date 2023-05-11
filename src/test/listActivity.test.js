const sqlite3 = require('sqlite3').verbose();

const { configdb } = require('../commands/config');
const { insertActivity } = require('../options/database/activity');
const {
  listActivities,
  listActivitiesByDay,
} = require('../options/listActivity');

describe('List activities prompt', () => {
  const db_test = new sqlite3.Database(':memory:');

  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  });

  test('Select all active activities', async () => {
    const data = await listActivities(db_test);
    expect(data.length).toBe(0);
  });

  test('Select all active daily activities', async () => {
    const data = await listActivitiesByDay(db_test);
    expect(data.length).toBe(0);
  });

  test('Select all active activities after insert one', async () => {
    await insertActivity(db_test, 'Test', 'Test descripcion', 1);
    const data = await listActivities(db_test);
    expect(data.length).toBe(1);
  });

  afterAll(() => {
    db_test.close();
  });
});
