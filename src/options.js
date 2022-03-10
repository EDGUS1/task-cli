const { prompt } = require('inquirer');
const db = require('./db');

function agregarActividad() {
  prompt([
    {
      type: 'input',
      name: 'nombre',
      message: 'Nombre de la actividad',
    },
    {
      type: 'input',
      name: 'desc',
      message: 'Descripción de la actividad',
    },
    {
      type: 'list',
      name: 'prioridad',
      message: 'Prioridad de la actividad',
      choices: ['Diario', 'Default'],
      default: 1,
    },
  ])
    .then(response => {
      const stmt = db.prepare(
        "INSERT INTO actividad (nombre, descripcion, tipo_prioridad_id, fecha_creacion) VALUES (?,?,?,datetime('now','localtime'))"
      );
      stmt.run(
        response.nombre,
        response.desc,
        response.prioridad == 'Default' ? 1 : 0
      );
      stmt.finalize();
    })
    .catch(error => {
      console.error('Guardar nueva actividad');
      console.error(error);
    });
}

async function listarActividades() {
  db.all('SELECT nombre, descripcion FROM actividad', (err, rows) => {
    console.table(rows, Object.keys(rows[0]));
  });
}

function listarActividadesDiarias() {
  db.all(
    'SELECT nombre, descripcion FROM actividad where tipo_prioridad_id = 0',
    function (err, row) {
      console.table(row, Object.keys(row[0]));
    }
  );
}

function gestionarActividades() {
  console.log(`\x1b[41mTODO: \x1b[49m`);
}

function saveLink(link, desc) {
  db.all('SELECT * FROM actividad', (err, rows) => {
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
            message: 'Ingrese url',
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
    prompt(options).then(res => {
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

function completeActividad() {
  db.all('SELECT * FROM actividad', (err, rows) => {
    prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Seleccione la actividad',
        choices: rows.map(e => e.actividad_id + '-' + e.nombre),
        default: 0,
      },
    ]).then(res => {
      db.all(
        `SELECT * FROM link where actividad_id =${
          res.id.split('-')[0]
        } and finalizado = 0`,
        (err, rows) => {
          prompt([
            {
              type: 'checkbox',
              name: 'complete',
              message: 'Seleccione los links',
              choices: rows.map(e => e.link_id + '-' + e.url),
              default: 0,
            },
          ]).then(select => {
            if (select.complete?.length > 0) {
              const stmt = db.prepare(
                "UPDATE link set finalizado=1, fecha_finalizado=datetime('now','localtime') where link_id = ?"
              );
              select.complete.forEach(element => {
                stmt.run(element.split('-')[0]);
              });
              stmt.finalize();
            }
          });
        }
      );
    });
  });
}

function updateActividad() {
  db.all(
    'SELECT * FROM actividad where tipo_prioridad_id = 0 and actividad_id NOT IN (SELECT actividad_id from bitacora)',
    (err, rows) => {
      prompt([
        {
          type: 'checkbox',
          name: 'complete',
          message: 'Seleccione la(s) actividad(es)',
          choices: rows.map(e => e.actividad_id + '-' + e.nombre),
          default: 0,
        },
      ]).then(select => {
        if (select.complete?.length > 0) {
          const stmt = db.prepare(
            "INSERT into bitacora (actividad_id, hecho, fecha_creacion, fecha_hecho) VALUES (?,1,datetime('now','localtime'),datetime('now','localtime'))"
          );
          select.complete.forEach(element => {
            stmt.run(element.split('-')[0]);
          });
          stmt.finalize();
        }
      });
    }
  );
}

module.exports = {
  agregarActividad,
  listarActividades,
  listarActividadesDiarias,
  gestionarActividades,
  saveLink,
  completeActividad,
  updateActividad,
};
