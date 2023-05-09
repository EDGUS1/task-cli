function getAllActivities(database) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM activity`;
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getAllActiveActivities(database) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT a.name, a.description, t.name AS priority FROM activity a INNER JOIN type_priority t ON a.type_priority_id = t.type_priority_id WHERE a.active = 1`;
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getAllDailyActivities(database) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT a.name, a.description, (CASE WHEN ((SELECT b.completed FROM bitacora b WHERE b.active = 1 AND b.activity_id = a.activity_id) IS NULL) THEN 'TODO' ELSE 'COMPLETED' END) AS estado FROM activity a WHERE a.active = 1 AND a.type_priority_id = 2`;
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getActivityById(database, id) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM activity WHERE activity_id = ?`;
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

module.exports = {
  getActivityById,
  getAllActivities,
  getAllActiveActivities,
  getAllDailyActivities,
  insertActivity,
  updateActivity,
  deleteActivity,
};
