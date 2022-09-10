'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/*
* Npm and Node Modules
*/
var compression_1 = __importDefault(require("compression"));
var connect_flash_1 = __importDefault(require("connect-flash"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var crypto_1 = __importDefault(require("crypto"));
var csurf_1 = __importDefault(require("csurf"));
var morgan_1 = __importDefault(require("morgan"));
var BaseController_js_1 = __importDefault(require("../core/controller/BaseController.js"));
var ExpressSession_js_1 = __importDefault(require("../core/framework/ExpressSession.js"));
var Singleton_js_1 = require("../core/Singleton/Singleton.js");
var AppLocals_js_1 = __importDefault(require("../core/utils/AppLocals.js"));
var request_utilities_1 = require("./middlewares/request_utilities");
var toast_1 = require("./middlewares/toast");
module.exports = /** @class */ (function (_super) {
    __extends(Application, _super);
    function Application() {
        var _this = _super.call(this) || this;
        /*
        * Init The Application
        */
        _this.app = _this.express.getExpress();
        _this.body_parser = Singleton_js_1.Singleton.getBodyParser();
        _this.path = Singleton_js_1.Singleton.getPath();
        _this.sub_controller = _this;
        _this.session = ExpressSession_js_1.default.getExpressSession;
        /*
        * Using package compressor
        */
        _this.app.use((0, compression_1.default)());
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
        // TODO: add exception for leage events emitter filename: init_ws.js
        // this.app.use(Helmet.contentSecurityPolicy({
        //     directives: {
        //         frameAncestors: ["'none'"]
        //     }
        // }));
        // this.app.use(Helmet.crossOriginEmbedderPolicy());
        // this.app.use(Helmet.crossOriginOpenerPolicy());
        // this.app.use(Helmet.crossOriginResourcePolicy());
        // this.app.use(Helmet.dnsPrefetchControl());
        // this.app.use(Helmet.expectCt());
        // this.app.use(Helmet.frameguard({
        //     action: "deny"
        // }));
        // this.app.use(Helmet.hidePoweredBy());
        // this.app.use(Helmet.hsts());
        // this.app.use(Helmet.ieNoOpen());
        // this.app.use(Helmet.noSniff());
        // this.app.use(Helmet.originAgentCluster());
        // this.app.use(Helmet.permittedCrossDomainPolicies());
        // this.app.use(Helmet.referrerPolicy());
        // this.app.use(Helmet.xssFilter());
        /*
        * Setting Cache-Control Header
        */
        _this.app.use(function (req, res, next) {
            if (req.method == _this.constants.REQUEST.TYPE.GET) {
                if (typeof req.session !== 'undefined') {
                    if (typeof req.session.is_authenticated !== 'undefined') {
                        if (req.session.is_authenticated === true) {
                            res.set('Cache-Control', 'private, no-cache, must-revalidate');
                            return next();
                        }
                    }
                }
                res.set('Cache-Control', 'public, no-cache, must-revalidate');
            }
            else {
                res.set('Cache-Control', 'no-store');
            }
            next();
        });
        /*
        * Enable Logger
        */
        _this.app.use((0, morgan_1.default)('combined', {
            stream: _this.file_system.createWriteStream(_this.path.join(__dirname, '..', 'access.log'), { flags: 'a' }),
            skip: function (req, res) { return res.statusCode <= _this.constants.HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST; }
        }));
        /*
        * CORS Configurations
        */
        // Add a list of allowed origins.
        // If you have more origins you would like to add, you can add them to the array below.
        var allowedOrigins = ['https://localhost:8010'];
        var cors_options = {
            origin: allowedOrigins,
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        };
        _this.app.use(_this.express.express_cors(cors_options));
        /*
        * Middleware To Set Static Public Folder
        */
        var options = {
            dotfiles: 'ignore',
            etag: true,
            extensions: ['ejs'],
            fallthrough: true,
            immutable: true,
            index: false,
            maxAge: '1d',
            redirect: false,
            setHeaders: function (res, path, stat) {
                res.set('x-timestamp', Date.now());
            }
        };
        _this.app.use(_this.express.getExpress.static(_this.path.join(__dirname, '..', 'app', 'public'), options));
        /*
        * AUTO ESCAPE JSON
        */
        _this.app.set('json escape', true);
        /*
        * REGISTER COOKIE PARSER
        */
        _this.app.use((0, cookie_parser_1.default)());
        /*
        * USE EJS TEMPLATE ENGINE (NODE SUPPORTS TWIG)
        */
        _this.app.set('view engine', 'ejs');
        /*
        * Specify the templates folder of the view property in express
        */
        _this.app.set('views', _this.path.join(__dirname, 'views'));
        /*
        * Parse JSON-BODY or ANY DATA TYPE Requests
        */
        _this.app.use(_this.body_parser.json());
        _this.app.use(_this.body_parser.urlencoded({ extended: true }));
        /*
        * Middleware To Initiate Mysql Session
        */
        var secret = crypto_1.default.randomBytes(48).toString('base64');
        var key = crypto_1.default.randomBytes(48).toString('base64');
        _this.app.use(_this.session({
            secret: secret,
            store: Singleton_js_1.Singleton.getDb().initiateSession(),
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: _this.constants.SESSION.DB_CONNECTION_SESSION_TIME_OUT,
                secure: true,
                httpOnly: true
            }
        }));
        /*
        * CSRF Enabled
        */
        _this.app.use((0, csurf_1.default)({
            sessionKey: _this.constants.CSRF.sessionKey,
            cookie: _this.constants.CSRF.cookie,
            ignoreMethods: _this.constants.CSRF.ignoreMethods,
        }));
        /*
        * Registering Flash
        */
        _this.app.use((0, connect_flash_1.default)());
        /*
        * Registering error, warning and success toaster to every template
        */
        _this.app.use(function (req, res, next) {
            (0, toast_1.toast)(req, res, next, _this.app);
            next();
        });
        /*
        * Middleware for editing and wrapping
        * query params,
        * post data and
        * getting data to templates after getting or posting
        */
        _this.app.use(function (req, res, next) {
            (0, request_utilities_1.reqUtil)(req, res, next);
            next();
        });
        /*
        * Send csrf token on every request along with the authentication status
        */
        _this.app.use(function (req, res, next) {
            res.locals['csrf'] = req.csrfToken();
            res.locals['is_authenticated'] = res.req.session.is_authenticated;
            _this.app.locals['is_authenticated'] = res.req.session.is_authenticated;
            next();
        });
        /*
        * Middleware for saving cookie in the request
        */
        _this.app.use(function (req, res, next) {
            req.user_cookie = key;
            next();
        });
        /*
        * Middleware for rendering 404 page on invalid csrf token
        */
        _this.app.use(function (err, req, res, next) {
            if (err.code === _this.constants.CSRF.errCode) {
                _this.invalidCsrfResponse(res);
            }
            if (err.code !== _this.constants.CSRF.errCode) {
                return next(err);
            }
        });
        /*
        * Routes
        */
        _this.app.set('case sensitive routing', false);
        _this.app.set('strict routing', false);
        // @ts-ignore
        _this.sub_controller.deployRoutes(_this.app);
        /*
        * Passing default and helpful properties to all templates
        ? lasts for the life cycle of the application
        */
        _this.app.locals = Object.assign(_this.app.locals, AppLocals_js_1.default);
        return _this;
    }
    Object.defineProperty(Application, "getAppInstance", {
        /**
         * @function getApp
         * @description  Getter that gets an instance of the application class
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @return Application Object
        */
        get: function () {
            if (this.application_instance) {
                return this.application_instance;
            }
            return this.application_instance = new Application();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "getActiveExpress", {
        get: function () {
            return this.app;
        },
        enumerable: false,
        configurable: true
    });
    return Application;
}(BaseController_js_1.default));
