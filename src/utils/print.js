const { Color } = require('./color');

const custom_print = (msg, opt, color) => {
  process.stdout.write(`\x1b[${opt}8;5;${color}m ${msg} \x1b[m`);
};

const log = msg => {
  custom_print(msg, 4, Color.black);
};

const log_error = msg => {
  custom_print(msg, 4, Color.red);
};

const log_warn = msg => {
  custom_print(msg, 3, Color.yellow);
};

const log_info = msg => {
  custom_print(msg, 3, Color.blue);
};

module.exports = { log, log_error, log_info, log_warn };
