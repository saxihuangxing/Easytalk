const https = require('https');
const fs = require('fs');
const app = require('./app');
const config = require('./config/config');
const Logger = require('./utils/Logger');
const port = normalizePort(process.env.PORT || config.server.port);
app.set('port', port);

function uncaughtExceptionHandler(err){
    Logger.error("hxtest uncaughtExceptionHandler " + err);
    Logger.error(err.stack);
    if(err && err.code == 'ECONNREFUSED'){
        //do someting
    }else{
       process.exit(1);
    }
}
process.on('uncaughtException', uncaughtExceptionHandler);

const privateKey  = fs.readFileSync( __dirname  + '/sslcert/funtalk.club.key', 'utf8');
const certificate = fs.readFileSync( __dirname  +  '/sslcert/funtalk.club.crt', 'utf8');
const credentials = { key:privateKey, cert:certificate };
const server = https.createServer(credentials, app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}



function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}



function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    Logger.info('Listening on ' + bind);
}
