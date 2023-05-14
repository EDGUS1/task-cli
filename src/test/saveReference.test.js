const sqlite3 = require('sqlite3').verbose();
const inquirer = require('inquirer');

const { configdb } = require('../commands/config');
const {
  saveReferenceActiv,
  saveReference,
} = require('../options/saveReference');
const { insertActivity } = require('../options/database/activity');
const {
  getReferenceById,
  getLastIdReference,
} = require('../options/database/reference');
const {
  getLastIdInserted,
  getReferenceActivityById,
} = require('../options/database/referenceActivity');

jest.mock('inquirer');

describe('Save reference prompt', () => {
  const db_test = new sqlite3.Database(':memory:');

  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  });

  test('Save reference on activity with url in params', async () => {
    const reference = 'http://test';
    const name = 'Test';
    const description = 'Test description';
    const type = 1;
    const selected_activity = 2;

    const mock_obj = { activity: `${selected_activity}. ${name}` };

    await insertActivity(db_test, name, description, type);
    await insertActivity(db_test, name, description, type);

    inquirer.prompt = jest.fn().mockResolvedValue(mock_obj);
    await expect(saveReferenceActiv(db_test, reference, true)).resolves.toEqual(
      mock_obj
    );
    const ref = await getLastIdReference(db_test);
    const inserted_reference = await getReferenceById(db_test, ref.id);
    expect(inserted_reference.url).toBe(reference);

    const ref_actv = await getLastIdInserted(db_test);
    const inserted_ref_act = await getReferenceActivityById(
      db_test,
      ref_actv.id
    );

    expect(inserted_ref_act.reference_id).toBe(ref.id);
    expect(inserted_ref_act.activity_id).toBe(selected_activity);
  });

  test('Save reference on activity without url in params', async () => {
    const reference = 'http://test';
    const name = 'Test';
    const description = 'Test description';
    const type = 2;
    const selected_activity = 2;

    const mock_obj = {
      url: reference,
      activity: `${selected_activity}. ${name}`,
      description,
      type_ref: `${type}. Diario`,
    };

    await insertActivity(db_test, name, description, type);
    await insertActivity(db_test, name, description, type);
    await insertActivity(db_test, name, description, type);

    inquirer.prompt = jest.fn().mockResolvedValue(mock_obj);
    await expect(saveReferenceActiv(db_test, null, false)).resolves.toEqual(
      mock_obj
    );

    const ref = await getLastIdReference(db_test);
    const inserted_reference = await getReferenceById(db_test, ref.id);
    expect(inserted_reference.url).toBe(reference);

    const ref_actv = await getLastIdInserted(db_test);
    const inserted_ref_act = await getReferenceActivityById(
      db_test,
      ref_actv.id
    );

    expect(inserted_ref_act.reference_id).toBe(ref.id);
    expect(inserted_ref_act.activity_id).toBe(selected_activity);
  });

  test('New reference', async () => {
    const type = 1;
    const mock_obj = {
      url: 'http://',
      description: 'description',
      id: `${type}. Default`,
    };

    inquirer.prompt = jest.fn().mockResolvedValue(mock_obj);

    await expect(saveReference(db_test, null)).resolves.toEqual(mock_obj);

    const reference = await getLastIdReference(db_test);
    const data = await getReferenceById(db_test, reference.id);

    expect(data.url).toBe(mock_obj.url);
    expect(data.description).toBe(mock_obj.description);
    expect(data.type_reference_id).toBe(type);
    expect(data.active).toBe(1);
    expect(data.updated_at).toBeNull();
  });

  test('New reference in param', async () => {
    const type = 1;
    const url = 'http://';
    // const mock_obj = {
    //   description: 'description',
    //   id: `${type}. Default`,
    // };

    inquirer.prompt = jest.fn().mockResolvedValue();

    // await expect(saveReference(db_test, null)).resolves.toEqual(mock_obj);
    await saveReference(db_test, url);

    const reference = await getLastIdReference(db_test);
    const data = await getReferenceById(db_test, reference.id);

    expect(data.url).toBe(url);
    expect(data.description).toBe('');
    expect(data.type_reference_id).toBe(type);
    expect(data.active).toBe(1);
    expect(data.updated_at).toBeNull();
  });

  afterAll(() => {
    db_test.close();
  });
});
