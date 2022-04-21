'use strict';

const Winston = require('winston');
const Logger = new Winston.Logger();
const config = require('../config/config');
Winston.transports.DailyRotateFile = require('winston-daily-rotate-file');


const { level } = config.log;
let filename = config.log.filename;

Logger.configure({
  levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, trace: 5 },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'magenta',
    trace: 'gray'
  },
});

Logger.add(Winston.transports.Console, {
  timestamp:true,
  prettyPrint: false,
  humanReadableUnhandledException: true,
  colorize: true,
  handleExceptions: false,
  silent: false,
  stringify: (obj) => JSON.stringify(obj),
  level,
});


if (filename) {
  console.log("hxtest filename = " + filename);
  Logger.add(Winston.transports.DailyRotateFile, {
    filename,
    prettyPrint: true,
    datePattern: '.yyyy-MM-dd',
    prepend: false,
    stringify: (obj) => JSON.stringify(obj), // single lines
    level,
  });
}

module.exports = Logger;
