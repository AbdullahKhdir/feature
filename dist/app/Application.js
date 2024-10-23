"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
//***********************************************************
//* CONTROLLER: Application.ts
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: features/Migrate
//***********************************************************
/*
 * Npm and Node Modules
 */
var compression_1 = __importDefault(require("compression"));
var connect_flash_1 = __importDefault(require("connect-flash"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var crypto_1 = __importDefault(require("crypto"));
var helmet_1 = __importDefault(require("helmet"));
var BaseController_1 = __importDefault(require("../core/controller/BaseController"));
var Singleton_1 = require("../core/Singleton/Singleton");
var AppLocals_js_1 = __importDefault(require("../core/utils/AppLocals.js"));
var requestUtilities_1 = require("../core/middlewares/sub_middlewares/requestUtilities");
var cacheControl_1 = __importDefault(require("../core/middlewares/sub_middlewares/cacheControl"));
var toast_1 = require("../core/middlewares/sub_middlewares/toast");
var morganLogger_1 = __importDefault(require("../core/middlewares/sub_middlewares/morganLogger"));
var endpoints_1 = require("../core/api/apis_endpoints/endpoints");
var config = __importStar(require("../core/config"));
var undefined_routes_logic_1 = require("../core/utils/undefined-routes-logic");
var FileSystem_1 = __importDefault(require("../core/node/FileSystem"));
var io_1 = __importDefault(require("@pm2/io"));
module.exports = /** @class */ (function (_super) {
    __extends(Application, _super);
    function Application() {
        var _this = _super.call(this) || this;
        /*
         * Init The Application
         */
        _this.app = _this.express.getExpress();
        _this.bodyParser = Singleton_1.Singleton.getBodyParser();
        _this.path = Singleton_1.Singleton.getPath();
        _this.session = Singleton_1.Singleton.getExpressSession();
        // todo
        var currentReqs = io_1.default.counter({
            name: "Realtime request count",
            id: "app/realtime/requests"
        });
        _this.app.use(function (req, res, next) {
            var origin = req.headers.origin || "".concat(req.protocol, "://").concat(req.get("host"));
            req.origin = origin;
            currentReqs.inc();
            req.on("end", function () {
                currentReqs.dec();
            });
            next();
        });
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
         * To allow preflight requests on all http(s) methods*\
         */
        _this.app.options("*", _this.express.expressCors());
        /*
         * CORS Configurations
         */
        _this.app.use(_this.express.expressCors(_this.constants.CORS.CORS_OPTIONS));
        /*
         * REGISTER COOKIE PARSER
         */
        _this.app.use((0, cookie_parser_1.default)());
        /*
         * Middleware To Initiate Mysql Session
         */
        var secret = crypto_1.default.randomBytes(48).toString("base64");
        _this.app.use(_this.session(Object.assign(_this.constants.EXPRESS.SESSION_OPTIONS, {
            secret: secret,
            store: Singleton_1.Singleton.getDb().initiateSession()
        })));
        /*
         * AUTO ESCAPE JSON
         * And parse JSON-BODY (API) or ANY DATA TYPE Requests
         */
        _this.app.set("json escape", true);
        _this.app.use(_this.bodyParser.json());
        _this.app.use(_this.bodyParser.urlencoded({ extended: true }));
        /*
         * CSRF Enabled
         */
        _this.app.use(function (req, res, next) {
            if (endpoints_1.ENDPOINTS.length > 0) {
                if (endpoints_1.ENDPOINTS.includes(req.headers.referer || "") ||
                    endpoints_1.ENDPOINTS.includes(req.originalUrl || "") ||
                    endpoints_1.ENDPOINTS.includes(req.url || "")) {
                    return next();
                }
            }
            var isExcluded = FileSystem_1.default.getAllSubfolders(_this.path.join(__dirname, "..", "app", "public")).some(function (path) {
                return req.url.startsWith(path);
            }) || req.url === "/favicon.ico";
            if (isExcluded) {
                return next();
            }
            if (!_this.constants.CSRF.methods.includes(req.method)) {
                var csrf = crypto_1.default.randomBytes(24).toString("hex");
                req.session["x-csrf-token"] = csrf;
                res.cookie(_this.constants.CSRF.cookieHeaderName, csrf, {
                    httpOnly: true,
                    secure: config.configurations().environment === "production",
                    sameSite: "lax"
                });
                res.header(_this.constants.CSRF.cookieHeaderName, csrf);
                res.locals["csrf"] = csrf;
                _this.app.locals["csrf"] = csrf;
            }
            next();
        });
        /*
         * Send csrf token on every request along with the authentication status
         */
        _this.app.use(function (req, res, next) {
            res.locals["isUserAuthenticated"] = req.session.isUserAuthenticated;
            _this.app.locals["isUserAuthenticated"] = req.session.isUserAuthenticated;
            next();
        });
        _this.app.use(function (req, res, next) {
            var requestBodyCsrf = req.body ? req.body["x-csrf-token"] : undefined;
            var requestHeaderCsrf = req.get ? req.get("x-csrf-token") : undefined;
            var requestCsrfFromSession = req.session ? req.session["x-csrf-token"] : undefined;
            var tokenFromClient = requestBodyCsrf !== null && requestBodyCsrf !== void 0 ? requestBodyCsrf : requestHeaderCsrf;
            if (_this.constants.CSRF.methods.includes(req.method)) {
                if (endpoints_1.ENDPOINTS.length > 0 &&
                    (endpoints_1.ENDPOINTS.includes(req.headers.referer || "") ||
                        endpoints_1.ENDPOINTS.includes(req.originalUrl || "") ||
                        endpoints_1.ENDPOINTS.includes(req.url || ""))) {
                    return next();
                }
                if (!tokenFromClient || tokenFromClient !== requestCsrfFromSession) {
                    return res
                        .status(_this.constants.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN)
                        .render("undefined_routes", (0, undefined_routes_logic_1.csrf)(res));
                }
            }
            next();
        });
        /*
         * Using package compressor
         */
        _this.app.use((0, compression_1.default)());
        /*
         * Setting Cache-Control Header
         */
        _this.app.use(cacheControl_1.default);
        /*
         * Enable Logger
         */
        _this.app.use(morganLogger_1.default);
        /*
         * Registering Flash
         */
        _this.app.use((0, connect_flash_1.default)());
        /*
         * Registering error, warning and success toaster to every template
         */
        _this.app.use(function (req, res, next) {
            (0, toast_1.toast)(req, res, next, _this.app);
        });
        /*
         * Middleware for editing and wrapping
         * query params,
         * post data and
         * getting data to templates after getting or posting
         */
        _this.app.use(function (req, res, next) {
            (0, requestUtilities_1.reqUtil)(req, res, next);
        });
        /*
         * Middleware To Set Static Public Folder
         */
        _this.app.use(_this.express.getExpress.static(_this.path.join(__dirname, "..", "app", "public"), _this.constants.EXPRESS.STATIC_OPTIONS));
        /*
         * USE EJS TEMPLATE ENGINE (NODE SUPPORTS TWIG)
         * And specify the templates folder of the view property in express
         */
        _this.app.set("view engine", "ejs");
        _this.app.set("views", _this.path.join(__dirname, "views"));
        /*
         * Routes
         */
        _this.app.set("case sensitive routing", false);
        _this.app.set("strict routing", false);
        _this.deployRoutes(_this.app);
        /*
         * Deploying api's endpoints
         */
        Singleton_1.Singleton.getApis().deployApi(_this.app);
        /*
         * Middleware populating file or files attribute on file upload's request
         */
        _this.app.use(function (req, res, next) {
            if (req.isPost()) {
                var upload_object = req.getFormPostedData("upload_object");
                var upload_id = req.getFormPostedData("upload-input-name");
                if (!_this._.isEmpty(upload_object) && !_this._.isEmpty(upload_id)) {
                    upload_object = upload_object.replaceAll("'", '"');
                    if (upload_id.includes(",")) {
                        upload_id = upload_id.split(",")[1];
                    }
                    if (upload_object.startsWith("[")) {
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
        Singleton_1.Singleton.getI18n().configure(_this.constants.I18N.CONFIGURATION_OPTIONS);
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
            if (this.applicationInstance) {
                return this.applicationInstance;
            }
            return (this.applicationInstance = new Application());
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
}(BaseController_1.default));
