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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var endpoints_1 = require("../api/apis_endpoints/endpoints");
var RuntimeException_1 = __importDefault(require("../exception/types/RuntimeException"));
var ExpressResponse_1 = require("../response/ExpressResponse");
var Promise_1 = __importDefault(require("../utils/Promise"));
module.exports = /** @class */ (function (_super) {
    __extends(Routes, _super);
    function Routes() {
        var _this = _super.call(this) || this;
        _this.router = _this.initializeRouter();
        _this.corsOptions = _this.initializeCorsOptions();
        return _this;
    }
    Routes.prototype.initializeRouter = function () {
        var options = {
            caseSensitive: false,
            mergeParams: true,
            strict: false // Enable strict routing.
        };
        return this.express.getExpress.Router(options);
    };
    Routes.prototype.initializeCorsOptions = function () {
        return {
            origin: "https://localhost:8010.com",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            preflightContinue: false,
            maxAge: 86400,
            allowedHeaders: ["Content-Type", "Authorization"],
            optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
        };
    };
    /**
     * @function Route
     * @description  Initiate new route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} method
     * @param {String} url
     * @param {Object} middleware
     * @param {Function} callback
     * @return {ExpressRoute}
     */
    Routes.prototype.route = function (method, url, middleware, callback, is_api_endpoint) {
        if (is_api_endpoint === void 0) { is_api_endpoint = false; }
        if (!method || !url || typeof callback !== "function") {
            throw new RuntimeException_1.default("Invalid route configuration: Missing method, url, or callback");
        }
        var routeMiddleware = [];
        for (var key in middleware) {
            if (Object.hasOwnProperty.call(middleware, key)) {
                routeMiddleware.push(middleware[key]);
            }
        }
        if (is_api_endpoint) {
            endpoints_1.ENDPOINTS.push(url);
        }
        var validMethods = ["get", "post", "put", "patch", "delete"];
        var lowerMethod = method.toLowerCase();
        if (validMethods.includes(lowerMethod)) {
            if (typeof callback !== "function") {
                throw new RuntimeException_1.default("Callback is not a function for route ".concat(url));
            }
            return this.router[lowerMethod](url, routeMiddleware, (0, Promise_1.default)(callback));
        }
        else {
            throw new RuntimeException_1.default("Invalid HTTP method: ".concat(method));
        }
    };
    /**
     * @function isApiEndpoint
     * @description Check if the URL matches any string from the API endpoints array
     * @version 1.0.0
     * @param {Request} req
     * @return {boolean}
     */
    Routes.prototype.isApiEndpoint = function (req) {
        var referrer = req.headers.referer || "";
        var url = req.originalUrl || req.url || "";
        return endpoints_1.ENDPOINTS.includes(referrer) || endpoints_1.ENDPOINTS.includes(url);
    };
    return Routes;
}(ExpressResponse_1.ExpressResponse));
