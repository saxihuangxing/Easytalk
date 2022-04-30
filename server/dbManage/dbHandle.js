var mongoose = require('mongoose');
var config = require("../config/config");
let DB_URL = config.dbUrl;
const Logger = require('../utils/Logger');

/**
 * 连接
 */
mongoose.connect(DB_URL);

/**
 * 连接成功
 */
mongoose.connection.on('connected', function () {
    Logger.info('Mongoose connected  to ' + DB_URL);
});

/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {
    Logger.info('Mongoose connection error: ' + err);
});

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
    Logger.info('Mongoose connection disconnected');
});

module.exports = mongoose;
