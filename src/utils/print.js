const { Color } = require('./color');

const COLOR_ = 3;
const BACKGROUND = 4;

const custom_print = (msg, opt, color) => {
  console.log(`\x1b[${opt}8;5;${color}m ${msg} \x1b[m`);
};

const log = msg => {
  custom_print(msg, BACKGROUND, Color.black);
};

const log_error = msg => {
  custom_print(msg, BACKGROUND, Color.red);
};

const log_warn = msg => {
  custom_print(msg, COLOR_, Color.yellow);
};

const log_info = msg => {
  custom_print(msg, COLOR_, Color.blue);
};

function print_table(rows) {
  if (rows && rows.length > 0) console.table(rows, Object.keys(rows[0]));
  else log_error('No hay datos guardados');
}

module.exports = { log, log_error, log_info, log_warn, print_table };
