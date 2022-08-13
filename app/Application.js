'use strict';
/*
* Npm and Node Modules 
*/
const Bodyparser      = require('../core/node/Bodyparser.js');
const Path            = require('../core/node/Path.js');
const BaseController  = require('../core/controller/BaseController.js');
const Constants       = require('./utils/Constants.js');
const Lodash          = require('./utils/Lodash.js');
const Helmet          = require('helmet');
const BadRequestError = require('../core/error/types/BadRequestError.js');
const { environment } = require('../core/config');
const Morgan          = require('morgan');
const FileSystem      = require('../core/node/FileSystem.js');
const { _locals }     = require('../core/utils/AppLocals.js');
const crypto          = require('crypto');
const csrf            = require('csurf')
const flash           = require('connect-flash');

/**
 * @class Application
 * @constructor
 * @extends BaseController
 * @description Class Application is used to configure the application and set the main rules of the express server
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Application extends BaseController {

    #app;
    constructor(app) {
        super();

        if (typeof this.#app !== 'undefined') {
            return this.getApp();
        }
        
        this.body_parser    = new Bodyparser().body_parse;
        this.path           = new Path().path;
        this.constants      = Object.assign(new Constants().getConstants());
        this.sub_controller = this;
        this.__             = new Lodash().__;
        this.session        = this.express_session;
        this.file_system    = new FileSystem().fs;

        /*
        * Init The Application
        */
        app = this.express();
        
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
        app.use(Helmet.contentSecurityPolicy());
        app.use(Helmet.crossOriginEmbedderPolicy());
        app.use(Helmet.crossOriginOpenerPolicy());
        app.use(Helmet.crossOriginResourcePolicy());
        app.use(Helmet.dnsPrefetchControl());
        app.use(Helmet.expectCt());
        app.use(Helmet.frameguard());
        app.use(Helmet.hidePoweredBy());
        app.use(Helmet.hsts());
        app.use(Helmet.ieNoOpen());
        app.use(Helmet.noSniff());
        app.use(Helmet.originAgentCluster());
        app.use(Helmet.permittedCrossDomainPolicies());
        app.use(Helmet.referrerPolicy());
        app.use(Helmet.xssFilter());

        /*
        * Enable Logger
        */
        app.use(
            Morgan(
                'combined', 
                {
                    stream: this.file_system.createWriteStream(this.path.join(__dirname, '..' ,'access.log'), { flags: 'a' }),
                    skip: (req, res) => res.statusCode <= this.constants.HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST
                }
            )
        );

        /*
        * DISABLE CORS
        */
        const corsOptions = {
            origin: false,
        }

        app.use(this.cors(corsOptions));

        /*
        * AUTO ESCAPE JSON
        */
        app.set('json escape', true);
       
        /*
        * USE EJS TEMPLATE ENGINE (NODE SUPPORTS TWIG)
        */
        app.set('view engine', 'ejs');

        /*
        * Specify the templates folder of the view property in express 
        */
        app.set('views', 'app/views');

        /*
        * Parse JSON-BODY or ANY DATA TYPE Requests
        */
        app.use(this.body_parser.json());
        app.use(this.body_parser.urlencoded({extended: true}));        

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
            setHeaders: function (res, path, stat) {
                res.set('x-timestamp', Date.now())
            }
        }
        app.use(this.express.static(this.path.join(__dirname, 'public'), options));

        /*
        * Middleware To Initiate Mysql Session
        */
        const secret = crypto.randomBytes(48).toString('base64');
        const key    = crypto.randomBytes(48).toString('base64');
        app.use(this.session({
            key:               key,
            secret:            secret,
            store:             this.initiateSession(),
            resave:            false,
            saveUninitialized: false,
            cookie: {
                _expires:      this.constants.SESSION.DB_CONNECTION_SESSION_TIME_OUT,
                maxAge:        this.constants.SESSION.DB_CONNECTION_SESSION_TIME_OUT,
                secure:        environment === 'production' ? true : false,
                httpOnly:      true,
            }
        }));

        /*
        * CSRF Enabled
        */
        app.use(csrf());

        /*
         * Registering Flash
        */
        app.use(flash());

        app.use((req, res, next) => {
            res.locals.csrf = req.csrfToken();
            res.locals.is_authenticated = res.req.session.is_authenticated;
            next();
        });

        /*
        * Middleware for saving cookie in the request
        */
        app.use((req, res, next) => {
            req.user_cookie = key;
            next();
        });
        
        /*
        * Routes 
        */
        app.set('case sensitive routing', false);
        app.set('strict routing', false);
        this.sub_controller.deployRoutes(app);
        
        /*
        * Passing default and helpful properties to all templates
        ? lasts for the life cycle of the application 
        */
        app.locals = Object.assign(app.locals, _locals);
        this.#app = app;
    }

    /**
     * @function getApp
     * @description  gets an instance of the application class
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @return Application Object
     */
    getApp() {
        return this.#app;
    }
}



