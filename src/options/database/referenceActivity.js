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

module.exports = { getAllReferencesActivity, insertActivityReference };
