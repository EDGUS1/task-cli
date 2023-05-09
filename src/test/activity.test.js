const { configdb } = require('../commands/config');
const create_db = require('../config/create_db');
const {
  getAllActivities,
  getActivityById,
  insertActivity,
  deleteActivity,
  updateActivity,
  getAllActiveActivities,
  getAllDailyActivities,
} = require('../options/database/activity');

describe('Table activity', () => {
  const db_test = create_db('activity.db');
  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  }, 5000 * 4);

  test('Select all activities after create tables', async () => {
    const data = await getAllActivities(db_test);
    expect(data.length).toBe(0);
  });

  test('Insert and select activity by id', async () => {
    const name = 'Test';
    const description = 'Activity from test';
    const type = 1;

    await insertActivity(db_test, name, description, type);

    const data = await getActivityById(db_test, 1);

    expect(data.name).toBe(name);
    expect(data.description).toBe(description);
    expect(data.type_priority_id).toBe(type);
  });

  test('Select all activities after insert a new one', async () => {
    const data = await getAllActivities(db_test);
    expect(data.length).toBe(1);
  });

  test('Update activity by id', async () => {
    const name = 'Update Nanme';
    const description = 'Update description';
    const type = 2;

    await updateActivity(db_test, name, description, type, 1);
    const data = await getActivityById(db_test, 1);

    expect(data.name).toBe(name);
    expect(data.description).toBe(description);
    expect(data.type_priority_id).toBe(type);
  });

  test('Delete activity', async () => {
    await deleteActivity(db_test, 1);
    const data = await getActivityById(db_test, 1);
    expect(data.active).toBe(0);
  });

  test('Select all active activities', async () => {
    const name = 'Test';
    const description = 'Activity from test';
    const type = 1;

    await insertActivity(db_test, name, description, type);
    await insertActivity(db_test, name, description, type);
    await insertActivity(db_test, name, description, type);

    const data_active = await getAllActiveActivities(db_test);
    expect(data_active.length).toBe(3);

    const data = await getAllActivities(db_test);
    expect(data.length).toBe(4);
  });

  test('Select all daily activities', async () => {
    const name = 'Test';
    const description = 'Activity from test';
    const type = 2;

    await insertActivity(db_test, name, description, type);
    await insertActivity(db_test, name, description, type);
    await insertActivity(db_test, name, description, type);

    const data_active = await getAllDailyActivities(db_test);
    expect(data_active.length).toBe(3);

    const data = await getAllActivities(db_test);
    expect(data.length).toBe(7);
  });

  afterAll(() => {
    db_test.close();
  });
});
