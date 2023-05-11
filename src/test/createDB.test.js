const { configdb } = require('../commands/config');
const createDB = require('../config/createDB');
const { getAllActivities } = require('../options/database/activity');
const { getAllBitacora } = require('../options/database/bitacora');
const { getAllReferences } = require('../options/database/reference');
const {
  getAllReferencesActivity,
} = require('../options/database/referenceActivity');
const { getAllTypePriority } = require('../options/database/typePriority');
const { getAllTypeReferences } = require('../options/database/typeReference');

describe('Table activity', () => {
  const db_test = createDB('test.db');

  beforeAll(async () => {
    const msg = 'Objetos creados correctamente';
    await expect(configdb(db_test)).resolves.toEqual(msg);
  }, 5000 * 3);

  test('Validate if exists activity table', async () => {
    await expect(getAllActivities(db_test)).resolves.toEqual([]);
  });

  test('Validate if exists reference table', async () => {
    await expect(getAllReferences(db_test)).resolves.toEqual([]);
  });

  test('Validate if exists type_priority table', async () => {
    const data = await getAllTypePriority(db_test);
    // Datos agregados en el script incial
    expect(data.length).toBe(2);
  });

  test('Validate if exists type_reference table', async () => {
    const data = await getAllTypeReferences(db_test);
    // Datos agregados en el script incial
    expect(data.length).toBe(4);
  });

  test('Validate if exists bitacora table', async () => {
    await expect(getAllBitacora(db_test)).resolves.toEqual([]);
  });

  test('Validate if exists reference_activity table', async () => {
    await expect(getAllReferencesActivity(db_test)).resolves.toEqual([]);
  });

  afterAll(() => {
    db_test.close();
  });
});
