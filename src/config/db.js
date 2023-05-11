const createDB = require('./createDB');

const db = createDB('mock.db');

module.exports = { db };
