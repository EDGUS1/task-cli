const sqlite3 = require('sqlite3').verbose();
const inquirer = require('inquirer');

const { configdb } = require('../commands/config');
const { completeActvDaily } = require('../options/updateActivity');
const { insertActivity } = require('../options/database/activity');
const { getAllBitacora } = require('../options/database/bitacora');

jest.mock('inquirer');

describe('Complete daily activity prompt', () => {
  const db_test = new sqlite3.Database(':memory:');

  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  });

  test('Complete activity', async () => {
    const name = 'Test';
    const description = 'Test description';
    const type = 2; // Diario

    await insertActivity(db_test, name, description, type);
    await insertActivity(db_test, name, description, type);
    await insertActivity(db_test, name, description, type);

    const mock_obj = { complete: [`1. ${name}`, `3. ${name}`] };
    inquirer.prompt = jest.fn().mockResolvedValue(mock_obj);

    await expect(completeActvDaily(db_test)).resolves.toEqual(mock_obj);

    const data = await getAllBitacora(db_test);
    expect(data.length).toBe(mock_obj.complete.length);
  });

  afterAll(() => {
    db_test.close();
  });
});
