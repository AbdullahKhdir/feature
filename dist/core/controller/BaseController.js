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
var Route_1 = __importDefault(require("../routes/Route"));
var Singleton_1 = require("../Singleton/Singleton");
var _404_logic_1 = require("../utils/404-logic");
module.exports = /** @class */ (function (_super) {
    __extends(BaseController, _super);
    function BaseController() {
        var _this = _super.call(this) || this;
        _this.path = Singleton_1.Singleton.getPath();
        _this.file_system = Singleton_1.Singleton.getFileSystem();
        _this.constants = Singleton_1.Singleton.getConstants();
        return _this;
    }
    /**
     * @function deployRoutes
     * @description
     * * Will automatically scan the controllers
     * * directory and loop each controller file
     * * and initiate new instance of each controller
     * * class and loop the methods array for any declared
     * * routes that will be deployed by the app via express
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Application} app
     * @return void
     */
    BaseController.prototype.deployRoutes = function (app) {
        var _this = this;
        var directory_routes = this.path.join(__dirname, '..', '..', 'app', 'controllers');
        var methods_array = null;
        this.file_system.readdir(directory_routes, { withFileTypes: true }, function (err, files) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            /*
            * is a directory or is a file
            */
            files.forEach(function (file) {
                var is_dir = file.isDirectory();
                var is_file = file.isFile();
                if (is_file) {
                    /*
                     * let content   = this.file_system.readFileSync(directory_routes+'/'+file);
                    */
                    var file_name = _this.__.capitalize(file.name.substring(0, file.name.indexOf('js') - 1));
                    var route_name = require('../../app/controllers/' + file_name + '.js');
                    var instance_of = new route_name();
                    methods_array = instance_of.methods;
                    if (methods_array.length > 0) {
                        methods_array.forEach(function (route) {
                            eval('app.use(instance_of.' + route + '());');
                        });
                    }
                }
                else if (is_dir) {
                    var directory_name_1 = file.name;
                    _this.file_system.readdir(directory_routes + '/' + file.name, { withFileTypes: true }, function (err, files) {
                        if (err) {
                            return console.log('Unable to scan directory: ' + err);
                        }
                        files.forEach(function (file) {
                            var is_file = file.isFile();
                            if (is_file) {
                                var file_name = _this.__.capitalize(file.name.substring(0, file.name.indexOf('js') - 1));
                                var route_name = require('../../app/controllers/' + directory_name_1 + '/' + file_name + '.js');
                                var instance_of = new route_name();
                                methods_array = instance_of.methods;
                                if (methods_array.length > 0) {
                                    methods_array.forEach(function (route) {
                                        eval('app.use(instance_of.' + route + '());');
                                    });
                                }
                            }
                        });
                    });
                }
            });
        });
        // @ts-ignore
        this.undefinedRoutes(app);
    };
    /**
     * @function undefinedRoutes
     * @description
     * * Handles all incoming requests
     * * can be used to issue a requests tests
     * * or parsing or even filtering
     * * all requests will be checked if
     * * their path is a valid path
     * * if not it will render 404 page
     * * it acceptes all kind of routes with (next())
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Application} app
     * @return void
     */
    BaseController.prototype.undefinedRoutes = function (app) {
        var _this = this;
        var site_is_found = false;
        var is_post_request_successful = false;
        var is_put_request_successful = false;
        var is_patch_request_successful = false;
        var is_delete_request_successful = false;
        var _constants = this.constants;
        // @ts-ignore
        app.use(this.route('get', '*', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var route, routes, route_exists;
            var _this = this;
            return __generator(this, function (_a) {
                routes = [];
                // @ts-ignore
                app._router.stack.forEach(function (middleware) {
                    if (middleware.route) { // routes registered directly on the app
                        routes.push(middleware.route);
                    }
                    else if (middleware.name === 'router') { // router middleware 
                        middleware.handle.stack.forEach(function (handler) {
                            route = handler.route;
                            route && routes.push(route);
                        });
                    }
                });
                route_exists = routes.filter(function (route) {
                    return route.path.toString() === req.path.toString();
                });
                routes.forEach(function (route) {
                    var check_path = req.path.toString().slice(1, req.path.toString().length);
                    var direction = Object.assign(route.path.slice(1, route.path.length));
                    var predefined_direction_from_route = _this.__.toLower(direction.toString());
                    var requested_path_in_browser = _this.__.toLower(check_path.toString());
                    /*
                    * "/route" is same as "/route/"
                    */
                    if (_this.__.endsWith(requested_path_in_browser, '/') || _this.__.endsWith(predefined_direction_from_route, '/')) {
                        requested_path_in_browser = _this.__.trimEnd(requested_path_in_browser, '/');
                        predefined_direction_from_route = _this.__.trimEnd(predefined_direction_from_route, '/');
                    }
                    if (predefined_direction_from_route.includes(':')) {
                        var _predefined_direction_from_route = predefined_direction_from_route.substr(0, predefined_direction_from_route.indexOf(':') - 1);
                        var _requested_path_in_browser = requested_path_in_browser.substr(0, requested_path_in_browser.lastIndexOf('/'));
                        if (_predefined_direction_from_route === _requested_path_in_browser) {
                            if (_this.__.isEmpty(route_exists)) {
                                route_exists = 'dynamic routes';
                            }
                            site_is_found = true;
                        }
                    }
                    if (predefined_direction_from_route === requested_path_in_browser && route.methods.get) {
                        route_exists = 'true';
                        site_is_found = true;
                    }
                });
                if (this.__.isEmpty(route_exists)) {
                    if (req.origin !== _constants.SITE_DOMAIN_AND_PORT) {
                        return [2 /*return*/, next((0, _404_logic_1.undefinedHttpRequest)(res, 'json'))];
                    }
                    else {
                        return [2 /*return*/, res.status(_constants.HTTPS_STATUS.CLIENT_ERRORS.SITE_NOT_FOUND).render('undefined_routes', (0, _404_logic_1.siteNotFound)(res))];
                    }
                }
                if (site_is_found === true) {
                    next();
                    site_is_found = false;
                }
                else {
                    if (req.origin !== _constants.SITE_DOMAIN_AND_PORT) {
                        return [2 /*return*/, next((0, _404_logic_1.undefinedHttpRequest)(res, 'json'))];
                    }
                    else {
                        return [2 /*return*/, res.status(_constants.HTTPS_STATUS.CLIENT_ERRORS.SITE_NOT_FOUND).render('undefined_routes', (0, _404_logic_1.siteNotFound)(res))];
                    }
                }
                return [2 /*return*/];
            });
        }); }));
        // @ts-ignore
        app.use(this.route('post', '*', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var route, routes, route_exists;
            var _this = this;
            return __generator(this, function (_a) {
                routes = [];
                // @ts-ignore
                app._router.stack.forEach(function (middleware) {
                    if (middleware.route) { // routes registered directly on the app
                        routes.push(middleware.route);
                    }
                    else if (middleware.name === 'router') { // router middleware 
                        middleware.handle.stack.forEach(function (handler) {
                            route = handler.route;
                            route && routes.push(route);
                        });
                    }
                });
                route_exists = routes.filter(function (route) {
                    return route.path.toString() === req.path.toString();
                });
                routes.forEach(function (route) {
                    var check_path = req.path.toString().slice(1, req.path.toString().length);
                    var direction = Object.assign(route.path.slice(1, route.path.length));
                    var predefined_direction_from_route = _this.__.toLower(direction.toString());
                    var requested_path_in_browser = _this.__.toLower(check_path.toString());
                    /*
                    * "/route" is same as "/route/"
                    */
                    if (_this.__.endsWith(requested_path_in_browser, '/') || _this.__.endsWith(predefined_direction_from_route, '/')) {
                        requested_path_in_browser = _this.__.trimEnd(requested_path_in_browser, '/');
                        predefined_direction_from_route = _this.__.trimEnd(predefined_direction_from_route, '/');
                    }
                    if (predefined_direction_from_route.includes(':')) {
                        var _predefined_direction_from_route = predefined_direction_from_route.substr(0, predefined_direction_from_route.indexOf(':') - 1);
                        var _requested_path_in_browser = requested_path_in_browser.substr(0, requested_path_in_browser.lastIndexOf('/'));
                        if (_predefined_direction_from_route === _requested_path_in_browser) {
                            if (_this.__.isEmpty(route_exists)) {
                                route_exists = 'dynamic routes';
                            }
                            is_post_request_successful = true;
                        }
                    }
                    if (predefined_direction_from_route === requested_path_in_browser && route.methods.post) {
                        route_exists = 'true';
                        is_post_request_successful = true;
                    }
                });
                if (this.__.isEmpty(route_exists)) {
                    if (req.origin !== _constants.SITE_DOMAIN_AND_PORT) {
                        return [2 /*return*/, next((0, _404_logic_1.undefinedHttpRequest)(res, 'json'))];
                    }
                    else {
                        return [2 /*return*/, res.status(_constants.HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST).render('undefined_routes', (0, _404_logic_1.undefinedHttpRequest)(res))];
                    }
                }
                if (is_post_request_successful === true) {
                    next();
                    is_post_request_successful = false;
                }
                else {
                    if (req.origin !== _constants.SITE_DOMAIN_AND_PORT) {
                        return [2 /*return*/, next((0, _404_logic_1.undefinedHttpRequest)(res, 'json'))];
                    }
                    else {
                        return [2 /*return*/, res.status(_constants.HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST).render('undefined_routes', (0, _404_logic_1.undefinedHttpRequest)(res))];
                    }
                }
                return [2 /*return*/];
            });
        }); }));
        // @ts-ignore
        app.use(this.route('put', '*', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var route, routes, route_exists;
            var _this = this;
            return __generator(this, function (_a) {
                routes = [];
                // @ts-ignore
                app._router.stack.forEach(function (middleware) {
                    if (middleware.route) { // routes registered directly on the app
                        routes.push(middleware.route);
                    }
                    else if (middleware.name === 'router') { // router middleware 
                        middleware.handle.stack.forEach(function (handler) {
                            route = handler.route;
                            route && routes.push(route);
                        });
                    }
                });
                route_exists = routes.filter(function (route) {
                    return route.path.toString() === req.path.toString();
                });
                routes.forEach(function (route) {
                    var check_path = req.path.toString().slice(1, req.path.toString().length);
                    var direction = Object.assign(route.path.slice(1, route.path.length));
                    var predefined_direction_from_route = _this.__.toLower(direction.toString());
                    var requested_path_in_browser = _this.__.toLower(check_path.toString());
                    /*
                    * "/route" is same as "/route/"
                    */
                    if (_this.__.endsWith(requested_path_in_browser, '/') || _this.__.endsWith(predefined_direction_from_route, '/')) {
                        requested_path_in_browser = _this.__.trimEnd(requested_path_in_browser, '/');
                        predefined_direction_from_route = _this.__.trimEnd(predefined_direction_from_route, '/');
                    }
                    if (predefined_direction_from_route.includes(':')) {
                        var _predefined_direction_from_route = predefined_direction_from_route.substr(0, predefined_direction_from_route.indexOf(':') - 1);
                        var _requested_path_in_browser = requested_path_in_browser.substr(0, requested_path_in_browser.lastIndexOf('/'));
                        if (_predefined_direction_from_route === _requested_path_in_browser) {
                            if (_this.__.isEmpty(route_exists)) {
                                route_exists = 'dynamic routes';
                            }
                            is_put_request_successful = true;
                        }
                    }
                    if (predefined_direction_from_route === requested_path_in_browser && route.methods.post) {
                        route_exists = 'true';
                        is_put_request_successful = true;
                    }
                });
                if (this.__.isEmpty(route_exists)) {
                    if (req.origin !== _constants.SITE_DOMAIN_AND_PORT) {
                        return [2 /*return*/, next((0, _404_logic_1.undefinedHttpRequest)(res, 'json'))];
                    }
                    else {
                        return [2 /*return*/, res.status(_constants.HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST).render('undefined_routes', (0, _404_logic_1.undefinedHttpRequest)(res))];
                    }
                }
                if (is_put_request_successful === true) {
                    next();
                    is_put_request_successful = false;
                }
                else {
                    if (req.origin !== _constants.SITE_DOMAIN_AND_PORT) {
                        return [2 /*return*/, next((0, _404_logic_1.undefinedHttpRequest)(res, 'json'))];
                    }
                    else {
                        return [2 /*return*/, res.status(_constants.HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST).render('undefined_routes', (0, _404_logic_1.undefinedHttpRequest)(res))];
                    }
                }
                return [2 /*return*/];
            });
        }); }));
        // @ts-ignore
        app.use(this.route('patch', '*', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var route, routes, route_exists;
            var _this = this;
            return __generator(this, function (_a) {
                routes = [];
                // @ts-ignore
                app._router.stack.forEach(function (middleware) {
                    if (middleware.route) { // routes registered directly on the app
                        routes.push(middleware.route);
                    }
                    else if (middleware.name === 'router') { // router middleware 
                        middleware.handle.stack.forEach(function (handler) {
                            route = handler.route;
                            route && routes.push(route);
                        });
                    }
                });
                route_exists = routes.filter(function (route) {
                    return route.path.toString() === req.path.toString();
                });
                routes.forEach(function (route) {
                    var check_path = req.path.toString().slice(1, req.path.toString().length);
                    var direction = Object.assign(route.path.slice(1, route.path.length));
                    var predefined_direction_from_route = _this.__.toLower(direction.toString());
                    var requested_path_in_browser = _this.__.toLower(check_path.toString());
                    /*
                    * "/route" is same as "/route/"
                    */
                    if (_this.__.endsWith(requested_path_in_browser, '/') || _this.__.endsWith(predefined_direction_from_route, '/')) {
                        requested_path_in_browser = _this.__.trimEnd(requested_path_in_browser, '/');
                        predefined_direction_from_route = _this.__.trimEnd(predefined_direction_from_route, '/');
                    }
                    if (predefined_direction_from_route.includes(':')) {
                        var _predefined_direction_from_route = predefined_direction_from_route.substr(0, predefined_direction_from_route.indexOf(':') - 1);
                        var _requested_path_in_browser = requested_path_in_browser.substr(0, requested_path_in_browser.lastIndexOf('/'));
                        if (_predefined_direction_from_route === _requested_path_in_browser) {
                            if (_this.__.isEmpty(route_exists)) {
                                route_exists = 'dynamic routes';
                            }
                            is_patch_request_successful = true;
                        }
                    }
                    if (predefined_direction_from_route === requested_path_in_browser && route.methods.post) {
                        route_exists = 'true';
                        is_patch_request_successful = true;
                    }
                });
                if (this.__.isEmpty(route_exists)) {
                    if (req.origin !== _constants.SITE_DOMAIN_AND_PORT) {
                        return [2 /*return*/, next((0, _404_logic_1.undefinedHttpRequest)(res, 'json'))];
                    }
                    else {
                        return [2 /*return*/, res.status(_constants.HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST).render('undefined_routes', (0, _404_logic_1.undefinedHttpRequest)(res))];
                    }
                }
                if (is_patch_request_successful === true) {
                    next();
                    is_patch_request_successful = false;
                }
                else {
                    if (req.origin !== _constants.SITE_DOMAIN_AND_PORT) {
                        return [2 /*return*/, next((0, _404_logic_1.undefinedHttpRequest)(res, 'json'))];
                    }
                    else {
                        return [2 /*return*/, res.status(_constants.HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST).render('undefined_routes', (0, _404_logic_1.undefinedHttpRequest)(res))];
                    }
                }
                return [2 /*return*/];
            });
        }); }));
        // @ts-ignore
        app.use(this.route('delete', '*', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var route, routes, route_exists;
            var _this = this;
            return __generator(this, function (_a) {
                routes = [];
                // @ts-ignore
                app._router.stack.forEach(function (middleware) {
                    if (middleware.route) { // routes registered directly on the app
                        routes.push(middleware.route);
                    }
                    else if (middleware.name === 'router') { // router middleware 
                        middleware.handle.stack.forEach(function (handler) {
                            route = handler.route;
                            route && routes.push(route);
                        });
                    }
                });
                route_exists = routes.filter(function (route) {
                    return route.path.toString() === req.path.toString();
                });
                routes.forEach(function (route) {
                    var check_path = req.path.toString().slice(1, req.path.toString().length);
                    var direction = Object.assign(route.path.slice(1, route.path.length));
                    var predefined_direction_from_route = _this.__.toLower(direction.toString());
                    var requested_path_in_browser = _this.__.toLower(check_path.toString());
                    /*
                    * "/route" is same as "/route/"
                    */
                    if (_this.__.endsWith(requested_path_in_browser, '/') || _this.__.endsWith(predefined_direction_from_route, '/')) {
                        requested_path_in_browser = _this.__.trimEnd(requested_path_in_browser, '/');
                        predefined_direction_from_route = _this.__.trimEnd(predefined_direction_from_route, '/');
                    }
                    if (predefined_direction_from_route.includes(':')) {
                        var _predefined_direction_from_route = predefined_direction_from_route.substr(0, predefined_direction_from_route.indexOf(':') - 1);
                        var _requested_path_in_browser = requested_path_in_browser.substr(0, requested_path_in_browser.lastIndexOf('/'));
                        if (_predefined_direction_from_route === _requested_path_in_browser) {
                            if (_this.__.isEmpty(route_exists)) {
                                route_exists = 'dynamic routes';
                            }
                            is_delete_request_successful = true;
                        }
                    }
                    if (predefined_direction_from_route === requested_path_in_browser && route.methods.post) {
                        route_exists = 'true';
                        is_delete_request_successful = true;
                    }
                });
                if (this.__.isEmpty(route_exists)) {
                    if (req.origin !== _constants.SITE_DOMAIN_AND_PORT) {
                        return [2 /*return*/, next((0, _404_logic_1.undefinedHttpRequest)(res, 'json'))];
                    }
                    else {
                        return [2 /*return*/, res.status(_constants.HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST).render('undefined_routes', (0, _404_logic_1.undefinedHttpRequest)(res))];
                    }
                }
                if (is_delete_request_successful === true) {
                    next();
                    is_delete_request_successful = false;
                }
                else {
                    if (req.origin !== _constants.SITE_DOMAIN_AND_PORT) {
                        return [2 /*return*/, next((0, _404_logic_1.undefinedHttpRequest)(res, 'json'))];
                    }
                    else {
                        return [2 /*return*/, res.status(_constants.HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST).render('undefined_routes', (0, _404_logic_1.undefinedHttpRequest)(res))];
                    }
                }
                return [2 /*return*/];
            });
        }); }));
    };
    return BaseController;
}(Route_1.default));
