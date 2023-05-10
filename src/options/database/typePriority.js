function getAllTypePriority(database) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM type_priority`;
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getAllActiveTypePriority(database) {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT type_priority_id, name FROM type_priority WHERE active = 1';
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

module.exports = { getAllTypePriority, getAllActiveTypePriority };
