const sqlite3 = require('sqlite3').verbose();
const { configdb } = require('../commands/config');

const {
  getAllActivities,
  getActivityById,
  insertActivity,
  deleteActivity,
  updateActivity,
  getAllActiveActivities,
  getAllDailyActivities,
  getActiveActivityById,
  getLastIdInserted,
  getAllActiveIncompleteDailyActivities,
} = require('../options/database/activity');

describe('Table activity', () => {
  const db_test = new sqlite3.Database(':memory:');

  beforeAll(async () => {
    const response = await configdb(db_test);
    expect(response).toBe('Objetos creados correctamente');
  });

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
    expect(data.updated_at).toBeNull();
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
    expect(data.updated_at).not.toBeNull();
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

  test('Select values for active activity', async () => {
    const name = 'Test';
    const description = 'Activity from test';
    const type = 2;

    await insertActivity(db_test, name, description, type);
    const { id } = await getLastIdInserted(db_test);
    const data = await getActiveActivityById(db_test, id);

    expect(data).not.toBeNull();
    expect(data.name).toBe(name);
    expect(data.description).toBe(description);
    expect(data.type_priority_id).toBe(type);
  });

  test('Select values for active incomplete daily activity', async () => {
    const name = 'Test';
    const description = 'Activity from test';
    const type = 2;

    await insertActivity(db_test, name, description, type);
    const data = await getAllActiveIncompleteDailyActivities(db_test);

    expect(data).not.toBeNull();
  });

  test('Select max_id inserted', async () => {
    const name = 'Test';
    const description = 'Activity from test';
    const type = 2;

    const { id: before_insert_id } = await getLastIdInserted(db_test);
    await insertActivity(db_test, name, description, type);
    const { id } = await getLastIdInserted(db_test);

    expect(id).toBe(before_insert_id + 1);
  });

  afterAll(() => {
    db_test.close();
  });
});
