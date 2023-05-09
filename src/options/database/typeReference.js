function getAllTypeReferences(database) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM type_reference`;
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function getAllActiveTypeReferences(database) {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT type_reference_id, name FROM type_reference WHERE active = 1';
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

module.exports = { getAllTypeReferences, getAllActiveTypeReferences };
