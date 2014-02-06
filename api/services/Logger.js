var winston = require('winston');
//var Loggly = require('winston-loggly').Loggly;

module.exports = winston;

//winston.add(winston.transports.Console, {
//    level: 'silly',
//    colorize: true,
//    handleExceptions: true,
//    timestamp: false
//});

//winston.add(Loggly, {
//    level: 'warn',
//    subdomain: process.env.LOGGLY_SUBDOMAIN,
//    auth: process.env.LOGGLY_AUTH,
//    inputName: process.env.LOGGLY_INPUT_NAME,
//    inputToken: process.env.LOGGLY_INPUT_TOKEN,
//    json: true
//});