const sqlite3 = require('sqlite3').verbose();

const { configdb } = require('../commands/config');
const {
  insertActivity,
  getLastIdInserted,
} = require('../options/database/activity');
const {
  getAllBitacora,
  insertBitacora,
} = require('../options/database/bitacora');

describe('Table bitacora', () => {
  const db_test = new sqlite3.Database(':memory:');

  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  });

  test('Select all rows after create tables', async () => {
    const data = await getAllBitacora(db_test);
    expect(data.length).toBe(0);
  });

  test('Insert value into bitacora', async () => {
    const name = 'Test';
    const description = 'Activity from test';
    const type = 2;

    await insertActivity(db_test, name, description, type);
    const { id: activity_id } = await getLastIdInserted(db_test);
    await insertBitacora(db_test, activity_id);

    const data = await getAllBitacora(db_test);

    expect(data).not.toBeNull();
    expect(data.length).toBe(1);
  });

  afterAll(() => {
    db_test.close();
  });
});
