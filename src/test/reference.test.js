const { configdb } = require('../commands/config');
const create_db = require('../config/create_db');
const {
  getAllReferences,
  insertReference,
  updateReference,
  getReferenceById,
  deleteReference,
  getAllActiveReferences,
  getAllActiveReferencesByType,
  getAllActiveReferencesByActivity,
} = require('../options/database/reference');

describe('Table reference', () => {
  const db_test = create_db('reference.db');
  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  }, 5000 * 4);

  test('Select all references after create tables', async () => {
    return getAllReferences(db_test).then(data => {
      expect(data.length).toBe(0);
    });
  });

  test('Insert a new reference', async () => {
    const reference = 'http://...';
    const description = 'Test reference';
    const type = 1;

    await insertReference(db_test, type, description, reference);

    return getReferenceById(db_test, 1).then(data => {
      expect(data.url).toBe(reference);
      expect(data.description).toBe(description);
    });
  });

  test('Select reference after insert one', async () => {
    return getAllReferences(db_test).then(data => {
      expect(data.length).toBe(1);
    });
  });

  test('Update reference', async () => {
    const description = 'Reference description';
    const url = '';
    const type = 2;
    const id = 1;

    await updateReference(db_test, description, type, url, id);

    return getReferenceById(db_test, id).then(data => {
      expect(data.description).toBe(description);
      expect(data.url).toBe(url);
      expect(data.type_reference_id).toBe(type);
    });
  });

  test('Delete reference', async () => {
    await deleteReference(db_test, 1);
    return getAllActiveReferences(db_test).then(data => {
      expect(data.length).toBe(0);
    });
  });

  test('Select all active references', async () => {
    const reference = 'http://...';
    const description = 'Test reference';
    const type = 2;

    await insertReference(db_test, type, description, reference);
    await insertReference(db_test, type, description, reference);
    await insertReference(db_test, type, description, reference);

    return getAllActiveReferences(db_test).then(data => {
      expect(data.length).toBe(3);
    });
  });

  test('Select all active references', async () => {
    return getAllActiveReferencesByType(db_test, 2).then(data => {
      expect(data.length).toBe(3);
    });
  });

  test('Select all active references', async () => {
    return getAllActiveReferencesByActivity(db_test, 1).then(data => {
      expect(data.length).toBe(0);
    });
  });

  afterAll(() => {
    db_test.close();
  });
});
