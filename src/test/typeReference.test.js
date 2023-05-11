const sqlite3 = require('sqlite3').verbose();

const { configdb } = require('../commands/config');
const {
  getAllTypeReferences,
  getAllActiveTypeReferences,
} = require('../options/database/typeReference');

describe.skip('Table type_reference', () => {
  const db_test = new sqlite3.Database(':memory:');

  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  });

  test('Select all type of references after create tables', async () => {
    const data = await getAllTypeReferences(db_test);
    // En el script inicial se insertan por defecto
    expect(data.length).toBe(4);
  });

  test('Select all active type of references', async () => {
    const data = await getAllActiveTypeReferences(db_test);
    // En el script inicial se insertan por defecto
    expect(data.length).toBe(4);
  });

  afterAll(() => {
    db_test.close();
  });
});
