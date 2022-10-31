'use strict';

import https from 'https';
import { NextFunction, Request, Response } from 'express';
import OS from 'os';
import { ENDPOINTS } from './core/api/apis_endpoints/endpoints';
import * as config from './core/config';
import { Singleton } from './core/Singleton/Singleton';
import { csrf, siteNotFound, undefinedHttpRequest } from './core/utils/404-logic';
import BaseController from './core/controller/BaseController';

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
                //****\\
                //* Will be triggered only on errors or next(new Error('error message')) or next({error: 'checked'}) *\\
                //****\\
                //@ts-ignore
                this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
                    if (err.code === this.constants.CSRF.errCode) {
                        return res.status(this.constants.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN).render('undefined_routes', csrf(res));
                    }
                    
                    const _status       = err.statusCode || this.constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
                    const message       = err.message;
                    var is_api_endpoint = false;
                    
                    ENDPOINTS.forEach((endpoint: any) => {
                        if (ENDPOINTS.includes(req.headers.referer || '')
                        || ENDPOINTS.includes(req.originalUrl || '')
                        || ENDPOINTS.includes(req.url || '')) {
                            is_api_endpoint = true;
                        }
                    });
                    
                    if (is_api_endpoint) {
                        return res.status(_status).json({message: message});
                    } else {
                        if (err) {
                            if (Object.keys('statusCode')) {
                                req.origin = req.headers.origin || req.get('origin');
                                // @ts-ignore
                                switch (err.statusCode) {
                                    case 503:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: 503, message: 'Service is not available'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/404/',
                                            is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: 503,
                                            status_title: "Exception is thrown.",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    case 500:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                console.log('checked')
                                                return res.status(_status).json({statusCode: 500, message: 'Internal Server Error'});
                                            }
                                        });

                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/404/',
                                            is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: 500,
                                            status_title: "Unexpected error",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    case 400:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: 400, message: 'Bad Request'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '',
                                            path: '/404/',
                                            is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
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
                                    break;
                                    case 404:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: 404, message: 'Site Not Found!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/404/',
                                            is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
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
                                    break;
                                    default:
                                    break;
                                }
                            }
                        }
                        if (req.isPost()) {
                            return res.status(_status)
                            .render('undefined_routes', {
                                nav_title: '',
                                path: '/404/',
                                is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
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
                                    path: '/404/',
                                    is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
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
                                path: '/404/',
                                is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
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
                                path: '/404/',
                                is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
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
                                path: '/404/',
                                is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
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
                                
                const server = https
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