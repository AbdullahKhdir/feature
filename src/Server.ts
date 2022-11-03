'use strict';

import https from 'https';
import { NextFunction, Request, Response } from 'express';
import OS from 'os';
import { ENDPOINTS } from './core/api/apis_endpoints/endpoints';
import * as config from './core/config';
import { Singleton } from './core/Singleton/Singleton';
import { csrf } from './core/utils/undefined-routes-logic';

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
                                const CLIENT                        = Singleton.getConstants().HTTPS_STATUS.CLIENT_ERRORS;
                                const SERVER                        = Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS;
                                const UNOFFICIAL_CODES              = Singleton.getConstants().HTTPS_STATUS.UNOFFICIAL_CODES;
                                const INTERNET_INFORMATION_SERVICES = Singleton.getConstants().HTTPS_STATUS.INTERNET_INFORMATION_SERVICES;
                                req.origin = req.headers.origin || req.get('origin');
                                err.statusCode = err.statusCode ? err.statusCode : 500;
                                
                                // @ts-ignore
                                switch (err.statusCode) {
                                    //***************************************\\
                                    //*************CLIENT ERRORS*************\\
                                    //***************************************\\
                                    case CLIENT.BAD_REQUEST:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.BAD_REQUEST, message: 'Bad Request'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '',
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.BAD_REQUEST,
                                            status_title: "Bad Request",
                                            status_description: `Wondering from where have you requested this url, but you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    case CLIENT.UNAUTHORIZED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.UNAUTHORIZED, message: 'Not authorized!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.UNAUTHORIZED,
                                            status_title: "Not authorized!",
                                            status_description: `The requested page requires an authentication. But you can click the button below
                                            to go login page.`,
                                            url: '/login',
                                            label: 'Go Login'
                                        });
                                        break;
                                    case CLIENT.PAYMENT_REQUIRED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.PAYMENT_REQUIRED, message: 'Payment Error, please try again!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.PAYMENT_REQUIRED,
                                            status_title: "Payment Error, please try again!",
                                            status_description: `Unexpected error happened while processing the payment . But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.FORBIDDEN:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.FORBIDDEN, message: 'Access forbidden!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.FORBIDDEN,
                                            status_title: "Access forbidden!",
                                            status_description: `Access forbidden!, please make sure you are not altering or manipulating any dom elements, but you can go back to homepage`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.METHOD_NOT_ALLOWED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.METHOD_NOT_ALLOWED, message: 'Method Not Allowed!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.METHOD_NOT_ALLOWED,
                                            status_title: "Method Not Allowed!",
                                            status_description: `Method Not Allowed!, we don't know how you ended up in here, but you can go back to the homepage`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.SITE_NOT_FOUND:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.SITE_NOT_FOUND, message: 'Site Not Found!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.SITE_NOT_FOUND,
                                            status_title: "UH OH! You're lost.",
                                            status_description: `The page you are looking for does not exist.
                                            How you got here is a mystery. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    case CLIENT.NOT_ACCEPTABLE:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.NOT_ACCEPTABLE, message: 'Not acceptable!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.NOT_ACCEPTABLE,
                                            status_title: "Not acceptable!",
                                            status_description: `Not acceptable!.
                                            How you got here is a mystery. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.PROXY_AUTHENTICATION_REQUIRED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.PROXY_AUTHENTICATION_REQUIRED, message: 'Proxy authentication required!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.PROXY_AUTHENTICATION_REQUIRED,
                                            status_title: "Proxy authentication required!",
                                            status_description: `The page you are looking for needs authentication from a proxy!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.REQUEST_TIMEOUT:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.REQUEST_TIMEOUT, message: 'Request timeout!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.REQUEST_TIMEOUT,
                                            status_title: "Request timeout!",
                                            status_description: `The page you are looking for has been timed out!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.CONFLICT:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.CONFLICT, message: 'Conflict!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.CONFLICT,
                                            status_title: "Conflict!",
                                            status_description: `The page you are looking for has a conflict with other resource!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.GONE:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.GONE, message: 'Gone!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.GONE,
                                            status_title: "Gone!",
                                            status_description: `Gone response!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.LENGTH_REQUIRED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.LENGTH_REQUIRED, message: 'Length required!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.LENGTH_REQUIRED,
                                            status_title: "Length required!",
                                            status_description: `Length required!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.PRECONDITION_FAILED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.PRECONDITION_FAILED, message: 'Precondition failed!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.PRECONDITION_FAILED,
                                            status_title: "Precondition failed!",
                                            status_description: `Precondition failed!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.PAYLOAD_TOO_LARGE:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.PAYLOAD_TOO_LARGE, message: 'Payload too large!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.PAYLOAD_TOO_LARGE,
                                            status_title: "Payload too large!",
                                            status_description: `Payload too large!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.URI_TOO_LONG:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.URI_TOO_LONG, message: 'URI too long!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.URI_TOO_LONG,
                                            status_title: "URI too long!",
                                            status_description: `URI too long!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.UNSUPPORTED_MEDIA_TYPE:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.UNSUPPORTED_MEDIA_TYPE, message: 'Unsupported media type!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.UNSUPPORTED_MEDIA_TYPE,
                                            status_title: "Unsupported media type!",
                                            status_description: `Unsupported media type!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.RANGE_NOT_SATISFIABLE:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.RANGE_NOT_SATISFIABLE, message: 'Range not satisfiable!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.RANGE_NOT_SATISFIABLE,
                                            status_title: "Range not satisfiable!",
                                            status_description: `Range not satisfiable!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.EXPECTATION_FAILED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.EXPECTATION_FAILED, message: 'Expectation failed!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.EXPECTATION_FAILED,
                                            status_title: "Expectation failed!",
                                            status_description: `Expectation failed!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                        break;
                                    case CLIENT.IM_A_TEAPOT:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.IM_A_TEAPOT, message: "I'm a TEAPOT!"});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.IM_A_TEAPOT,
                                            status_title: "I'm a TEAPOT!",
                                            status_description: `I'm a TEAPOT!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    case CLIENT.MISDIRECTED_REQUEST:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.MISDIRECTED_REQUEST, message: 'Misdirected request!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.MISDIRECTED_REQUEST,
                                            status_title: 'Misdirected request!',
                                            status_description: `Misdirected request!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    case CLIENT.UNPROCESSABLE_ENTITY:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.UNPROCESSABLE_ENTITY, message: 'Wrong input!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.UNPROCESSABLE_ENTITY,
                                            status_title: 'Wrong input!',
                                            status_description: `Wrong input!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    case CLIENT.LOCKED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.LOCKED, message: 'Request is locked!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.LOCKED,
                                            status_title: 'Request is locked!',
                                            status_description: `Request is locked!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    case CLIENT.FAILED_DEPENDENCY:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.FAILED_DEPENDENCY, message: 'Failed dependency!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.FAILED_DEPENDENCY,
                                            status_title: 'Failed dependency!',
                                            status_description: `Failed dependency!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    case CLIENT.TOO_EARLY:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.TOO_EARLY, message: 'Too early!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.TOO_EARLY,
                                            status_title: 'Too early!',
                                            status_description: `Too early!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    case CLIENT.UPGRADE_REQUIRED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.UPGRADE_REQUIRED, message: 'Upgrade required!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.UPGRADE_REQUIRED,
                                            status_title: 'Upgrade required!',
                                            status_description: `Upgrade required!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    case CLIENT.PRECONDITION_REQUIRED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.PRECONDITION_REQUIRED, message: 'Precondition required!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.PRECONDITION_REQUIRED,
                                            status_title: 'Precondition required!',
                                            status_description: `Precondition required!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    case CLIENT.TOO_MANY_REQUESTS:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.TOO_MANY_REQUESTS, message: 'Too many requests!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.TOO_MANY_REQUESTS,
                                            status_title: 'Too many requests!',
                                            status_description: `Too many requests!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    case CLIENT.REQUEST_HEADER_FIELDS_TOO_LARGE:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.REQUEST_HEADER_FIELDS_TOO_LARGE, message: 'Request header fields too large!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.REQUEST_HEADER_FIELDS_TOO_LARGE,
                                            status_title: 'Request header fields too large!',
                                            status_description: `Request header fields too large!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    case CLIENT.UNAVAILABLE_FOR_LEGAL_REASONS:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: CLIENT.UNAVAILABLE_FOR_LEGAL_REASONS, message: 'Unavailable for legal reasons!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: CLIENT.UNAVAILABLE_FOR_LEGAL_REASONS,
                                            status_title: 'Unavailable for legal reasons!',
                                            status_description: `Unavailable for legal reasons!. But you can click the button below
                                            to go back to the homepage.`,
                                            url: '/',
                                            label: 'Home'
                                        });
                                    break;
                                    
                                    //***************************************\\
                                    //*************SERVER ERRORS*************\\
                                    //***************************************\\
                                    case SERVER.INTERNAL_SERVER_ERROR:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: SERVER.INTERNAL_SERVER_ERROR, message: 'Internal Server Error!'});
                                            }
                                        });

                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: SERVER.INTERNAL_SERVER_ERROR,
                                            status_title: "Unexpected error",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case SERVER.NOT_IMPLEMENTED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: SERVER.NOT_IMPLEMENTED, message: 'Not implemented Error!'});
                                            }
                                        });

                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: SERVER.NOT_IMPLEMENTED,
                                            status_title: "Not implemented Error!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case SERVER.BAD_GATEWAY:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: SERVER.BAD_GATEWAY, message: 'Bad Gateway Error!'});
                                            }
                                        });

                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: SERVER.BAD_GATEWAY,
                                            status_title: "Bad Gateway Error!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case SERVER.SERVICE_UNAVAILABLE:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: SERVER.SERVICE_UNAVAILABLE, message: 'Service is not available!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: SERVER.SERVICE_UNAVAILABLE,
                                            status_title: "Service is not available!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case SERVER.GATEWAY_TIMEOUT:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: SERVER.GATEWAY_TIMEOUT, message: 'Gateway timeout!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: SERVER.GATEWAY_TIMEOUT,
                                            status_title: "Gateway timeout!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case SERVER.HTTP_VERSION_NOT_SUPPORTED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: SERVER.HTTP_VERSION_NOT_SUPPORTED, message: 'Http version not supported!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: SERVER.HTTP_VERSION_NOT_SUPPORTED,
                                            status_title: "Http version not supported!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case SERVER.VARIANT_ALSO_NEGOTIATES:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: SERVER.VARIANT_ALSO_NEGOTIATES, message: 'Variant also negotiates!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: SERVER.VARIANT_ALSO_NEGOTIATES,
                                            status_title: "Variant also negotiates!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case SERVER.INSUFFICIENT_STORAGE:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: SERVER.INSUFFICIENT_STORAGE, message: 'Insufficient storage!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: SERVER.INSUFFICIENT_STORAGE,
                                            status_title: "Insufficient storage!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case SERVER.LOOP_DETECTED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: SERVER.LOOP_DETECTED, message: 'Loop detected!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: SERVER.LOOP_DETECTED,
                                            status_title: "Loop detected!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case SERVER.NOT_EXTENDED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: SERVER.NOT_EXTENDED, message: 'Not extended!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: SERVER.NOT_EXTENDED,
                                            status_title: "Not extended!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case SERVER.NETWORK_AUTHENTICATION_REQUIRED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: SERVER.NETWORK_AUTHENTICATION_REQUIRED, message: 'Network authentication required!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: SERVER.NETWORK_AUTHENTICATION_REQUIRED,
                                            status_title: "Network authentication required!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    //***************************************\\
                                    //*************COMMON ERRORS*************\\
                                    //***************************************\\
                                    case UNOFFICIAL_CODES.PAGE_EXPIRED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: UNOFFICIAL_CODES.PAGE_EXPIRED, message: 'Page expired!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: UNOFFICIAL_CODES.PAGE_EXPIRED,
                                            status_title: "Page expired!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case UNOFFICIAL_CODES.METHOD_FAILURE:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: UNOFFICIAL_CODES.METHOD_FAILURE, message: 'Method failure!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: UNOFFICIAL_CODES.METHOD_FAILURE,
                                            status_title: "Method failure!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case UNOFFICIAL_CODES.ENHANCE_YOUR_CALM:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: UNOFFICIAL_CODES.ENHANCE_YOUR_CALM, message: 'Enhance your calm!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: UNOFFICIAL_CODES.ENHANCE_YOUR_CALM,
                                            status_title: "Enhance your calm!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case UNOFFICIAL_CODES.REQUEST_HEADER_FIELDS_TOO_LARGE:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: UNOFFICIAL_CODES.REQUEST_HEADER_FIELDS_TOO_LARGE, message: 'Request header fields too large!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: UNOFFICIAL_CODES.REQUEST_HEADER_FIELDS_TOO_LARGE,
                                            status_title: "Request header fields too large!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case UNOFFICIAL_CODES.BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: UNOFFICIAL_CODES.BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS, message: 'Blocked by windows parental controls!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: UNOFFICIAL_CODES.BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS,
                                            status_title: "Blocked by windows parental controls!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case UNOFFICIAL_CODES.INVALID_TOKEN:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: UNOFFICIAL_CODES.INVALID_TOKEN, message: 'Invalid token!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: UNOFFICIAL_CODES.INVALID_TOKEN,
                                            status_title: "Invalid token!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case UNOFFICIAL_CODES.TOKEN_REQUIRED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: UNOFFICIAL_CODES.TOKEN_REQUIRED, message: 'Token required!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: UNOFFICIAL_CODES.TOKEN_REQUIRED,
                                            status_title: "Token required!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case UNOFFICIAL_CODES.BANDWIDTH_LIMIT_EXCEEDED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: UNOFFICIAL_CODES.BANDWIDTH_LIMIT_EXCEEDED, message: 'Bandwidth limit exceeded!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: UNOFFICIAL_CODES.BANDWIDTH_LIMIT_EXCEEDED,
                                            status_title: "Bandwidth limit exceeded!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case UNOFFICIAL_CODES.SITE_IS_OVERLOADED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: UNOFFICIAL_CODES.SITE_IS_OVERLOADED, message: 'Site is overloaded!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: UNOFFICIAL_CODES.SITE_IS_OVERLOADED,
                                            status_title: "Site is overloaded!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case UNOFFICIAL_CODES.SITE_IS_FROZEN:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: UNOFFICIAL_CODES.SITE_IS_FROZEN, message: 'Site is frozen!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: UNOFFICIAL_CODES.SITE_IS_FROZEN,
                                            status_title: "Site is frozen!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case UNOFFICIAL_CODES.NETWORK_READ_TIMEOUT_ERROR:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: UNOFFICIAL_CODES.NETWORK_READ_TIMEOUT_ERROR, message: 'Network read timeout error!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: UNOFFICIAL_CODES.NETWORK_READ_TIMEOUT_ERROR,
                                            status_title: "Network read timeout error!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case UNOFFICIAL_CODES.NETWORK_CONNECT_TIMEOUT_ERROR:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: UNOFFICIAL_CODES.NETWORK_CONNECT_TIMEOUT_ERROR, message: 'Network connect timeout error!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '', 
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: UNOFFICIAL_CODES.NETWORK_CONNECT_TIMEOUT_ERROR,
                                            status_title: "Network connect timeout error!",
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    //**************************************************************\\
                                    //*************INTERNET INFORMATION SERVICES ERRORS*************\\
                                    //**************************************************************\\
                                    case INTERNET_INFORMATION_SERVICES.LOGIN_TIME_OUT:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: INTERNET_INFORMATION_SERVICES.LOGIN_TIME_OUT, message: 'Login time out!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '',
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: INTERNET_INFORMATION_SERVICES.LOGIN_TIME_OUT,
                                            status_title: 'Login time out!',
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case INTERNET_INFORMATION_SERVICES.NGINX.NO_RESPONSE:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: INTERNET_INFORMATION_SERVICES.NGINX.NO_RESPONSE, message: 'No response from nginx!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '',
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: INTERNET_INFORMATION_SERVICES.NGINX.NO_RESPONSE,
                                            status_title: 'No response from nginx!',
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case INTERNET_INFORMATION_SERVICES.NGINX.REQUEST_HEADER_TOO_LARGE:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: INTERNET_INFORMATION_SERVICES.NGINX.REQUEST_HEADER_TOO_LARGE, message: 'Request header too large!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '',
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: INTERNET_INFORMATION_SERVICES.NGINX.REQUEST_HEADER_TOO_LARGE,
                                            status_title: 'Request header too large!',
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case INTERNET_INFORMATION_SERVICES.NGINX.SSL_CERTIFICATE_ERROR:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: INTERNET_INFORMATION_SERVICES.NGINX.SSL_CERTIFICATE_ERROR, message: 'Ssl certificate error!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '',
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: INTERNET_INFORMATION_SERVICES.NGINX.SSL_CERTIFICATE_ERROR,
                                            status_title: 'Ssl certificate error!',
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case INTERNET_INFORMATION_SERVICES.NGINX.SSL_CERTIFICATE_REQUIRED:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: INTERNET_INFORMATION_SERVICES.NGINX.SSL_CERTIFICATE_REQUIRED, message: 'Ssl certificate required!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '',
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: INTERNET_INFORMATION_SERVICES.NGINX.SSL_CERTIFICATE_REQUIRED,
                                            status_title: 'Ssl certificate required!',
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case INTERNET_INFORMATION_SERVICES.NGINX.HTTP_REQUEST_SENT_TO_HTTPS_PORT:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: INTERNET_INFORMATION_SERVICES.NGINX.HTTP_REQUEST_SENT_TO_HTTPS_PORT, message: 'Http request sent to https port!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '',
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: INTERNET_INFORMATION_SERVICES.NGINX.HTTP_REQUEST_SENT_TO_HTTPS_PORT,
                                            status_title: 'Http request sent to https port!',
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                        });
                                    break;
                                    case INTERNET_INFORMATION_SERVICES.NGINX.CLIENT_CLOSED_REQUEST:
                                        ENDPOINTS.forEach((endpoint: any) => {
                                            if (ENDPOINTS.includes(req.headers.referer || '')
                                            || ENDPOINTS.includes(req.originalUrl || '')
                                            || ENDPOINTS.includes(req.url || '')) {
                                                return res.status(_status).json({statusCode: INTERNET_INFORMATION_SERVICES.NGINX.CLIENT_CLOSED_REQUEST, message: 'Client closed request!'});
                                            }
                                        });
                                        
                                        return res.status(_status)
                                        .render('undefined_routes', {
                                            nav_title: '',
                                            path: '/undefined_routes/',
                                            is_authenticated: res?.req?.session?.is_authenticated,
                                            error:   null,
                                            warning: null,
                                            success: null,
                                            status_code: INTERNET_INFORMATION_SERVICES.NGINX.CLIENT_CLOSED_REQUEST,
                                            status_title: 'Client closed request!',
                                            status_description: this.__.capitalize(err.message || 'Please contact the support team!') || `Please contact the support team!`,
                                            url: !err.message ? `mailto:${config.configurations().support_team_email}` : '/',
                                            label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
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
                                path: '/undefined_routes/',
                                is_authenticated: res?.req?.session?.is_authenticated,
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
                                    is_authenticated: res?.req?.session?.is_authenticated,
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
                                is_authenticated: res?.req?.session?.is_authenticated,
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
                                is_authenticated: res?.req?.session?.is_authenticated,
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
                                is_authenticated: res?.req?.session?.is_authenticated,
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