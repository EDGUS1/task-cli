function getAllReferencesActivity(database) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM reference_activity`;
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function insertActivityReference(database, activity_id, reference_id) {
  return new Promise((resolve, reject) => {
    const sql =
      'INSERT INTO reference_activity (activity_id, reference_id) VALUES (?, ?)';
    return database.run(sql, [activity_id, reference_id], function (err) {
      if (err) return reject(err.message);
      return resolve(this.changes);
    });
  });
}

function getAllActiveIncompleteReferencesByActivity(database, id) {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT r.reference_id, r.url FROM reference_activity ra LEFT JOIN reference r ON r.reference_id = ra.reference_id WHERE r.active = 1 AND r.completed = 0 AND ra.activity_id = ?';
    return database.all(sql, [id], function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getLastIdInserted(database) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT MAX(reference_activity_id) as id FROM reference_activity`;
    return database.get(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getReferenceActivityById(database, id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM reference_activity WHERE reference_activity_id = ?`;
    return database.get(sql, [id], function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

module.exports = {
  getAllReferencesActivity,
  insertActivityReference,
  getAllActiveIncompleteReferencesByActivity,
  getLastIdInserted,
  getReferenceActivityById,
};
