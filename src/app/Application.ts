'use strict';
/*
* Npm and Node Modules 
*/
import Compression from 'compression';
import ConnectFlash from 'connect-flash';
import CookieParser from 'cookie-parser';
import Crypto from 'crypto';
import Csrf from 'csurf';
import { Express, NextFunction, Request, Response } from 'express';
import Helmet from 'helmet';
import Morgan from 'morgan';
import BaseController from '../core/controller/BaseController.js';
import ExpressSession from '../core/framework/ExpressSession.js';
import { Singleton } from '../core/Singleton/Singleton.js';
import Locals from '../core/utils/AppLocals.js';
import { reqUtil } from './middlewares/request_utilities';
import cache_control from '../core/middlewares/cache_control';
import { toast } from './middlewares/toast';
import morgan_logger from '../core/middlewares/morgan_logger.js';
import { ENDPOINTS } from '../core/api/apis_endpoints/endpoints.js';

/**
 * @class Application
 * @constructor
 * @extends BaseController
 * @description Class Application is used to configure the application and set the main rules of the express server
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Application extends BaseController {
    
    private static application_instance: Application;
    private body_parser;
    private session;
    private sub_controller;
    protected app;
    private constructor() {
        super();

        /*
        * Init The Application
        */
       this.app            = this.express.getExpress();
       this.body_parser    = Singleton.getBodyParser();
       this.path           = Singleton.getPath();
       this.sub_controller = this;
       this.session        = ExpressSession.getExpressSession

        /*
        * Sets the following policies
          ? contentSecurityPolicy
          ? crossOriginEmbedderPolicy
          ? crossOriginOpenerPolicy
          ? crossOriginResourcePolicy
          ? dnsPrefetchControl
          ? expectCt
          ? frameguard
          ? hidePoweredBy
          ? hsts
          ? ieNoOpen 
          ? noSniff
          ? originAgentCluster 
          ? permittedCrossDomainPolicies
          ? referrerPolicy
          ? xssFilter
        */
        this.app.use(Helmet.contentSecurityPolicy(this.constants.CONTENT_SECURITY_POLICY));
        this.app.use(Helmet.crossOriginEmbedderPolicy());
        this.app.use(Helmet.crossOriginOpenerPolicy());
        this.app.use(Helmet.crossOriginResourcePolicy());
        this.app.use(Helmet.dnsPrefetchControl());
        this.app.use(Helmet.expectCt());
        this.app.use(Helmet.frameguard(this.constants.FRAME_GUARD));
        this.app.use(Helmet.hidePoweredBy());
        this.app.use(Helmet.hsts());
        this.app.use(Helmet.ieNoOpen());
        this.app.use(Helmet.noSniff());
        this.app.use(Helmet.originAgentCluster());
        this.app.use(Helmet.permittedCrossDomainPolicies());
        this.app.use(Helmet.referrerPolicy());
        this.app.use(Helmet.xssFilter());
        
        /*
        * Setting Cache-Control Header
        */
        this.app.use(cache_control);

        /*
        * Enable Logger
        */
        this.app.use(morgan_logger);

        /*
        * To allow preflight requests on all http(s) methods*\
        */
        this.app.options('*', this.express.express_cors());
        
        /*
        * CORS Configurations
        */
        this.app.use(this.express.express_cors(this.constants.CORS.CORS_OPTIONS));

        /*
        * Middleware To Set Static Public Folder
        */
        this.app.use(
            this.express.getExpress.static(
                this.path.join(__dirname, '..', 'app', 'public'),
                this.constants.EXPRESS.STATIC_OPTIONS
            )
        );
        
        /*
        * AUTO ESCAPE JSON
        */
        this.app.set('json escape', true);
       
        /*
        * REGISTER COOKIE PARSER
        */
        this.app.use(CookieParser());
        
        /*
        * USE EJS TEMPLATE ENGINE (NODE SUPPORTS TWIG)
        */
        this.app.set('view engine', 'ejs');

        /*
        * Specify the templates folder of the view property in express 
        */
        this.app.set('views', this.path.join(__dirname, 'views'));

        /*
        * Parse JSON-BODY (API) or ANY DATA TYPE Requests
        */
        this.app.use(this.body_parser.json());
        this.app.use(this.body_parser.urlencoded({extended: true}));

        /*
        * Middleware To Initiate Mysql Session
        */
        const secret = Crypto.randomBytes(48).toString('base64');
        this.app.use(
            this.session(
                Object.assign(
                    this.constants.EXPRESS.SESSION_OPTIONS, 
                    {
                        secret:            secret,
                        store:             Singleton.getDb().initiateSession(),        
                    }
                )
            )
        );

        /*
        * CSRF Enabled
        */
        var CSRF = Csrf({
            sessionKey:    this.constants.CSRF.sessionKey,
            cookie:        this.constants.CSRF.cookie,
            ignoreMethods: this.constants.CSRF.ignoreMethods,
        });

        //? Deploying API's endpoints and bypass csrf on requesting these endpoints ?\\
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            if (ENDPOINTS.includes(req.headers.referer || '')
             || ENDPOINTS.includes(req.originalUrl || '')
             || ENDPOINTS.includes(req.url || '')) {
                return next();
            }
            CSRF(req, res, next);
        });

        /*
        * Using package compressor
        */
        this.app.use(Compression());

        /*
        * Registering Flash
        */
        this.app.use(ConnectFlash());
        
        /*
        * Registering error, warning and success toaster to every template
        */
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            toast(req, res, next, this.app);
            next();
        });

        /*
        * Middleware for editing and wrapping 
        * query params, 
        * post data and 
        * getting data to templates after getting or posting
        */
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            reqUtil(req, res, next);
            next();
        });

        /*
        * Send csrf token on every request along with the authentication status
        */
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const token = typeof req.csrfToken === 'function' ? req.csrfToken() : '';
            // res.set({
            //     'csrf-Token':   token,
            //     'X-CSRF-TOKEN': token,
            //     'xsrf-token':   token,
            //     'x-csrf-token': token,
            //     'x-xsrf-token': token
            // });
            res.locals['csrf']                  = token;
            this.app.locals['csrf']             = token;
            res.locals['is_authenticated']      = res.req.session.is_authenticated;
            this.app.locals['is_authenticated'] = res.req.session.is_authenticated;
            next();
        });

        /*
        * Middleware for saving cookie in the request
        */
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const key       = Crypto.randomBytes(48).toString('base64');
            req.user_cookie = key;
            next();
        });
        
        /*
        * Middleware populating file or files attribute on file upload's request
        */
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            if (req.isPost()) {
                var upload_object = req.getFormPostedData('upload_object');
                var upload_id     = req.getFormPostedData('upload-input-name');
                if (!this.__.isEmpty(upload_object) && !this.__.isEmpty(upload_id)) {
                    upload_object = upload_object.replaceAll("'", '"');
                    if (upload_id.includes(',')) {
                        upload_id     = upload_id.split(',')[1];
                    }
                    if (upload_object.startsWith('[')) {
                        upload_object = `{ "${upload_id}" : ${upload_object}`;
                        upload_object = `${upload_object} }`;
                        req.files = JSON.parse(upload_object);
                    } else {
                        req.file = JSON.parse(upload_object);
                    }
                }
            }
            next();
        });

        
        /*
        * Routes 
        */
        this.app.set('case sensitive routing', false);
        this.app.set('strict routing', false);
        // @ts-ignore
        this.sub_controller.deployRoutes(this.app);        
        
        /*
        * Deploying api's endpoints
        */
        // @ts-ignore
        Singleton.getApis().deployApi(this.app);
        
        /*
        * Passing default and helpful properties to all templates
        ? lasts for the life cycle of the application 
        */
        this.app.locals = Object.assign(this.app.locals, Locals);

        /*
        * Middleware for rendering 404 page on invalid csrf token
        */
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            // todo separated invalid csrf page
            // todo separated 404 page
            // todo separated exceptions page (only during development)
            // todo separated errors page (for dev and prod environments)
            if (err.code === this.constants.CSRF.errCode) {
                return this.invalidCsrfResponse(req, res);
            }
            next(err);
        })
    }

    /**
     * @function getApp
     * @description  Getter that gets an instance of the application class
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @return Application Object
    */
    static get getAppInstance() : Application {
        if (this.application_instance) {
            return this.application_instance;
        }
        return this.application_instance = new Application();
    }

    get getActiveExpress() : Express {
        return this.app;
    }
}