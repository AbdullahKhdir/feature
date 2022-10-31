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
        while (_) try {
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
var https_1 = __importDefault(require("https"));
var os_1 = __importDefault(require("os"));
var endpoints_1 = require("./core/api/apis_endpoints/endpoints");
var config = __importStar(require("./core/config"));
var Singleton_1 = require("./core/Singleton/Singleton");
var _404_logic_1 = require("./core/utils/404-logic");
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
            /*
            !  DO NOT USE THIS IN PRODUCTION ENVIRONMENT
            * ONLY FOR DEVELOPMENT PURPOSES
            */
            var mkcert_1 = require('mkcert');
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var ca, cert, httpsOptions, port, server;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, mkcert_1.createCA({
                                organization: 'Node School',
                                countryCode: 'DE',
                                state: 'Bavaria',
                                locality: 'Nuremberg',
                                validityDays: 1
                            })];
                        case 1:
                            ca = _a.sent();
                            return [4 /*yield*/, mkcert_1.createCert({
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
                            //****\\
                            //* Will be triggered only on errors or next(new Error('error message')) or next({error: 'checked'}) *\\
                            //****\\
                            //@ts-ignore
                            this.app.use(function (err, req, res, next) {
                                if (err.code === _this.constants.CSRF.errCode) {
                                    return res.status(_this.constants.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN).render('undefined_routes', (0, _404_logic_1.csrf)(res));
                                }
                                var _status = err.statusCode || _this.constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
                                var message = err.message;
                                var is_api_endpoint = false;
                                endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                    if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                        || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                        || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                        is_api_endpoint = true;
                                    }
                                });
                                if (is_api_endpoint) {
                                    return res.status(_status).json({ message: message });
                                }
                                else {
                                    if (err) {
                                        if (Object.keys('statusCode')) {
                                            req.origin = req.headers.origin || req.get('origin');
                                            err.statusCode = err.statusCode ? err.statusCode : 500;
                                            // @ts-ignore
                                            switch (err.statusCode) {
                                                case 503:
                                                    endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                        if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                            || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                            || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                            return res.status(_status).json({ statusCode: 503, message: 'Service is not available' });
                                                        }
                                                    });
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/404/',
                                                        is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: 503,
                                                        status_title: "Exception is thrown.",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case 500:
                                                    endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                        if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                            || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                            || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                            console.log('checked');
                                                            return res.status(_status).json({ statusCode: 500, message: 'Internal Server Error' });
                                                        }
                                                    });
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/404/',
                                                        is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: 500,
                                                        status_title: "Unexpected error",
                                                        status_description: _this.__.capitalize(err.message || 'Please contact the support team!') || "Please contact the support team!",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case 400:
                                                    endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                        if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                            || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                            || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                            return res.status(_status).json({ statusCode: 400, message: 'Bad Request' });
                                                        }
                                                    });
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/404/',
                                                        is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: 400,
                                                        status_title: "Bad Request",
                                                        status_description: "Wondering from where have you requested this url, but you can click the button below\n                                            to go back to the homepage.",
                                                        url: '/',
                                                        label: 'Home'
                                                    });
                                                    break;
                                                case 404:
                                                    endpoints_1.ENDPOINTS.forEach(function (endpoint) {
                                                        if (endpoints_1.ENDPOINTS.includes(req.headers.referer || '')
                                                            || endpoints_1.ENDPOINTS.includes(req.originalUrl || '')
                                                            || endpoints_1.ENDPOINTS.includes(req.url || '')) {
                                                            return res.status(_status).json({ statusCode: 404, message: 'Site Not Found!' });
                                                        }
                                                    });
                                                    return res.status(_status)
                                                        .render('undefined_routes', {
                                                        nav_title: '',
                                                        path: '/404/',
                                                        is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
                                                        error: null,
                                                        warning: null,
                                                        success: null,
                                                        status_code: 404,
                                                        status_title: "UH OH! You're lost.",
                                                        status_description: "The page you are looking for does not exist.\n                                            How you got here is a mystery. But you can click the button below\n                                            to go back to the homepage.",
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
                                            path: '/404/',
                                            is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
                                            error: null,
                                            warning: null,
                                            success: null,
                                            status_code: 404,
                                            status_title: "UH OH! You're lost.",
                                            status_description: "The page you are looking for does not exist.\n                                    How you got here is a mystery. But you can click the button below\n                                    to go back to the homepage.",
                                            url: '/',
                                            label: 'Home'
                                        });
                                    }
                                    else if (req.isPatch()) {
                                        return res.status(_status)
                                            .render('undefined_routes', {
                                            nav_title: '',
                                            path: '/404/',
                                            is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
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
                                            path: '/404/',
                                            is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
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
                                            path: '/404/',
                                            is_authenticated: res ? res.req ? res.req.session ? res.req.session.is_authenticated ? res.req.session.is_authenticated : false : false : false : false,
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
                            server = https_1.default
                                .createServer(httpsOptions, this.app).listen(port, function () {
                                if (config.configurations().execution_point === _this.constants.NPM) {
                                    console.log('\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m');
                                }
                                else if (config.configurations().execution_point === _this.constants.PM2) {
                                    console.log('\u001b[' + 94 + 'm' + 'Running PM2..!' + '\u001b[0m');
                                    console.log('\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m');
                                    process.send('ready');
                                }
                                else {
                                    console.log('\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + '!' + '\u001b[0m');
                                }
                                console.log('\u001b[' + 44 + 'm' + 'Express Server Is Running On Port ' + port + ', Using TS!' + '\u001b[0m');
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
        Server.getServerInstance().run();
    };
    return Server;
}());
Server.init();
