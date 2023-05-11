const sqlite3 = require('sqlite3').verbose();

const { configdb } = require('../commands/config');
const { getAllBitacora } = require('../options/database/bitacora');

describe('Table bitacora', () => {
  const db_test = new sqlite3.Database(':memory:');

  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  });

  test('Select all rows in reference_activity after create tables', async () => {
    const data = await getAllBitacora(db_test);
    expect(data.length).toBe(0);
  });

  afterAll(() => {
    db_test.close();
  });
});
