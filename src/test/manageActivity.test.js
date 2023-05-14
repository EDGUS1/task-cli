const sqlite3 = require('sqlite3').verbose();
const inquirer = require('inquirer');

const { configdb } = require('../commands/config');
const {
  updateActivityPrompt,
  deleteActivityPrompt,
} = require('../options/manageActivity');
const {
  insertActivity,
  getLastIdInserted,
  getActivityById,
} = require('../options/database/activity');

jest.mock('inquirer');

describe('Manage activity prompt', () => {
  const db_test = new sqlite3.Database(':memory:');

  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  });

  test('Update activity', async () => {
    const name = 'Test';
    const description = 'Test description';
    const type = 1;

    await insertActivity(db_test, name, description, type);

    const mock_obj = {
      actv: `1. ${name}`,
      name: 'New Test',
      description: 'New Test description',
      type: `${type}. Default`,
    };
    inquirer.prompt = jest.fn().mockResolvedValue(mock_obj);
    await expect(updateActivityPrompt(db_test)).resolves.toEqual(mock_obj);

    const activity = await getLastIdInserted(db_test);
    const data = await getActivityById(db_test, activity.id);

    expect(data.name).toBe(mock_obj.name);
    expect(data.description).toBe(mock_obj.description);
    expect(data.type_priority_id).toBe(1);
    expect(data.active).toBe(1);
    expect(data.updated_at).not.toBeNull();
  });

  test('Delete activity', async () => {
    const name = 'Test';
    const description = 'Test description';
    const type = 1;

    await insertActivity(db_test, name, description, type);

    const mock_obj = {
      actv: `2. ${name}`,
      delete: true,
    };

    inquirer.prompt = jest.fn().mockResolvedValue(mock_obj);
    await expect(deleteActivityPrompt(db_test)).resolves.toEqual(mock_obj);

    const activity = await getLastIdInserted(db_test);
    const data = await getActivityById(db_test, activity.id);

    expect(data.name).toBe(name);
    expect(data.description).toBe(description);
    expect(data.type_priority_id).toBe(1);
    expect(data.active).toBe(0);
    expect(data.updated_at).not.toBeNull();
  });

  afterAll(() => {
    db_test.close();
  });
});
