const sqlite3 = require('sqlite3').verbose();

const { configdb } = require('../commands/config');
const {
  insertActivity,
  getLastIdInserted,
} = require('../options/database/activity');
const {
  getLastIdReference,
  insertReference,
} = require('../options/database/reference');
const {
  getAllReferencesActivity,
  getLastIdInserted: getLastIdInsertedRefActv,
  insertActivityReference,
  getAllActiveIncompleteReferencesByActivity,
  getReferenceActivityById,
} = require('../options/database/referenceActivity');

describe('Table reference_activity', () => {
  const db_test = new sqlite3.Database(':memory:');

  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  });

  test('Select all rows in reference_activity after create tables', async () => {
    const data = await getAllReferencesActivity(db_test);
    expect(data.length).toBe(0);
  });

  test('Insert value in reference_activity', async () => {
    const actv_name = 'Test';
    const actv_description = 'Activity from test';
    const actv_type = 2;

    const reference = 'http://...';
    const ref_description = 'Test reference';
    const ref_type = 2;

    await insertActivity(db_test, actv_name, actv_description, actv_type);
    await insertReference(db_test, ref_type, ref_description, reference);

    const { id: actv_id } = await getLastIdInserted(db_test);
    const { id: ref_id } = await getLastIdReference(db_test);

    await insertActivityReference(db_test, actv_id, ref_id);
    const data = await getAllReferencesActivity(db_test);

    expect(data).not.toBeNull();
    expect(data.length).toBe(1);
  });

  test('Select incomplete references by activity', async () => {
    const data = await getAllActiveIncompleteReferencesByActivity(db_test, 1);
    expect(data).not.toBeNull();
    expect(data.length).toBe(1);
  });

  test('Get last inserted id', async () => {
    const actv_name = 'Test';
    const actv_description = 'Activity from test';
    const actv_type = 2;

    const reference = 'http://...';
    const ref_description = 'Test reference';
    const ref_type = 2;

    await insertActivity(db_test, actv_name, actv_description, actv_type);
    await insertReference(db_test, ref_type, ref_description, reference);

    const { id: actv_id } = await getLastIdInserted(db_test);
    const { id: ref_id } = await getLastIdReference(db_test);

    const { id: before_inserted_id } = await getLastIdInsertedRefActv(db_test);
    await insertActivityReference(db_test, actv_id, ref_id);
    const { id } = await getLastIdInsertedRefActv(db_test);

    expect(id).toBe(before_inserted_id + 1);
  });

  test('Select values by id', async () => {
    const actv_name = 'Test';
    const actv_description = 'Activity from test';
    const actv_type = 2;

    const reference = 'http://...';
    const ref_description = 'Test reference';
    const ref_type = 2;

    await insertActivity(db_test, actv_name, actv_description, actv_type);
    await insertReference(db_test, ref_type, ref_description, reference);

    const { id: actv_id } = await getLastIdInserted(db_test);
    const { id: ref_id } = await getLastIdReference(db_test);

    await insertActivityReference(db_test, actv_id, ref_id);
    const { id } = await getLastIdInsertedRefActv(db_test);

    const data = await getReferenceActivityById(db_test, id);

    expect(data).not.toBeNull();
    expect(data.reference_id).toBe(ref_id);
    expect(data.activity_id).toBe(actv_id);
    expect(data.active).toBe(1);
    expect(data.created_at).not.toBeNull();
    expect(data.updated_at).toBeNull();
  });

  afterAll(() => {
    db_test.close();
  });
});
