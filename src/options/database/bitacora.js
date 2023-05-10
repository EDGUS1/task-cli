function getAllBitacora(database) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM bitacora`;
    return database.all(sql, function (err, res) {
      if (err) return reject(err.message);
      return resolve(res);
    });
  });
}

function insertBitacora(database, activity_id) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT into bitacora (activity_id, completed, completed_at) VALUES (?,1,datetime('now','localtime'))`;
    return database.run(sql, [activity_id], function (err) {
      if (err) return reject(err.message);
      return resolve(this.changes);
    });
  });
}

module.exports = { getAllBitacora, insertBitacora };
