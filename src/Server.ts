'use strict';

import https from 'https';
import { NextFunction, Request, Response } from 'express';
import OS from 'os';
import { ENDPOINTS } from './core/api/apis_endpoints/endpoints';
import * as config from './core/config';
import { Singleton } from './core/Singleton/Singleton';
import { csrf } from './core/utils/undefined-routes-logic';
import ApiError from './core/error/ApiError';

/**
 * @class Server
 * @constructor
 * @extends Application
 * @description Class Server is used to initiate the whole application and open a socket to serve the application
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export class Server {
    
    private static server_instance: Server;
    public app;
    public constants;
    public __;
    private constructor() {
        this.app          = Singleton.getExpressApp();
        this.constants    = Singleton.getConstants();
        this.__           = Singleton.getLodash();
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
            return (async () => {
                /*
                !  DO NOT USE THIS IN PRODUCTION ENVIRONMENT
                * ONLY FOR DEVELOPMENT PURPOSES
                */
                const mkcert = require('mkcert');
                // create a certificate authority
                const ca = await mkcert.createCA({
                organization: 'Node',
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
                //****************************************************************************************************\\
                //* Will be triggered only on errors or next(new Error('error message')) or next({error: 'message'}) *\\
                //****************************************************************************************************\\
                this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
                    if (error.code === this.constants.CSRF.errCode) {
                        return res.status(this.constants.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN).render('undefined_routes', csrf(res));
                    }
                    
                    const _status       = error.statusCode || this.constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
                    const message       = error.message;
                    var is_api_endpoint = false;
                    // throw err;

                    if (ENDPOINTS.length > 0) {
                        ENDPOINTS.forEach((endpoint: any) => {
                            if (ENDPOINTS.includes(req.headers.referer || '')
                            || ENDPOINTS.includes(req.originalUrl || '')
                            || ENDPOINTS.includes(req.url || '')) {
                                is_api_endpoint = true;
                            }
                        });                        
                    }

                    if (is_api_endpoint) {
                        return res.status(_status).json({message: message});
                    } else {
                        if (error) {
                            if (Object.keys('statusCode')) {
                                // req.origin = req.headers.origin || req.get('origin');
                                error.statusCode = error.statusCode ? error.statusCode : this.constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
                                const error_handler = ApiError.errorHandler(error)[error.statusCode];

                                if (ENDPOINTS.length > 0) {
                                    ENDPOINTS.forEach((endpoint: any) => {
                                        if (ENDPOINTS.includes(req.headers.referer || '')
                                        || ENDPOINTS.includes(req.originalUrl || '')
                                        || ENDPOINTS.includes(req.url || '')) {
                                            return res.status(_status).json({statusCode: error_handler.status_code, message: error_handler.status_title});
                                        }
                                    });
                                }

                                return res.status(_status)
                                    .render('undefined_routes', {
                                        nav_title: '',
                                        path: '/undefined_routes/',
                                        is_authenticated: req?.session?.is_authenticated,
                                        error:   null,
                                        warning: null,
                                        success: null,
                                        status_code: error_handler.status_code,
                                        status_title: error_handler.status_title,
                                        status_description: message || error_handler.status_description,
                                        url: error_handler.url,
                                        label: error_handler.label
                                    });
                            }
                        }

                        if (req.isPost()) {
                            return res.status(_status)
                                .render('undefined_routes', {
                                    nav_title: '',
                                    path: '/undefined_routes/',
                                    is_authenticated: req?.session?.is_authenticated,
                                    error:   null,
                                    warning: null,
                                    success: null,
                                    status_code: 400,
                                    status_title: "Bad Request",
                                    status_description: `Wondering from where have you requested this url, but you can click the button below
                                    to go back to the homepage.`,
                                    url: '/',
                                    label: 'Home'
                                });
                        } else if (req.isGet()) {
                            return res.status(_status)
                                .render('undefined_routes', {
                                    nav_title: '', 
                                    path: '/undefined_routes/',
                                    is_authenticated: req?.session?.is_authenticated,
                                    error:   null,
                                    warning: null,
                                    success: null,
                                    status_code: 404,
                                    status_title: "UH OH! You're lost.",
                                    status_description: `The page you are looking for does not exist.
                                    How you got here is a mystery. But you can click the button below
                                    to go back to the homepage.`,
                                    url: '/',
                                    label: 'Home'
                                });
                        } else if (req.isPatch()) {
                            return res.status(_status)
                                .render('undefined_routes', {
                                    nav_title: '',
                                    path: '/undefined_routes/',
                                    is_authenticated: req?.session?.is_authenticated,
                                    error:   null,
                                    warning: null,
                                    success: null,
                                    status_code: 400,
                                    status_title: "Bad Request",
                                    status_description: `Wondering from where have you requested this url, but you can click the button below
                                    to go back to the homepage.`,
                                    url: '/',
                                    label: 'Home'
                                });
                        } else if (req.isPut()) {
                            return res.status(_status)
                                .render('undefined_routes', {
                                    nav_title: '',
                                    path: '/undefined_routes/',
                                    is_authenticated: req?.session?.is_authenticated,
                                    error:   null,
                                    warning: null,
                                    success: null,
                                    status_code: 400,
                                    status_title: "Bad Request",
                                    status_description: `Wondering from where have you requested this url, but you can click the button below
                                    to go back to the homepage.`,
                                    url: '/',
                                    label: 'Home'
                                });
                        } else if (req.isDelete()) {
                            return res.status(_status)
                                .render('undefined_routes', {
                                    nav_title: '',
                                    path: '/undefined_routes/',
                                    is_authenticated: req?.session?.is_authenticated,
                                    error:   null,
                                    warning: null,
                                    success: null,
                                    status_code: 400,
                                    status_title: "Bad Request",
                                    status_description: `Wondering from where have you requested this url, but you can click the button below
                                    to go back to the homepage.`,
                                    url: '/',
                                    label: 'Home'
                                });
                        }
                    }
                });
                
                const httpServer = https.createServer(httpsOptions, this.app);
                // const _class = Websocket.getClassInstance();
                // const io = Websocket.getIoInstance(httpServer);
                // _class.initializeHandlers([
                //     { path: '/chat', handler: new ChatSockets() }
                // ]);

                const server = httpServer.listen(port, () => {
                    if (config.configurations().execution_point === this.constants.NPM) {
                        console.log(
                            '\u001b[' + 44 + 'm' + 'Express Server Is Running Natively On Port ' + port + '!' + '\u001b[0m'
                        );
                    } else if (config.configurations().execution_point === this.constants.PM2) {
                        console.log(
                            '\u001b[' + 94 + 'm' + 'Running On Load Balancer PM2..!' + '\u001b[0m'
                        );
                        console.log(
                            '\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m'
                        );
                        (<any> process).send('ready');
                    } else {
                        console.log(
                            '\u001b[' + 44 + 'm' + 'Express Server Is Running Natively On Port ' + port + '!' + '\u001b[0m'
                        );
                    }
                    console.log('\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + ', Using TypeScript!' + '\u001b[0m');
                });
                return server;
            })();            
        }
    }

    port() : number | string {
        return config.configurations().server_port || this.constants.PORTS.SERVER_PORT;
    }

    static init() {
        return Server.getServerInstance().run();
    }
}

Server.init()