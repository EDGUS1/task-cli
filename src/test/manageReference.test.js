const sqlite3 = require('sqlite3').verbose();
const inquirer = require('inquirer');

const { configdb } = require('../commands/config');
const {
  updateReferencePrompt,
  deleteReferencePrompt,
} = require('../options/manageReference');
const {
  insertReference,
  getLastIdReference,
  getReferenceById,
} = require('../options/database/reference');

jest.mock('inquirer');

describe('Manage reference prompt', () => {
  const db_test = new sqlite3.Database(':memory:');

  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  });

  test('Update reference', async () => {
    const description = 'Test description';
    const type = 1;
    const url = 'http://';

    await insertReference(db_test, type, description, url);
    const activity = await getLastIdReference(db_test);
    const data_ = await getReferenceById(db_test, activity.id);

    expect(data_.url).toBe(url);
    expect(data_.description).toBe(description);
    expect(data_.type_reference_id).toBe(1);
    expect(data_.active).toBe(1);
    expect(data_.updated_at).toBeNull();

    const mock_obj = {
      ref: `${activity.id}. ${url}`,
      url: 'https://',
      description: 'New description',
      minute: '1',
      completed: false,
      type: '1. Default',
    };

    inquirer.prompt = jest.fn().mockResolvedValue(mock_obj);

    await expect(updateReferencePrompt(db_test)).resolves.toEqual(mock_obj);

    const data = await getReferenceById(db_test, activity.id);

    expect(data.url).toBe(mock_obj.url);
    expect(data.description).toBe(mock_obj.description);
    expect(data.type_reference_id).toBe(1);
    expect(data.active).toBe(1);
    expect(data.updated_at).not.toBeNull();
  });

  test('Delete reference', async () => {
    const description = 'Test description';
    const type = 1;
    const url = 'http://';

    await insertReference(db_test, type, description, url);
    const activity = await getLastIdReference(db_test);
    const data_ = await getReferenceById(db_test, activity.id);

    expect(data_.url).toBe(url);
    expect(data_.description).toBe(description);
    expect(data_.type_reference_id).toBe(1);
    expect(data_.active).toBe(1);
    expect(data_.updated_at).toBeNull();

    const mock_obj = {
      ref: `${activity.id}. ${url}`,
      delete: true,
    };

    inquirer.prompt = jest.fn().mockResolvedValue(mock_obj);

    await expect(deleteReferencePrompt(db_test)).resolves.toEqual(mock_obj);

    const data = await getReferenceById(db_test, activity.id);

    expect(data.url).toBe(url);
    expect(data.description).toBe(description);
    expect(data.type_reference_id).toBe(1);
    expect(data.active).toBe(0);
    expect(data.updated_at).not.toBeNull();
  });

  afterAll(() => {
    db_test.close();
  });
});
