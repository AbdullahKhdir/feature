'use strict';
/*
* Npm and Node Modules 
*/
import Compression from 'compression';
import ConnectFlash from 'connect-flash';
import CookieParser from 'cookie-parser';
import Cors from "cors";
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
import { toast } from './middlewares/toast';

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
    private app;
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
        * Using package compressor
        */
        this.app.use(Compression());

        /*
        * Sets the following policies
          ! contentSecurityPolicy
          ! crossOriginEmbedderPolicy
          ! crossOriginOpenerPolicy
          ! crossOriginResourcePolicy
          ! dnsPrefetchControl
          ! expectCt
          ! frameguard
          ! hidePoweredBy
          ! hsts
          ! ieNoOpen 
          ! noSniff
          ! originAgentCluster 
          ! permittedCrossDomainPolicies
          ! referrerPolicy
          ! xssFilter
        */
        // this.app.use(Helmet.contentSecurityPolicy({
        //     // useDefaults: true,
        //     directives: {
        //         "img-src": ["'self'", "data: https:"],
        //         frameAncestors: ["'none'"],
        //     }
        // }));
        this.app.use(Helmet.crossOriginEmbedderPolicy());
        this.app.use(Helmet.crossOriginOpenerPolicy());
        this.app.use(Helmet.crossOriginResourcePolicy());
        this.app.use(Helmet.dnsPrefetchControl());
        this.app.use(Helmet.expectCt());
        this.app.use(Helmet.frameguard({
            action: "deny"
        }));
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
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            if (req.method == this.constants.REQUEST.TYPE.GET) {
                if (typeof req.session !== 'undefined') {
                    if (typeof req.session.is_authenticated !== 'undefined') {
                        if (req.session.is_authenticated === true) {
                            res.set('Cache-Control', 'private, no-cache, must-revalidate');
                            return next();
                        }
                    }
                }
                res.set('Cache-Control', 'public, no-cache, must-revalidate');
            } else {
                res.set('Cache-Control', 'no-store');
            }
            next();
        });

        /*
        * Enable Logger
        */
        this.app.use(
            Morgan(
                'combined', 
                {
                    stream: this.file_system.createWriteStream(this.path.join(__dirname, '..' ,'access.log'), { flags: 'a' }),
                    skip: (req, res) => res.statusCode <= this.constants.HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST
                }
            )
        );

        /*
        * CORS Configurations
        */
        const allowedOrigins = ['https://localhost:8010'];

        const cors_options: Cors.CorsOptions = {
            origin: allowedOrigins,
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        };
        this.app.use(this.express.express_cors(cors_options));

        /*
        * Middleware To Set Static Public Folder
        */
        const options = {
            dotfiles: 'ignore',
            etag: true,
            extensions: ['ejs'],
            fallthrough: true,
            immutable: true,
            index: false,
            maxAge: '1d',
            redirect: false,
            setHeaders: function (res: any, path: any, stat: any) {
                res.set('x-timestamp', Date.now())
            }
        }
        
        this.app.use(this.express.getExpress.static(this.path.join(__dirname, '..', 'app', 'public'), options));
        
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
        * Parse JSON-BODY or ANY DATA TYPE Requests
        */
        this.app.use(this.body_parser.json());
        this.app.use(this.body_parser.urlencoded({extended: true}));

        /*
        * Middleware To Initiate Mysql Session
        */
        const secret = Crypto.randomBytes(48).toString('base64');
        const key    = Crypto.randomBytes(48).toString('base64');
        this.app.use(this.session({
            secret:            secret,
            store:             Singleton.getDb().initiateSession(),
            resave:            false,
            saveUninitialized: false,
            cookie: {
                maxAge:        this.constants.SESSION.DB_CONNECTION_SESSION_TIME_OUT,
                secure:        true,
                httpOnly:      true
            }
        }));

        /*
        * CSRF Enabled
        */
        this.app.use(Csrf({
            sessionKey:    this.constants.CSRF.sessionKey,
            cookie:        this.constants.CSRF.cookie,
            ignoreMethods: this.constants.CSRF.ignoreMethods,
        }));

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
            const token = req.csrfToken();
            // res.set({
            //     'csrf-Token':   token,
            //     'X-CSRF-TOKEN': token,
            //     'xsrf-token':   token,
            //     'x-csrf-token': token,
            //     'x-xsrf-token': token
            // });
            res.locals['csrf'] = token;
            res.locals['is_authenticated'] = res.req.session.is_authenticated;
            this.app.locals['is_authenticated'] = res.req.session.is_authenticated;
            next();
        });

        /*
        * Middleware for saving cookie in the request
        */
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            req.user_cookie = key;
            next();
        });

        /*
        * Middleware for rendering 404 page on invalid csrf token
        */
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            if (err.code === this.constants.CSRF.errCode) {
                this.invalidCsrfResponse(res);
            }
            if (err.code !== this.constants.CSRF.errCode)  {
                return next(err);
            }
        })
        
        /*
        * Middleware populating file or files attribute on file upload
        */
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const upload_object = req.getFormPostedData('upload_object');
            // todo: identifier for req.file and req.files
            if (!this.__.isEmpty(upload_object)) {
                req.file = JSON.parse(upload_object);
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
        * Passing default and helpful properties to all templates
        ? lasts for the life cycle of the application 
        */
        this.app.locals = Object.assign(this.app.locals, Locals);
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