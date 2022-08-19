'use strict';

const Application               = require('./app/Application');
const OS                        = require('os');
const { execution_point, PORT } = require('./core/config');

/**
 * @class Server
 * @constructor
 * @extends Application
 * @description Class Server is used to initiate the whole application and open a socket to serve the application
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
class Server extends Application{
    
    constructor() {
        super();
        process.env.UV_THREADPOOL_SIZE = OS.cpus().length;
    }

    run() {
        let port = Server.init().port();
        this.getApp().listen(port, () => {
            if (execution_point === this.constants.NPM) {
                console.log('\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m');
            } else if (execution_point === this.constants.PM2) {
                console.log('\u001b[' + 94 + 'm' + 'Running PM2..!' + '\u001b[0m');
                console.log('\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m');
                process.send('ready');
            } else {
                console.log('\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m');
            }
        });
    }

    port() {
        return PORT || this.constants.PORTS.SERVER_PORT;
    }

    static init() {
        let server = new Server();
        return server;
    }
}

Server.init().run();