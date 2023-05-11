const sqlite3 = require('sqlite3').verbose();
const inquirer = require('inquirer');
const { addActivity } = require('../options/addActivity');
const {
  getActivityById,
  getLastIdInserted,
} = require('../options/database/activity');
const { configdb } = require('../commands/config');

jest.mock('inquirer');

describe('Add activity prompt', () => {
  const db_test = new sqlite3.Database(':memory:');

  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  });

  test('New activity', async () => {
    const mock_obj = {
      name: 'Name',
      description: 'description',
      priority: 'Default',
    };

    inquirer.prompt = jest.fn().mockResolvedValue(mock_obj);

    await expect(addActivity(db_test)).resolves.toEqual(mock_obj);

    const activity = await getLastIdInserted(db_test);
    const data = await getActivityById(db_test, activity.id);

    expect(data.name).toBe(mock_obj.name);
    expect(data.description).toBe(mock_obj.description);
    expect(data.type_priority_id).toBe(1);
    expect(data.active).toBe(1);
    expect(data.updated_at).toBeNull();
  });

  afterAll(() => {
    db_test.close();
  });
});
