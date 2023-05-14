function getAllReferences(database) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM reference`;
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getReferenceById(database, id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM reference WHERE reference_id = ?`;
    return database.get(sql, [id], function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getAllActiveReferences(database) {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT r.reference_id, r.description, r.url, t.name FROM reference r LEFT JOIN type_reference t ON r.type_reference_id = t.type_reference_id WHERE r.active = 1';
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getAllActiveReferencesByType(database, type) {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT url, description FROM reference WHERE active = 1 AND type_reference_id = ?';
    return database.all(sql, [type], function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getAllActiveReferencesByActivity(database, id) {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT r.url, r.description, t.name FROM reference r INNER JOIN reference_activity a ON r.reference_id = a.reference_id INNER JOIN type_reference t ON t.type_reference_id = r.type_reference_id WHERE a.active = 1 AND a.activity_id = ?';
    return database.all(sql, [id], function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function insertReference(database, type, description, reference) {
  return new Promise((resolve, reject) => {
    const sql =
      'INSERT INTO reference (type_reference_id, description, url) VALUES (?, ?, ?)';
    return database.run(sql, [type, description, reference], function (err) {
      if (err) return reject(err.message);
      return resolve(this.changes);
    });
  });
}

function updateReference(database, description, type, url, id) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE reference SET description = ?, updated_at = datetime('now','localtime'), type_reference_id = ?, url = ? WHERE reference_id = ?`;
    return database.run(sql, [description, type, url, id], function (err) {
      if (err) return reject(err.message);
      return resolve(this.changes);
    });
  });
}

function deleteReference(database, id) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE reference SET active = ?, updated_at = datetime('now','localtime') WHERE reference_id = ?`;
    database.run(sql, [0, id], function (err) {
      if (err) reject(err.message);
      resolve(this.changes);
    });
  });
}

function getLastIdReference(database) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT MAX(reference_id) as id FROM reference`;
    return database.get(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function markReferenceAsComplete(database, id) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE reference SET completed = 1, completed_at = datetime('now','localtime'), updated_at = datetime('now','localtime') WHERE reference_id = ?`;
    database.run(sql, [id], function (err) {
      if (err) reject(err.message);
      resolve(this.changes);
    });
  });
}

module.exports = {
  getAllReferences,
  getAllActiveReferences,
  getAllActiveReferencesByActivity,
  getAllActiveReferencesByType,
  insertReference,
  updateReference,
  deleteReference,
  getReferenceById,
  getLastIdReference,
  markReferenceAsComplete,
};
