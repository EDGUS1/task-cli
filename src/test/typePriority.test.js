const sqlite3 = require('sqlite3').verbose();

const { configdb } = require('../commands/config');
const {
  getAllTypePriority,
  getAllActiveTypePriority,
} = require('../options/database/typePriority');

describe('Table type_priority', () => {
  const db_test = new sqlite3.Database(':memory:');

  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  });

  test('Select all type of priority after create tables', async () => {
    const data = await getAllTypePriority(db_test);
    // En el script inicial se insertan por defecto
    expect(data.length).toBe(2);
  });

  test('Select all active type of priority', async () => {
    const data = await getAllActiveTypePriority(db_test);
    // En el script inicial se insertan por defecto
    expect(data.length).toBe(2);
  });

  afterAll(() => {
    db_test.close();
  });
});
