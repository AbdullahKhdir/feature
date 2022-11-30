'use strict';
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
var https_1 = __importDefault(require("https"));
var os_1 = __importDefault(require("os"));
var endpoints_1 = require("./core/api/apis_endpoints/endpoints");
var config = __importStar(require("./core/config"));
var Singleton_1 = require("./core/Singleton/Singleton");
var undefined_routes_logic_1 = require("./core/utils/undefined-routes-logic");
/**
 * @class Server
 * @constructor
 * @extends Application
 * @description Class Server is used to initiate the whole application and open a socket to serve the application
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
var Server = /** @class */ (function () {
    function Server() {
        this.app = Singleton_1.Singleton.getExpressApp();
        this.constants = Singleton_1.Singleton.getConstants();
        this.__ = Singleton_1.Singleton.getLodash();
        process.env['UV_THREADPOOL_SIZE'] = os_1.default.cpus().length.toString();
    }
    Server.getServerInstance = function () {
        if (this.server_instance) {
            return this.server_instance;
        }
        return this.server_instance = new Server();
    };
    Server.prototype.run = function () {
        var _this = this;
        if (config.configurations().environment === 'development') {
            return (function () { return __awaiter(_this, void 0, void 0, function () {
                var mkcert, ca, cert, httpsOptions, port, httpServer, server;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mkcert = require('mkcert');
                            return [4 /*yield*/, mkcert.createCA({
                                    organization: 'Node',
                                    countryCode: 'DE',
                                    state: 'Bavaria',
                                    locality: 'Nuremberg',
                                    validityDays: 1
                                })];
                        case 1:
                            ca = _a.sent();
                            return [4 /*yield*/, mkcert.createCert({
                                    domains: ['127.0.0.1', 'localhost'],
                                    validityDays: 1,
                                    caKey: ca.key,
                                    caCert: ca.cert
                                })];
                        case 2:
                            cert = _a.sent();
                            httpsOptions = {
                                key: cert.key,
                                cert: cert.cert
                            };
                            port = Server.getServerInstance().port();
                            //****************************************************************************************************\\
                            //* Will be triggered only on errors or next(new Error('error message')) or next({error: 'message'}) *\\
                            //****************************************************************************************************\\
                            this.app.use(function (err, req, res, next) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99, _100, _101, _102, _103;
                                if (err.code === _this.constants.CSRF.errCode) {
                                    return res.status(_this.constants.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN).render('undefined_routes', (0, undefined_routes_logic_1.csrf)(res));
                                }
                                var _status = err.statusCode || _this.constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
                                var message = err.message;
                                var is_api_endpoint = false;
                                // throw err;
                                if (endpoints_1.ENDPOINTS.length > 0) {
                                    endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                        if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                            || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                            || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                            is_api_endpoint = true;
                                        }
                                    });
                                }
                                if (is_api_endpoint) {
                                    return res.status(_status).json({ message: message });
                                }
                                else {
                                    if (err) {
                                        if (Object.keys('statusCode')) {
                                            var CLIENT_1 = Singleton_1.Singleton.getConstants().HTTPS_STATUS.CLIENT_ERRORS;
                                            var SERVER_1 = Singleton_1.Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS;
                                            var UNOFFICIAL_CODES_1 = Singleton_1.Singleton.getConstants().HTTPS_STATUS.UNOFFICIAL_CODES;
                                            var INTERNET_INFORMATION_SERVICES_1 = Singleton_1.Singleton.getConstants().HTTPS_STATUS.INTERNET_INFORMATION_SERVICES;
                                            req.origin = req.headers.origin || req.get('origin');
                                            err.statusCode = err.statusCode ? err.statusCode : 500;
                                            switch (err.statusCode) {
                                                //***************************************\\
                                                //*************CLIENT ERRORS*************\\
                                                //***************************************\\
                                                case CLIENT_1.BAD_REQUEST:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.BAD_REQUEST, message: 'Bad Request' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_b = (_a = res === null || res === void 0 ? void 0 : res.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.BAD_REQUEST,
                                                        status_title: "Bad Request",
                                                        status_description: "Wondering from where have you requested this url, but you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.UNAUTHORIZED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.UNAUTHORIZED, message: 'Not authorized!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_d = (_c = res === null || res === void 0 ? void 0 : res.req) === null || _c === void 0 ? void 0 : _c.session) === null || _d === void 0 ? void 0 : _d.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.UNAUTHORIZED,
                                                        status_title: "Not authorized!",
                                                        status_description: "The requested page requires an authentication. But you can click the button below\n                                            to go login page.",
                                                        url: '/login',
                                                        label: 'Go Login'
                                                    });
                                                    break;
                                                case CLIENT_1.PAYMENT_REQUIRED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.PAYMENT_REQUIRED, message: 'Payment Error, please try again!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_f = (_e = res === null || res === void 0 ? void 0 : res.req) === null || _e === void 0 ? void 0 : _e.session) === null || _f === void 0 ? void 0 : _f.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.PAYMENT_REQUIRED,
                                                        status_title: "Payment Error, please try again!",
                                                        status_description: "Unexpected error happened while processing the payment . But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.FORBIDDEN:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.FORBIDDEN, message: 'Access forbidden!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_h = (_g = res === null || res === void 0 ? void 0 : res.req) === null || _g === void 0 ? void 0 : _g.session) === null || _h === void 0 ? void 0 : _h.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.FORBIDDEN,
                                                        status_title: "Access forbidden!",
                                                        status_description: "Access forbidden!, please make sure you are not altering or manipulating any dom elements, but you can go back to homepage",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.METHOD_NOT_ALLOWED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.METHOD_NOT_ALLOWED, message: 'Method Not Allowed!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_k = (_j = res === null || res === void 0 ? void 0 : res.req) === null || _j === void 0 ? void 0 : _j.session) === null || _k === void 0 ? void 0 : _k.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.METHOD_NOT_ALLOWED,
                                                        status_title: "Method Not Allowed!",
                                                        status_description: "Method Not Allowed!, we don't know how you ended up in here, but you can go back to the homepage",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.SITE_NOT_FOUND:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.SITE_NOT_FOUND, message: 'Site Not Found!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_m = (_l = res === null || res === void 0 ? void 0 : res.req) === null || _l === void 0 ? void 0 : _l.session) === null || _m === void 0 ? void 0 : _m.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.SITE_NOT_FOUND,
                                                        status_title: "UH OH! You're lost.",
                                                        status_description: "The page you are looking for does not exist.\n                                            How you got here is a mystery. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.NOT_ACCEPTABLE:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.NOT_ACCEPTABLE, message: 'Not acceptable!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_p = (_o = res === null || res === void 0 ? void 0 : res.req) === null || _o === void 0 ? void 0 : _o.session) === null || _p === void 0 ? void 0 : _p.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.NOT_ACCEPTABLE,
                                                        status_title: "Not acceptable!",
                                                        status_description: "Not acceptable!.\n                                            How you got here is a mystery. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.PROXY_AUTHENTICATION_REQUIRED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.PROXY_AUTHENTICATION_REQUIRED, message: 'Proxy authentication required!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_r = (_q = res === null || res === void 0 ? void 0 : res.req) === null || _q === void 0 ? void 0 : _q.session) === null || _r === void 0 ? void 0 : _r.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.PROXY_AUTHENTICATION_REQUIRED,
                                                        status_title: "Proxy authentication required!",
                                                        status_description: "The page you are looking for needs authentication from a proxy!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.REQUEST_TIMEOUT:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.REQUEST_TIMEOUT, message: 'Request timeout!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_t = (_s = res === null || res === void 0 ? void 0 : res.req) === null || _s === void 0 ? void 0 : _s.session) === null || _t === void 0 ? void 0 : _t.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.REQUEST_TIMEOUT,
                                                        status_title: "Request timeout!",
                                                        status_description: "The page you are looking for has been timed out!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.CONFLICT:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.CONFLICT, message: 'Conflict!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_v = (_u = res === null || res === void 0 ? void 0 : res.req) === null || _u === void 0 ? void 0 : _u.session) === null || _v === void 0 ? void 0 : _v.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.CONFLICT,
                                                        status_title: "Conflict!",
                                                        status_description: "The page you are looking for has a conflict with other resource!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.GONE:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.GONE, message: 'Gone!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_x = (_w = res === null || res === void 0 ? void 0 : res.req) === null || _w === void 0 ? void 0 : _w.session) === null || _x === void 0 ? void 0 : _x.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.GONE,
                                                        status_title: "Gone!",
                                                        status_description: "Gone response!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.LENGTH_REQUIRED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.LENGTH_REQUIRED, message: 'Length required!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_z = (_y = res === null || res === void 0 ? void 0 : res.req) === null || _y === void 0 ? void 0 : _y.session) === null || _z === void 0 ? void 0 : _z.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.LENGTH_REQUIRED,
                                                        status_title: "Length required!",
                                                        status_description: "Length required!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.PRECONDITION_FAILED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.PRECONDITION_FAILED, message: 'Precondition failed!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_1 = (_0 = res === null || res === void 0 ? void 0 : res.req) === null || _0 === void 0 ? void 0 : _0.session) === null || _1 === void 0 ? void 0 : _1.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.PRECONDITION_FAILED,
                                                        status_title: "Precondition failed!",
                                                        status_description: "Precondition failed!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.PAYLOAD_TOO_LARGE:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.PAYLOAD_TOO_LARGE, message: 'Payload too large!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_3 = (_2 = res === null || res === void 0 ? void 0 : res.req) === null || _2 === void 0 ? void 0 : _2.session) === null || _3 === void 0 ? void 0 : _3.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.PAYLOAD_TOO_LARGE,
                                                        status_title: "Payload too large!",
                                                        status_description: "Payload too large!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.URI_TOO_LONG:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.URI_TOO_LONG, message: 'URI too long!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_5 = (_4 = res === null || res === void 0 ? void 0 : res.req) === null || _4 === void 0 ? void 0 : _4.session) === null || _5 === void 0 ? void 0 : _5.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.URI_TOO_LONG,
                                                        status_title: "URI too long!",
                                                        status_description: "URI too long!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.UNSUPPORTED_MEDIA_TYPE:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.UNSUPPORTED_MEDIA_TYPE, message: 'Unsupported media type!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_7 = (_6 = res === null || res === void 0 ? void 0 : res.req) === null || _6 === void 0 ? void 0 : _6.session) === null || _7 === void 0 ? void 0 : _7.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.UNSUPPORTED_MEDIA_TYPE,
                                                        status_title: "Unsupported media type!",
                                                        status_description: "Unsupported media type!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.RANGE_NOT_SATISFIABLE:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.RANGE_NOT_SATISFIABLE, message: 'Range not satisfiable!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_9 = (_8 = res === null || res === void 0 ? void 0 : res.req) === null || _8 === void 0 ? void 0 : _8.session) === null || _9 === void 0 ? void 0 : _9.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.RANGE_NOT_SATISFIABLE,
                                                        status_title: "Range not satisfiable!",
                                                        status_description: "Range not satisfiable!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.EXPECTATION_FAILED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.EXPECTATION_FAILED, message: 'Expectation failed!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_11 = (_10 = res === null || res === void 0 ? void 0 : res.req) === null || _10 === void 0 ? void 0 : _10.session) === null || _11 === void 0 ? void 0 : _11.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.EXPECTATION_FAILED,
                                                        status_title: "Expectation failed!",
                                                        status_description: "Expectation failed!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.IM_A_TEAPOT:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.IM_A_TEAPOT, message: "I'm a TEAPOT!" });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_13 = (_12 = res === null || res === void 0 ? void 0 : res.req) === null || _12 === void 0 ? void 0 : _12.session) === null || _13 === void 0 ? void 0 : _13.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.IM_A_TEAPOT,
                                                        status_title: "I'm a TEAPOT!",
                                                        status_description: "I'm a TEAPOT!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.MISDIRECTED_REQUEST:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.MISDIRECTED_REQUEST, message: 'Misdirected request!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_15 = (_14 = res === null || res === void 0 ? void 0 : res.req) === null || _14 === void 0 ? void 0 : _14.session) === null || _15 === void 0 ? void 0 : _15.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.MISDIRECTED_REQUEST,
                                                        status_title: 'Misdirected request!',
                                                        status_description: "Misdirected request!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.UNPROCESSABLE_ENTITY:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.UNPROCESSABLE_ENTITY, message: 'Wrong input!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_17 = (_16 = res === null || res === void 0 ? void 0 : res.req) === null || _16 === void 0 ? void 0 : _16.session) === null || _17 === void 0 ? void 0 : _17.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.UNPROCESSABLE_ENTITY,
                                                        status_title: 'Wrong input!',
                                                        status_description: "Wrong input!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.LOCKED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.LOCKED, message: 'Request is locked!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_19 = (_18 = res === null || res === void 0 ? void 0 : res.req) === null || _18 === void 0 ? void 0 : _18.session) === null || _19 === void 0 ? void 0 : _19.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.LOCKED,
                                                        status_title: 'Request is locked!',
                                                        status_description: "Request is locked!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.FAILED_DEPENDENCY:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.FAILED_DEPENDENCY, message: 'Failed dependency!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_21 = (_20 = res === null || res === void 0 ? void 0 : res.req) === null || _20 === void 0 ? void 0 : _20.session) === null || _21 === void 0 ? void 0 : _21.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.FAILED_DEPENDENCY,
                                                        status_title: 'Failed dependency!',
                                                        status_description: "Failed dependency!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.TOO_EARLY:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.TOO_EARLY, message: 'Too early!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_23 = (_22 = res === null || res === void 0 ? void 0 : res.req) === null || _22 === void 0 ? void 0 : _22.session) === null || _23 === void 0 ? void 0 : _23.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.TOO_EARLY,
                                                        status_title: 'Too early!',
                                                        status_description: "Too early!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.UPGRADE_REQUIRED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.UPGRADE_REQUIRED, message: 'Upgrade required!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_25 = (_24 = res === null || res === void 0 ? void 0 : res.req) === null || _24 === void 0 ? void 0 : _24.session) === null || _25 === void 0 ? void 0 : _25.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.UPGRADE_REQUIRED,
                                                        status_title: 'Upgrade required!',
                                                        status_description: "Upgrade required!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.PRECONDITION_REQUIRED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.PRECONDITION_REQUIRED, message: 'Precondition required!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_27 = (_26 = res === null || res === void 0 ? void 0 : res.req) === null || _26 === void 0 ? void 0 : _26.session) === null || _27 === void 0 ? void 0 : _27.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.PRECONDITION_REQUIRED,
                                                        status_title: 'Precondition required!',
                                                        status_description: "Precondition required!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.TOO_MANY_REQUESTS:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.TOO_MANY_REQUESTS, message: 'Too many requests!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_29 = (_28 = res === null || res === void 0 ? void 0 : res.req) === null || _28 === void 0 ? void 0 : _28.session) === null || _29 === void 0 ? void 0 : _29.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.TOO_MANY_REQUESTS,
                                                        status_title: 'Too many requests!',
                                                        status_description: "Too many requests!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.REQUEST_HEADER_FIELDS_TOO_LARGE:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.REQUEST_HEADER_FIELDS_TOO_LARGE, message: 'Request header fields too large!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_31 = (_30 = res === null || res === void 0 ? void 0 : res.req) === null || _30 === void 0 ? void 0 : _30.session) === null || _31 === void 0 ? void 0 : _31.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.REQUEST_HEADER_FIELDS_TOO_LARGE,
                                                        status_title: 'Request header fields too large!',
                                                        status_description: "Request header fields too large!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case CLIENT_1.UNAVAILABLE_FOR_LEGAL_REASONS:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: CLIENT_1.UNAVAILABLE_FOR_LEGAL_REASONS, message: 'Unavailable for legal reasons!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_33 = (_32 = res === null || res === void 0 ? void 0 : res.req) === null || _32 === void 0 ? void 0 : _32.session) === null || _33 === void 0 ? void 0 : _33.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: CLIENT_1.UNAVAILABLE_FOR_LEGAL_REASONS,
                                                        status_title: 'Unavailable for legal reasons!',
                                                        status_description: "Unavailable for legal reasons!. But you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                //***************************************\\
                                                //*************SERVER ERRORS*************\\
                                                //***************************************\\
                                                case SERVER_1.INTERNAL_SERVER_ERROR:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: SERVER_1.INTERNAL_SERVER_ERROR, message: 'Internal Server Error!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_35 = (_34 = res === null || res === void 0 ? void 0 : res.req) === null || _34 === void 0 ? void 0 : _34.session) === null || _35 === void 0 ? void 0 : _35.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: SERVER_1.INTERNAL_SERVER_ERROR,
                                                        status_title: "Unexpected error",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case SERVER_1.NOT_IMPLEMENTED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: SERVER_1.NOT_IMPLEMENTED, message: 'Not implemented Error!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_37 = (_36 = res === null || res === void 0 ? void 0 : res.req) === null || _36 === void 0 ? void 0 : _36.session) === null || _37 === void 0 ? void 0 : _37.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: SERVER_1.NOT_IMPLEMENTED,
                                                        status_title: "Not implemented Error!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case SERVER_1.BAD_GATEWAY:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: SERVER_1.BAD_GATEWAY, message: 'Bad Gateway Error!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_39 = (_38 = res === null || res === void 0 ? void 0 : res.req) === null || _38 === void 0 ? void 0 : _38.session) === null || _39 === void 0 ? void 0 : _39.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: SERVER_1.BAD_GATEWAY,
                                                        status_title: "Bad Gateway Error!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case SERVER_1.SERVICE_UNAVAILABLE:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: SERVER_1.SERVICE_UNAVAILABLE, message: 'Service is not available!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_41 = (_40 = res === null || res === void 0 ? void 0 : res.req) === null || _40 === void 0 ? void 0 : _40.session) === null || _41 === void 0 ? void 0 : _41.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: SERVER_1.SERVICE_UNAVAILABLE,
                                                        status_title: "Service is not available!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case SERVER_1.GATEWAY_TIMEOUT:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: SERVER_1.GATEWAY_TIMEOUT, message: 'Gateway timeout!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_43 = (_42 = res === null || res === void 0 ? void 0 : res.req) === null || _42 === void 0 ? void 0 : _42.session) === null || _43 === void 0 ? void 0 : _43.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: SERVER_1.GATEWAY_TIMEOUT,
                                                        status_title: "Gateway timeout!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case SERVER_1.HTTP_VERSION_NOT_SUPPORTED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: SERVER_1.HTTP_VERSION_NOT_SUPPORTED, message: 'Http version not supported!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_45 = (_44 = res === null || res === void 0 ? void 0 : res.req) === null || _44 === void 0 ? void 0 : _44.session) === null || _45 === void 0 ? void 0 : _45.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: SERVER_1.HTTP_VERSION_NOT_SUPPORTED,
                                                        status_title: "Http version not supported!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case SERVER_1.VARIANT_ALSO_NEGOTIATES:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: SERVER_1.VARIANT_ALSO_NEGOTIATES, message: 'Variant also negotiates!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_47 = (_46 = res === null || res === void 0 ? void 0 : res.req) === null || _46 === void 0 ? void 0 : _46.session) === null || _47 === void 0 ? void 0 : _47.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: SERVER_1.VARIANT_ALSO_NEGOTIATES,
                                                        status_title: "Variant also negotiates!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case SERVER_1.INSUFFICIENT_STORAGE:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: SERVER_1.INSUFFICIENT_STORAGE, message: 'Insufficient storage!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_49 = (_48 = res === null || res === void 0 ? void 0 : res.req) === null || _48 === void 0 ? void 0 : _48.session) === null || _49 === void 0 ? void 0 : _49.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: SERVER_1.INSUFFICIENT_STORAGE,
                                                        status_title: "Insufficient storage!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case SERVER_1.LOOP_DETECTED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: SERVER_1.LOOP_DETECTED, message: 'Loop detected!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_51 = (_50 = res === null || res === void 0 ? void 0 : res.req) === null || _50 === void 0 ? void 0 : _50.session) === null || _51 === void 0 ? void 0 : _51.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: SERVER_1.LOOP_DETECTED,
                                                        status_title: "Loop detected!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case SERVER_1.NOT_EXTENDED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: SERVER_1.NOT_EXTENDED, message: 'Not extended!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_53 = (_52 = res === null || res === void 0 ? void 0 : res.req) === null || _52 === void 0 ? void 0 : _52.session) === null || _53 === void 0 ? void 0 : _53.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: SERVER_1.NOT_EXTENDED,
                                                        status_title: "Not extended!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case SERVER_1.NETWORK_AUTHENTICATION_REQUIRED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: SERVER_1.NETWORK_AUTHENTICATION_REQUIRED, message: 'Network authentication required!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_55 = (_54 = res === null || res === void 0 ? void 0 : res.req) === null || _54 === void 0 ? void 0 : _54.session) === null || _55 === void 0 ? void 0 : _55.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: SERVER_1.NETWORK_AUTHENTICATION_REQUIRED,
                                                        status_title: "Network authentication required!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                //***************************************\\
                                                //*************COMMON ERRORS*************\\
                                                //***************************************\\
                                                case UNOFFICIAL_CODES_1.PAGE_EXPIRED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: UNOFFICIAL_CODES_1.PAGE_EXPIRED, message: 'Page expired!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_57 = (_56 = res === null || res === void 0 ? void 0 : res.req) === null || _56 === void 0 ? void 0 : _56.session) === null || _57 === void 0 ? void 0 : _57.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: UNOFFICIAL_CODES_1.PAGE_EXPIRED,
                                                        status_title: "Page expired!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case UNOFFICIAL_CODES_1.METHOD_FAILURE:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: UNOFFICIAL_CODES_1.METHOD_FAILURE, message: 'Method failure!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_59 = (_58 = res === null || res === void 0 ? void 0 : res.req) === null || _58 === void 0 ? void 0 : _58.session) === null || _59 === void 0 ? void 0 : _59.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: UNOFFICIAL_CODES_1.METHOD_FAILURE,
                                                        status_title: "Method failure!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case UNOFFICIAL_CODES_1.ENHANCE_YOUR_CALM:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: UNOFFICIAL_CODES_1.ENHANCE_YOUR_CALM, message: 'Enhance your calm!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_61 = (_60 = res === null || res === void 0 ? void 0 : res.req) === null || _60 === void 0 ? void 0 : _60.session) === null || _61 === void 0 ? void 0 : _61.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: UNOFFICIAL_CODES_1.ENHANCE_YOUR_CALM,
                                                        status_title: "Enhance your calm!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case UNOFFICIAL_CODES_1.REQUEST_HEADER_FIELDS_TOO_LARGE:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: UNOFFICIAL_CODES_1.REQUEST_HEADER_FIELDS_TOO_LARGE, message: 'Request header fields too large!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_63 = (_62 = res === null || res === void 0 ? void 0 : res.req) === null || _62 === void 0 ? void 0 : _62.session) === null || _63 === void 0 ? void 0 : _63.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: UNOFFICIAL_CODES_1.REQUEST_HEADER_FIELDS_TOO_LARGE,
                                                        status_title: "Request header fields too large!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case UNOFFICIAL_CODES_1.BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: UNOFFICIAL_CODES_1.BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS, message: 'Blocked by windows parental controls!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_65 = (_64 = res === null || res === void 0 ? void 0 : res.req) === null || _64 === void 0 ? void 0 : _64.session) === null || _65 === void 0 ? void 0 : _65.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: UNOFFICIAL_CODES_1.BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS,
                                                        status_title: "Blocked by windows parental controls!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case UNOFFICIAL_CODES_1.INVALID_TOKEN:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: UNOFFICIAL_CODES_1.INVALID_TOKEN, message: 'Invalid token!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_67 = (_66 = res === null || res === void 0 ? void 0 : res.req) === null || _66 === void 0 ? void 0 : _66.session) === null || _67 === void 0 ? void 0 : _67.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: UNOFFICIAL_CODES_1.INVALID_TOKEN,
                                                        status_title: "Invalid token!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case UNOFFICIAL_CODES_1.TOKEN_REQUIRED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: UNOFFICIAL_CODES_1.TOKEN_REQUIRED, message: 'Token required!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_69 = (_68 = res === null || res === void 0 ? void 0 : res.req) === null || _68 === void 0 ? void 0 : _68.session) === null || _69 === void 0 ? void 0 : _69.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: UNOFFICIAL_CODES_1.TOKEN_REQUIRED,
                                                        status_title: "Token required!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case UNOFFICIAL_CODES_1.BANDWIDTH_LIMIT_EXCEEDED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: UNOFFICIAL_CODES_1.BANDWIDTH_LIMIT_EXCEEDED, message: 'Bandwidth limit exceeded!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_71 = (_70 = res === null || res === void 0 ? void 0 : res.req) === null || _70 === void 0 ? void 0 : _70.session) === null || _71 === void 0 ? void 0 : _71.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: UNOFFICIAL_CODES_1.BANDWIDTH_LIMIT_EXCEEDED,
                                                        status_title: "Bandwidth limit exceeded!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case UNOFFICIAL_CODES_1.SITE_IS_OVERLOADED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: UNOFFICIAL_CODES_1.SITE_IS_OVERLOADED, message: 'Site is overloaded!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_73 = (_72 = res === null || res === void 0 ? void 0 : res.req) === null || _72 === void 0 ? void 0 : _72.session) === null || _73 === void 0 ? void 0 : _73.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: UNOFFICIAL_CODES_1.SITE_IS_OVERLOADED,
                                                        status_title: "Site is overloaded!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case UNOFFICIAL_CODES_1.SITE_IS_FROZEN:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: UNOFFICIAL_CODES_1.SITE_IS_FROZEN, message: 'Site is frozen!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_75 = (_74 = res === null || res === void 0 ? void 0 : res.req) === null || _74 === void 0 ? void 0 : _74.session) === null || _75 === void 0 ? void 0 : _75.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: UNOFFICIAL_CODES_1.SITE_IS_FROZEN,
                                                        status_title: "Site is frozen!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case UNOFFICIAL_CODES_1.NETWORK_READ_TIMEOUT_ERROR:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: UNOFFICIAL_CODES_1.NETWORK_READ_TIMEOUT_ERROR, message: 'Network read timeout error!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_77 = (_76 = res === null || res === void 0 ? void 0 : res.req) === null || _76 === void 0 ? void 0 : _76.session) === null || _77 === void 0 ? void 0 : _77.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: UNOFFICIAL_CODES_1.NETWORK_READ_TIMEOUT_ERROR,
                                                        status_title: "Network read timeout error!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case UNOFFICIAL_CODES_1.NETWORK_CONNECT_TIMEOUT_ERROR:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: UNOFFICIAL_CODES_1.NETWORK_CONNECT_TIMEOUT_ERROR, message: 'Network connect timeout error!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_79 = (_78 = res === null || res === void 0 ? void 0 : res.req) === null || _78 === void 0 ? void 0 : _78.session) === null || _79 === void 0 ? void 0 : _79.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: UNOFFICIAL_CODES_1.NETWORK_CONNECT_TIMEOUT_ERROR,
                                                        status_title: "Network connect timeout error!",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                //**************************************************************\\
                                                //*************INTERNET INFORMATION SERVICES ERRORS*************\\
                                                //**************************************************************\\
                                                case INTERNET_INFORMATION_SERVICES_1.LOGIN_TIME_OUT:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: INTERNET_INFORMATION_SERVICES_1.LOGIN_TIME_OUT, message: 'Login time out!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_81 = (_80 = res === null || res === void 0 ? void 0 : res.req) === null || _80 === void 0 ? void 0 : _80.session) === null || _81 === void 0 ? void 0 : _81.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: INTERNET_INFORMATION_SERVICES_1.LOGIN_TIME_OUT,
                                                        status_title: 'Login time out!',
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case INTERNET_INFORMATION_SERVICES_1.NGINX.NO_RESPONSE:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: INTERNET_INFORMATION_SERVICES_1.NGINX.NO_RESPONSE, message: 'No response from nginx!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_83 = (_82 = res === null || res === void 0 ? void 0 : res.req) === null || _82 === void 0 ? void 0 : _82.session) === null || _83 === void 0 ? void 0 : _83.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: INTERNET_INFORMATION_SERVICES_1.NGINX.NO_RESPONSE,
                                                        status_title: 'No response from nginx!',
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case INTERNET_INFORMATION_SERVICES_1.NGINX.REQUEST_HEADER_TOO_LARGE:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: INTERNET_INFORMATION_SERVICES_1.NGINX.REQUEST_HEADER_TOO_LARGE, message: 'Request header too large!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_85 = (_84 = res === null || res === void 0 ? void 0 : res.req) === null || _84 === void 0 ? void 0 : _84.session) === null || _85 === void 0 ? void 0 : _85.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: INTERNET_INFORMATION_SERVICES_1.NGINX.REQUEST_HEADER_TOO_LARGE,
                                                        status_title: 'Request header too large!',
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case INTERNET_INFORMATION_SERVICES_1.NGINX.SSL_CERTIFICATE_ERROR:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: INTERNET_INFORMATION_SERVICES_1.NGINX.SSL_CERTIFICATE_ERROR, message: 'Ssl certificate error!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_87 = (_86 = res === null || res === void 0 ? void 0 : res.req) === null || _86 === void 0 ? void 0 : _86.session) === null || _87 === void 0 ? void 0 : _87.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: INTERNET_INFORMATION_SERVICES_1.NGINX.SSL_CERTIFICATE_ERROR,
                                                        status_title: 'Ssl certificate error!',
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case INTERNET_INFORMATION_SERVICES_1.NGINX.SSL_CERTIFICATE_REQUIRED:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: INTERNET_INFORMATION_SERVICES_1.NGINX.SSL_CERTIFICATE_REQUIRED, message: 'Ssl certificate required!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_89 = (_88 = res === null || res === void 0 ? void 0 : res.req) === null || _88 === void 0 ? void 0 : _88.session) === null || _89 === void 0 ? void 0 : _89.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: INTERNET_INFORMATION_SERVICES_1.NGINX.SSL_CERTIFICATE_REQUIRED,
                                                        status_title: 'Ssl certificate required!',
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case INTERNET_INFORMATION_SERVICES_1.NGINX.HTTP_REQUEST_SENT_TO_HTTPS_PORT:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: INTERNET_INFORMATION_SERVICES_1.NGINX.HTTP_REQUEST_SENT_TO_HTTPS_PORT, message: 'Http request sent to https port!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_91 = (_90 = res === null || res === void 0 ? void 0 : res.req) === null || _90 === void 0 ? void 0 : _90.session) === null || _91 === void 0 ? void 0 : _91.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: INTERNET_INFORMATION_SERVICES_1.NGINX.HTTP_REQUEST_SENT_TO_HTTPS_PORT,
                                                        status_title: 'Http request sent to https port!',
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                                                        label: !err.message ? 'Send an E-Mail To Support Team' : 'Home'
                                                    });
                                                    break;
                                                case INTERNET_INFORMATION_SERVICES_1.NGINX.CLIENT_CLOSED_REQUEST:
                                                    if (endpoints_1.ENDPOINTS.length > 0) {
                                                        endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                            if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                                || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                                return res.status(_status).json({ statusCode: INTERNET_INFORMATION_SERVICES_1.NGINX.CLIENT_CLOSED_REQUEST, message: 'Client closed request!' });
                                                            }
                                                        });
                                                    }
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/undefined_routes/',
                                                        is_authenticated: (_93 = (_92 = res === null || res === void 0 ? void 0 : res.req) === null || _92 === void 0 ? void 0 : _92.session) === null || _93 === void 0 ? void 0 : _93.is_authenticated,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: INTERNET_INFORMATION_SERVICES_1.NGINX.CLIENT_CLOSED_REQUEST,
                                                        status_title: 'Client closed request!',
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: !err.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
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
                                            is_authenticated: (_95 = (_94 = res === null || res === void 0 ? void 0 : res.req) === null || _94 === void 0 ? void 0 : _94.session) === null || _95 === void 0 ? void 0 : _95.is_authenticated,
                                            error: null,
                                            warning: null,
                                            success: null,
                                            status_code: 400,
                                            status_title: "Bad Request",
                                            status_description: "Wondering from where have you requested this url, but you can click the button below\n                                to go back to the homepage.",
                                            url: '/',
                                            label: 'Home'
                                        });
                                    }
                                    else if (req.isGet()) {
                                        return res.status(_status)
                                            .render('undefined_routes', {
                                            nav_title: '',
                                            path: '/undefined_routes/',
                                            is_authenticated: (_97 = (_96 = res === null || res === void 0 ? void 0 : res.req) === null || _96 === void 0 ? void 0 : _96.session) === null || _97 === void 0 ? void 0 : _97.is_authenticated,
                                            error: null,
                                            warning: null,
                                            success: null,
                                            status_code: 404,
                                            status_title: "UH OH! You're lost.",
                                            status_description: "The page you are looking for does not exist.\n                                How you got here is a mystery. But you can click the button below\n                                to go back to the homepage.",
                                            url: '/',
                                            label: 'Home'
                                        });
                                    }
                                    else if (req.isPatch()) {
                                        return res.status(_status)
                                            .render('undefined_routes', {
                                            nav_title: '',
                                            path: '/undefined_routes/',
                                            is_authenticated: (_99 = (_98 = res === null || res === void 0 ? void 0 : res.req) === null || _98 === void 0 ? void 0 : _98.session) === null || _99 === void 0 ? void 0 : _99.is_authenticated,
                                            error: null,
                                            warning: null,
                                            success: null,
                                            status_code: 400,
                                            status_title: "Bad Request",
                                            status_description: "Wondering from where have you requested this url, but you can click the button below\n                                to go back to the homepage.",
                                            url: '/',
                                            label: 'Home'
                                        });
                                    }
                                    else if (req.isPut()) {
                                        return res.status(_status)
                                            .render('undefined_routes', {
                                            nav_title: '',
                                            path: '/undefined_routes/',
                                            is_authenticated: (_101 = (_100 = res === null || res === void 0 ? void 0 : res.req) === null || _100 === void 0 ? void 0 : _100.session) === null || _101 === void 0 ? void 0 : _101.is_authenticated,
                                            error: null,
                                            warning: null,
                                            success: null,
                                            status_code: 400,
                                            status_title: "Bad Request",
                                            status_description: "Wondering from where have you requested this url, but you can click the button below\n                                to go back to the homepage.",
                                            url: '/',
                                            label: 'Home'
                                        });
                                    }
                                    else if (req.isDelete()) {
                                        return res.status(_status)
                                            .render('undefined_routes', {
                                            nav_title: '',
                                            path: '/undefined_routes/',
                                            is_authenticated: (_103 = (_102 = res === null || res === void 0 ? void 0 : res.req) === null || _102 === void 0 ? void 0 : _102.session) === null || _103 === void 0 ? void 0 : _103.is_authenticated,
                                            error: null,
                                            warning: null,
                                            success: null,
                                            status_code: 400,
                                            status_title: "Bad Request",
                                            status_description: "Wondering from where have you requested this url, but you can click the button below\n                                to go back to the homepage.",
                                            url: '/',
                                            label: 'Home'
                                        });
                                    }
                                }
                            });
                            httpServer = https_1.default.createServer(httpsOptions, this.app);
                            server = httpServer.listen(port, function () {
                                if (config.configurations().execution_point === _this.constants.NPM) {
                                    console.log('\u001b[' + 44 + 'm' + 'Express Server Is Running Natively On Port ' + port + '!' + '\u001b[0m');
                                }
                                else if (config.configurations().execution_point === _this.constants.PM2) {
                                    console.log('\u001b[' + 94 + 'm' + 'Running On Load Balancer PM2..!' + '\u001b[0m');
                                    console.log('\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m');
                                    process.send('ready');
                                }
                                else {
                                    console.log('\u001b[' + 44 + 'm' + 'Express Server Is Running Natively On Port ' + port + '!' + '\u001b[0m');
                                }
                                console.log('\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + ', Using TypeScript!' + '\u001b[0m');
                            });
                            return [2 /*return*/, server];
                    }
                });
            }); })();
        }
    };
    Server.prototype.port = function () {
        return config.configurations().server_port || this.constants.PORTS.SERVER_PORT;
    };
    Server.init = function () {
        return Server.getServerInstance().run();
    };
    return Server;
}());
exports.Server = Server;
Server.init();
