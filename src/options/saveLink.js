const { prompt } = require('inquirer');
const db = require('../config/db');

function saveLink(link, desc) {
  db.all('SELECT * FROM actividad', async (err, rows) => {
    const options = desc
      ? [
          {
            type: 'list',
            name: 'link',
            message: 'Seleccione la actividad',
            choices: rows.map(e => e.actividad_id + '-' + e.nombre),
            default: 0,
          },
        ]
      : [
          {
            type: 'input',
            name: 'url',
            message: 'Ingrese url del recurso',
          },
          {
            type: 'list',
            name: 'link',
            message: 'Seleccione la actividad',
            choices: rows.map(e => e.actividad_id + '-' + e.nombre),
            default: 0,
          },
          {
            type: 'input',
            name: 'descripcion',
            message: 'Ingrese descripcion',
          },
        ];
    await prompt(options).then(res => {
      const stmt = db.prepare(
        "INSERT INTO link (actividad_id, descripcion, url, fecha_creacion) VALUES (?,?,?,datetime('now','localtime'))"
      );
      stmt.run(
        res.link.split('-')[0],
        res.descripcion || null,
        res.url || link
      );
      stmt.finalize();
    });
  });
}

module.exports = { saveLink };
