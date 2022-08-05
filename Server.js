'use strict';

const Application               = require('./app/Application');
const OS                        = require('os');
const { is_worker_pool_active } = require('./core/config');

/**
 * @class Server
 * @constructor
 * @extends Application
 * @description Class Server is used to initiate the whole application and open a socket to serve the application
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
class Server extends Application{
    
    thread_worker;
    constructor() {
        super();
        process.env.UV_THREADPOOL_SIZE = OS.cpus().length;
    }

    run() {
        let port = Server.init().port();
        this.getApp().listen(port, () => {
            console.log('\u001b[' + 46 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m');
        });
    }

    port() {
        return this.constants.PORTS.SERVER_PORT;
    }

    static init() {
        let server = new Server();
        return server;
    }
}


let system = new Server();
system.run()

