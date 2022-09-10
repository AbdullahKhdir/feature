'use strict';

import https from 'https';
import OS from 'os';
import * as config from './core/config';
import { Singleton } from './core/Singleton/Singleton';

/**
 * @class Server
 * @constructor
 * @extends Application
 * @description Class Server is used to initiate the whole application and open a socket to serve the application
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
class Server {
    
    private static server_instance: Server;
    public app;
    public constants;
    private constructor() {
        this.app          = Singleton.getExpressApp();
        this.constants    = Singleton.getConstants();
        process.env['UV_THREADPOOL_SIZE'] = OS.cpus().length.toString();
    }

    static getServerInstance() {
        if (this.server_instance) {
            return this.server_instance;
        }
        return this.server_instance = new Server();
    }

    run() {
        if (config.configurations().environment === 'development') {
            /*
            !  DO NOT USE THIS IN PRODUCTION ENVIRONMENT
            * ONLY FOR DEVELOPMENT PURPOSES
            */
            const mkcert = require('mkcert');
            (async () => {
                // create a certificate authority
                const ca = await mkcert.createCA({
                  organization: 'Node School',
                  countryCode:  'DE',
                  state:        'Bavaria',
                  locality:     'Nuremberg',
                  validityDays: 1
                });
                
                // then create a tls certificate
                const cert = await mkcert.createCert({
                  domains: ['127.0.0.1', 'localhost'],
                  validityDays: 1,
                  caKey: ca.key,
                  caCert: ca.cert
                });
                
                // certificate info
                // console.log(cert.key, cert.cert);
                // create a full chain certificate by merging CA and domain certificates
                // console.log(`${cert.cert}\n${ca.cert}`);
                
                const httpsOptions = {
                    key: cert.key,
                    cert: cert.cert
                }
                // const httpsOptions = {
                //     key:  this.file_system.readFileSync('./certificates/example.cert.key'),
                //     cert: this.file_system.readFileSync('./certificates/example.cert.pem')
                // }
                let port = Server.getServerInstance().port();
                const server = https
                               //@ts-ignore
                               .createServer(httpsOptions, this.app).listen(port, () => {
                                    if (config.configurations().execution_point === this.constants.NPM) {
                                        console.log(
                                            '\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m'
                                        );
                                    } else if (config.configurations().execution_point === this.constants.PM2) {
                                        console.log(
                                            '\u001b[' + 94 + 'm' + 'Running PM2..!' + '\u001b[0m'
                                        );
                                        console.log(
                                            '\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m'
                                        );
                                        (<any> process).send('ready');
                                    } else {
                                        console.log(
                                            '\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m'
                                        );
                                    }
                                    console.log('\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + ', Using TS!' + '\u001b[0m');
                                });
                return server;
            })();
        }
    }

    port() : number | string {
        return config.configurations().server_port || this.constants.PORTS.SERVER_PORT;
    }

    static init() {
        Server.getServerInstance().run();
    }
}

Server.init();