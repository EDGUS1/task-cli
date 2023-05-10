function getAllActivities(database) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM activity`;
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getAllActiveActivities(database) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT a.activity_id, a.name, a.description, t.name AS priority FROM activity a LEFT JOIN type_priority t ON a.type_priority_id = t.type_priority_id WHERE a.active = 1`;
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getAllDailyActivities(database) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT a.name, a.description, (CASE WHEN ((SELECT b.completed FROM bitacora b WHERE b.active = 1 AND b.activity_id = a.activity_id AND created_at <> datetime('now','localtime')) IS NULL) THEN 'TODO' ELSE 'COMPLETED' END) AS estado FROM activity a WHERE a.active = 1 AND a.type_priority_id = 2`;
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getActivityById(database, id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM activity WHERE activity_id = ?`;
    return database.get(sql, [id], function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getActiveActivityById(database, id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT type_priority_id, name, description FROM activity WHERE active = 1 AND activity_id = ?`;
    return database.get(sql, [id], function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function insertActivity(database, name, description, type) {
  return new Promise((resolve, reject) => {
    const sql =
      'INSERT INTO activity (name, description, type_priority_id) VALUES (?,?,?)';
    return database.run(sql, [name, description, type], function (err) {
      if (err) return reject(err.message);
      return resolve(this.changes);
    });
  });
}

function updateActivity(database, name, description, type, id) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE activity SET name = ?, description = ?, updated_at = datetime('now','localtime'), type_priority_id = ? WHERE activity_id = ?`;
    return database.run(sql, [name, description, type, id], function (err) {
      if (err) return reject(err.message);
      return resolve(this.changes);
    });
  });
}

function deleteActivity(database, id) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE activity SET active = ?, updated_at = datetime('now','localtime') WHERE activity_id = ?`;
    database.run(sql, [0, id], function (err) {
      if (err) reject(err.message);
      resolve(this.changes);
    });
  });
}

function getAllActiveIncompleteDailyActivities(database) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT activity_id, name FROM activity WHERE active = 1 AND type_priority_id = 2 and activity_id NOT IN (SELECT activity_id FROM bitacora)`;
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getLastIdInserted(database) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT MAX(activity_id) as id FROM activity`;
    return database.get(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

module.exports = {
  getActivityById,
  getAllActivities,
  getAllActiveActivities,
  getAllDailyActivities,
  insertActivity,
  updateActivity,
  deleteActivity,
  getAllActiveIncompleteDailyActivities,
  getActiveActivityById,
  getLastIdInserted,
};
