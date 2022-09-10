'use strict';

const Application               = require('./app/Application');
const OS                        = require('os');
const https                     = require('https');
const { environment, execution_point, PORT } = require('./core/config');

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
        if (environment === 'development') {
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
                let port = Server.init().port();
                const server = https
                               .createServer(httpsOptions, this.getApp()).listen(port, () => {
                                    if (execution_point === this.constants.NPM) {
                                        console.log(
                                            '\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m'
                                        );
                                    } else if (execution_point === this.constants.PM2) {
                                        console.log(
                                            '\u001b[' + 94 + 'm' + 'Running PM2..!' + '\u001b[0m'
                                        );
                                        console.log(
                                            '\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m'
                                        );
                                        process.send('ready');
                                    } else {
                                        console.log(
                                            '\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m'
                                        );
                                    }
                                });
                return server;
            })();
        }
    }

    port() {
        return PORT || this.constants.PORTS.SERVER_PORT;
    }

    static init() {
        let server = new Server();
        return server;
    }
}

const server = Server.init().run();