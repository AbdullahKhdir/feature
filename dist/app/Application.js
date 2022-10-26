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
var helmet_1 = __importDefault(require("helmet"));
var BaseController_js_1 = __importDefault(require("../core/controller/BaseController.js"));
var ExpressSession_js_1 = __importDefault(require("../core/framework/ExpressSession.js"));
var Singleton_js_1 = require("../core/Singleton/Singleton.js");
var AppLocals_js_1 = __importDefault(require("../core/utils/AppLocals.js"));
var request_utilities_1 = require("./middlewares/request_utilities");
var cache_control_1 = __importDefault(require("../core/middlewares/cache_control"));
var toast_1 = require("./middlewares/toast");
var morgan_logger_js_1 = __importDefault(require("../core/middlewares/morgan_logger.js"));
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
        _this.app.use(helmet_1.default.contentSecurityPolicy(_this.constants.CONTENT_SECURITY_POLICY));
        _this.app.use(helmet_1.default.crossOriginEmbedderPolicy());
        _this.app.use(helmet_1.default.crossOriginOpenerPolicy());
        _this.app.use(helmet_1.default.crossOriginResourcePolicy());
        _this.app.use(helmet_1.default.dnsPrefetchControl());
        _this.app.use(helmet_1.default.expectCt());
        _this.app.use(helmet_1.default.frameguard(_this.constants.FRAME_GUARD));
        _this.app.use(helmet_1.default.hidePoweredBy());
        _this.app.use(helmet_1.default.hsts());
        _this.app.use(helmet_1.default.ieNoOpen());
        _this.app.use(helmet_1.default.noSniff());
        _this.app.use(helmet_1.default.originAgentCluster());
        _this.app.use(helmet_1.default.permittedCrossDomainPolicies());
        _this.app.use(helmet_1.default.referrerPolicy());
        _this.app.use(helmet_1.default.xssFilter());
        /*
        * Setting Cache-Control Header
        */
        _this.app.use(cache_control_1.default);
        /*
        * Enable Logger
        */
        _this.app.use(morgan_logger_js_1.default);
        /*
        * To allow preflight requests on all http(s) methods*\
        */
        _this.app.options('*', _this.express.express_cors());
        /*
        * CORS Configurations
        */
        _this.app.use(_this.express.express_cors(_this.constants.CORS.CORS_OPTIONS));
        /*
        * Middleware To Set Static Public Folder
        */
        _this.app.use(_this.express.getExpress.static(_this.path.join(__dirname, '..', 'app', 'public'), _this.constants.EXPRESS.STATIC_OPTIONS));
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
        * Parse JSON-BODY (API) or ANY DATA TYPE Requests
        */
        _this.app.use(_this.body_parser.json());
        _this.app.use(_this.body_parser.urlencoded({ extended: true }));
        /*
        * Deploying apis
        */
        // @ts-ignore
        Singleton_js_1.Singleton.getApis().deployApi(_this.app);
        /*
        * Middleware To Initiate Mysql Session
        */
        var secret = crypto_1.default.randomBytes(48).toString('base64');
        _this.app.use(_this.session(Object.assign(_this.constants.EXPRESS.SESSION_OPTIONS, {
            secret: secret,
            store: Singleton_js_1.Singleton.getDb().initiateSession(),
        })));
        /*
        * CSRF Enabled
        */
        _this.app.use((0, csurf_1.default)({
            sessionKey: _this.constants.CSRF.sessionKey,
            cookie: _this.constants.CSRF.cookie,
            ignoreMethods: _this.constants.CSRF.ignoreMethods,
        }));
        /*
        * Using package compressor
        */
        _this.app.use((0, compression_1.default)());
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
            var token = req.csrfToken();
            // res.set({
            //     'csrf-Token':   token,
            //     'X-CSRF-TOKEN': token,
            //     'xsrf-token':   token,
            //     'x-csrf-token': token,
            //     'x-xsrf-token': token
            // });
            res.locals['csrf'] = token;
            _this.app.locals['csrf'] = token;
            res.locals['is_authenticated'] = res.req.session.is_authenticated;
            _this.app.locals['is_authenticated'] = res.req.session.is_authenticated;
            next();
        });
        /*
        * Middleware for saving cookie in the request
        */
        _this.app.use(function (req, res, next) {
            var key = crypto_1.default.randomBytes(48).toString('base64');
            req.user_cookie = key;
            next();
        });
        /*
        * Middleware for rendering 404 page on invalid csrf token
        */
        _this.app.use(function (err, req, res, next) {
            if (err.code === _this.constants.CSRF.errCode) {
                _this.invalidCsrfResponse(req, res);
            }
            if (err.code !== _this.constants.CSRF.errCode) {
                return next(err);
            }
        });
        /*
        * Middleware populating file or files attribute on file upload's request
        */
        _this.app.use(function (req, res, next) {
            if (req.isPost()) {
                var upload_object = req.getFormPostedData('upload_object');
                var upload_id = req.getFormPostedData('upload-input-name');
                if (!_this.__.isEmpty(upload_object) && !_this.__.isEmpty(upload_id)) {
                    upload_object = upload_object.replaceAll("'", '"');
                    if (upload_id.includes(',')) {
                        upload_id = upload_id.split(',')[1];
                    }
                    if (upload_object.startsWith('[')) {
                        upload_object = "{ \"".concat(upload_id, "\" : ").concat(upload_object);
                        upload_object = "".concat(upload_object, " }");
                        req.files = JSON.parse(upload_object);
                    }
                    else {
                        req.file = JSON.parse(upload_object);
                    }
                }
            }
            next();
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
