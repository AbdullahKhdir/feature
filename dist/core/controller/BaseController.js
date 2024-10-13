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
var Route_1 = __importDefault(require("../routes/Route"));
var Singleton_1 = require("../Singleton/Singleton");
var undefined_routes_logic_1 = require("../utils/undefined-routes-logic");
var InternalError_1 = __importDefault(require("../error/types/InternalError"));
module.exports = /** @class */ (function (_super) {
    __extends(BaseController, _super);
    function BaseController() {
        var _this = _super.call(this) || this;
        _this.path = Singleton_1.Singleton.getPath();
        _this.fileSystem = Singleton_1.Singleton.getPromisifyFileSystem();
        return _this;
    }
    /**
     * @function deployRoutes
     * @description register all routes in express router
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Application} app
     * @return {Promise<void>}
     */
    BaseController.prototype.deployRoutes = function (app) {
        return __awaiter(this, void 0, void 0, function () {
            var directoryRoutes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        directoryRoutes = this.path.join(__dirname, "..", "..", "app", "controllers");
                        return [4 /*yield*/, this.processDirectory(directoryRoutes, app)];
                    case 1:
                        _a.sent();
                        this.undefinedRoutes(app);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @function processDirectory
     * @description
     * * Will automatically scan the controllers
     * * directory and loop each controller file
     * * and initiate new instance of each controller
     * * class and loop the methods array for any declared
     * * routes that will be deployed by the app via express
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {string} directory
     * @param {Application} app
     * @return {Promise<void>}
     */
    BaseController.prototype.processDirectory = function (directory, app) {
        return __awaiter(this, void 0, void 0, function () {
            var files, _loop_1, this_1, _i, files_1, file, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.fileSystem.readdir(directory, { withFileTypes: true })];
                    case 1:
                        files = _a.sent();
                        _loop_1 = function (file) {
                            var fullPath, routePath, Controller, instanceOf_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        fullPath = this_1.path.join(directory, file.name);
                                        if (!file.isDirectory()) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this_1.processDirectory(fullPath, app)];
                                    case 1:
                                        _b.sent();
                                        _b.label = 2;
                                    case 2:
                                        if (file.isFile() && file.name.endsWith(".js")) {
                                            routePath = fullPath.replace(/\\/g, "/");
                                            Controller = require(routePath);
                                            instanceOf_1 = new Controller();
                                            if (this_1._.isArray(instanceOf_1.methods) && instanceOf_1.methods.length > 0) {
                                                instanceOf_1.methods.forEach(function (route) {
                                                    if (typeof instanceOf_1[route] === "function") {
                                                        app.use(instanceOf_1[route]());
                                                    }
                                                });
                                            }
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, files_1 = files;
                        _a.label = 2;
                    case 2:
                        if (!(_i < files_1.length)) return [3 /*break*/, 5];
                        file = files_1[_i];
                        return [5 /*yield**/, _loop_1(file)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        if (error_1 instanceof Error) {
                            throw new InternalError_1.default(error_1.message);
                        }
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
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
     * @param {Express} app - The Express application instance.
     * @return {void}
     */
    BaseController.prototype.undefinedRoutes = function (app) {
        var _this = this;
        var methods = ["get", "post", "put", "patch", "delete"];
        this._.forEach(methods, function (method) {
            app.use(_this.route(method, "*", {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var routeExists;
                return __generator(this, function (_a) {
                    try {
                        routeExists = this.routeExists(req, app, method);
                        if (!routeExists) {
                            if (this._.get(req, "origin") !== this.constants.SITE_DOMAIN_AND_PORT) {
                                return [2 /*return*/, next((0, undefined_routes_logic_1.undefinedHttpRequest)(res, "json"))];
                            }
                            return [2 /*return*/, res
                                    .status(this.constants.HTTPS_STATUS.CLIENT_ERRORS.NOT_FOUND)
                                    .render("undefined_routes", (0, undefined_routes_logic_1.siteNotFound)(res))];
                        }
                        next();
                    }
                    catch (error) {
                        next(error);
                    }
                    return [2 /*return*/];
                });
            }); }));
        });
    };
    /**
     * @function routeExists
     * @description Checks if a route exists for the current request and method.
     * @param {Request} request - The current request object.
     * @param {Express} app - The Express application instance.
     * @param {string} method - The HTTP method (get, post, put, etc.).
     * @return {boolean} - Returns true if the route exists, otherwise false.
     */
    BaseController.prototype.routeExists = function (request, app, method) {
        var _this = this;
        var routes = [];
        this._.forEach(app._router.stack, function (middleware) {
            if (middleware.route) {
                var middlewareMethod = _this._.get(middleware, "route.methods.".concat(method));
                if (middlewareMethod) {
                    routes.push(middleware.route);
                }
            }
            else if (middleware.name === "router") {
                _this._.forEach(middleware.handle.stack, function (handler) {
                    var handlerMethod = _this._.get(handler, "route.methods.".concat(method));
                    if (handler.route && handlerMethod) {
                        routes.push(handler.route);
                    }
                });
            }
        });
        return this._.some(routes, function (route) { return _this.matchRoutePath(route.path, request.path); });
    };
    /**
     * @function matchRoutePath
     * @description Matches the current request path with the route path, considering dynamic segments.
     * @param {string} routePath - The route path defined in the Express app.
     * @param {string} requestPath - The path from the current request.
     * @return {boolean} - Returns true if the paths match, considering dynamic routes.
     */
    BaseController.prototype.matchRoutePath = function (routePath, requestPath) {
        var formattedRoutePath = this._.trimEnd(this._.toLower(routePath), "/");
        var formattedRequestPath = this._.trimEnd(this._.toLower(requestPath), "/");
        // Handle dynamic route segments, e.g., "/user/:id"
        if (this._.includes(formattedRoutePath, ":")) {
            var baseRoute = this._.trimEnd(this._.split(formattedRoutePath, ":")[0], "/");
            var baseRequest = this._.join(this._.slice(this._.split(formattedRequestPath, "/"), 0, this._.split(baseRoute, "/").length), "/");
            return baseRoute === baseRequest;
        }
        // Return true if the formatted paths match
        return formattedRoutePath === formattedRequestPath;
    };
    return BaseController;
}(Route_1.default));
