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
var Singleton_1 = require("../Singleton/Singleton");
var config = __importStar(require("../config"));
module.exports = /** @class */ (function (_super_1) {
    __extends(ApiError, _super_1);
    function ApiError(status_code, message) {
        var _this = this;
        var _super = _this = _super_1.call(this, message) || this;
        // @ts-ignore
        _super.statusCode = status_code;
        return _this;
    }
    ApiError.errorHandler = function (error) {
        var _a;
        var CLIENT = Singleton_1.Singleton.getConstants().HTTPS_STATUS.CLIENT_ERRORS;
        var SERVER = Singleton_1.Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS;
        var UNOFFICIAL_CODES = Singleton_1.Singleton.getConstants().HTTPS_STATUS.UNOFFICIAL_CODES;
        var INTERNET_INFORMATION_SERVICES = Singleton_1.Singleton.getConstants().HTTPS_STATUS.INTERNET_INFORMATION_SERVICES;
        var _ = Singleton_1.Singleton.getLodash();
        return _a = {},
            _a[CLIENT.BAD_REQUEST] = {
                status_code: CLIENT.BAD_REQUEST,
                status_title: "Bad Request",
                status_description: "Wondering from where have you requested this url, but you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.CONFLICT] = {
                status_code: CLIENT.CONFLICT,
                status_title: "Conflict!",
                status_description: "The page you are looking for has a conflict with other resource!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.EXPECTATION_FAILED] = {
                status_code: CLIENT.EXPECTATION_FAILED,
                status_title: "Expectation failed!",
                status_description: "Expectation failed!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.FAILED_DEPENDENCY] = {
                status_code: CLIENT.FAILED_DEPENDENCY,
                status_title: 'Failed dependency!',
                status_description: "Failed dependency!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.FORBIDDEN] = {
                status_code: CLIENT.FORBIDDEN,
                status_title: "Access forbidden!",
                status_description: "Access forbidden!, please make sure you are not altering or manipulating any dom elements, but you can go back to homepage",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.GONE] = {
                status_code: CLIENT.GONE,
                status_title: "Gone!",
                status_description: "Gone response!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.IM_A_TEAPOT] = {
                status_code: CLIENT.IM_A_TEAPOT,
                status_title: "I'm a TEAPOT!",
                status_description: "I'm a TEAPOT!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.LENGTH_REQUIRED] = {
                status_code: CLIENT.LENGTH_REQUIRED,
                status_title: "Length required!",
                status_description: "Length required!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.LOCKED] = {
                status_code: CLIENT.LOCKED,
                status_title: 'Request is locked!',
                status_description: "Request is locked!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.METHOD_NOT_ALLOWED] = {
                status_code: CLIENT.METHOD_NOT_ALLOWED,
                status_title: "Method Not Allowed!",
                status_description: "Method Not Allowed!, we don't know how you ended up in here, but you can go back to the homepage",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.MISDIRECTED_REQUEST] = {
                status_code: CLIENT.MISDIRECTED_REQUEST,
                status_title: 'Misdirected request!',
                status_description: "Misdirected request!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.NOT_ACCEPTABLE] = {
                status_code: CLIENT.NOT_ACCEPTABLE,
                status_title: "Not acceptable!",
                status_description: "Not acceptable!.\n                How you got here is a mystery. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.PAYLOAD_TOO_LARGE] = {
                status_code: CLIENT.PAYLOAD_TOO_LARGE,
                status_title: "Payload too large!",
                status_description: "Payload too large!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.PAYMENT_REQUIRED] = {
                status_code: CLIENT.PAYMENT_REQUIRED,
                status_title: "Payment Error, please try again!",
                status_description: "Unexpected error happened while processing the payment . But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.PRECONDITION_FAILED] = {
                status_code: CLIENT.PRECONDITION_FAILED,
                status_title: "Precondition failed!",
                status_description: "Precondition failed!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.PRECONDITION_REQUIRED] = {
                status_code: CLIENT.PRECONDITION_REQUIRED,
                status_title: 'Precondition required!',
                status_description: "Precondition required!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.PROXY_AUTHENTICATION_REQUIRED] = {
                status_code: CLIENT.PROXY_AUTHENTICATION_REQUIRED,
                status_title: "Proxy authentication required!",
                status_description: "The page you are looking for needs authentication from a proxy!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.RANGE_NOT_SATISFIABLE] = {
                status_code: CLIENT.RANGE_NOT_SATISFIABLE,
                status_title: "Range not satisfiable!",
                status_description: "Range not satisfiable!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.REQUEST_HEADER_FIELDS_TOO_LARGE] = {
                status_code: CLIENT.REQUEST_HEADER_FIELDS_TOO_LARGE,
                status_title: 'Request header fields too large!',
                status_description: "Request header fields too large!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.REQUEST_TIMEOUT] = {
                status_code: CLIENT.REQUEST_TIMEOUT,
                status_title: "Request timeout!",
                status_description: "The page you are looking for has been timed out!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.SITE_NOT_FOUND] = {
                status_code: CLIENT.SITE_NOT_FOUND,
                status_title: "UH OH! You're lost.",
                status_description: "The page you are looking for does not exist.\n                How you got here is a mystery. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.TOO_EARLY] = {
                status_code: CLIENT.TOO_EARLY,
                status_title: 'Too early!',
                status_description: "Too early!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.TOO_MANY_REQUESTS] = {
                status_code: CLIENT.TOO_MANY_REQUESTS,
                status_title: 'Too many requests!',
                status_description: "Too many requests!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.UNAUTHORIZED] = {
                status_code: CLIENT.UNAUTHORIZED,
                status_title: "Not authorized!",
                status_description: "The requested page requires an authentication. But you can click the button below\n                to go login page.",
                url: '/login',
                label: 'Go Login'
            },
            _a[CLIENT.UNAVAILABLE_FOR_LEGAL_REASONS] = {
                status_code: CLIENT.UNAVAILABLE_FOR_LEGAL_REASONS,
                status_title: 'Unavailable for legal reasons!',
                status_description: "Unavailable for legal reasons!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.UNPROCESSABLE_ENTITY] = {
                status_code: CLIENT.UNPROCESSABLE_ENTITY,
                status_title: 'Wrong input!',
                status_description: "Wrong input!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.UNSUPPORTED_MEDIA_TYPE] = {
                status_code: CLIENT.UNSUPPORTED_MEDIA_TYPE,
                status_title: "Unsupported media type!",
                status_description: "Unsupported media type!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.UPGRADE_REQUIRED] = {
                status_code: CLIENT.UPGRADE_REQUIRED,
                status_title: 'Upgrade required!',
                status_description: "Upgrade required!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[CLIENT.URI_TOO_LONG] = {
                status_code: CLIENT.URI_TOO_LONG,
                status_title: "URI too long!",
                status_description: "URI too long!. But you can click the button below\n                to go back to the homepage.",
                url: '/',
                label: 'Home'
            },
            _a[SERVER.INTERNAL_SERVER_ERROR] = {
                status_code: SERVER.INTERNAL_SERVER_ERROR,
                status_title: "Unexpected error",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[SERVER.NOT_IMPLEMENTED] = {
                status_code: SERVER.NOT_IMPLEMENTED,
                status_title: "Not implemented Error!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[SERVER.BAD_GATEWAY] = {
                status_code: SERVER.BAD_GATEWAY,
                status_title: "Bad Gateway Error!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[SERVER.SERVICE_UNAVAILABLE] = {
                status_code: SERVER.SERVICE_UNAVAILABLE,
                status_title: "Service is not available!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[SERVER.GATEWAY_TIMEOUT] = {
                status_code: SERVER.GATEWAY_TIMEOUT,
                status_title: "Gateway timeout!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[SERVER.HTTP_VERSION_NOT_SUPPORTED] = {
                status_code: SERVER.HTTP_VERSION_NOT_SUPPORTED,
                status_title: "Http version not supported!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[SERVER.VARIANT_ALSO_NEGOTIATES] = {
                status_code: SERVER.VARIANT_ALSO_NEGOTIATES,
                status_title: "Variant also negotiates!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[SERVER.INSUFFICIENT_STORAGE] = {
                status_code: SERVER.INSUFFICIENT_STORAGE,
                status_title: "Insufficient storage!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[SERVER.LOOP_DETECTED] = {
                status_code: SERVER.LOOP_DETECTED,
                status_title: "Loop detected!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[SERVER.NOT_EXTENDED] = {
                status_code: SERVER.NOT_EXTENDED,
                status_title: "Not extended!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[SERVER.NETWORK_AUTHENTICATION_REQUIRED] = {
                status_code: SERVER.NETWORK_AUTHENTICATION_REQUIRED,
                status_title: "Network authentication required!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[UNOFFICIAL_CODES.PAGE_EXPIRED] = {
                status_code: UNOFFICIAL_CODES.PAGE_EXPIRED,
                status_title: "Page expired!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[UNOFFICIAL_CODES.METHOD_FAILURE] = {
                status_code: UNOFFICIAL_CODES.METHOD_FAILURE,
                status_title: "Method failure!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[UNOFFICIAL_CODES.ENHANCE_YOUR_CALM] = {
                status_code: UNOFFICIAL_CODES.ENHANCE_YOUR_CALM,
                status_title: "Enhance your calm!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[UNOFFICIAL_CODES.REQUEST_HEADER_FIELDS_TOO_LARGE] = {
                status_code: UNOFFICIAL_CODES.REQUEST_HEADER_FIELDS_TOO_LARGE,
                status_title: "Request header fields too large!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[UNOFFICIAL_CODES.BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS] = {
                status_code: UNOFFICIAL_CODES.BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS,
                status_title: "Blocked by windows parental controls!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[UNOFFICIAL_CODES.INVALID_TOKEN] = {
                status_code: UNOFFICIAL_CODES.INVALID_TOKEN,
                status_title: "Invalid token!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[UNOFFICIAL_CODES.TOKEN_REQUIRED] = {
                status_code: UNOFFICIAL_CODES.TOKEN_REQUIRED,
                status_title: "Token required!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[UNOFFICIAL_CODES.BANDWIDTH_LIMIT_EXCEEDED] = {
                status_code: UNOFFICIAL_CODES.BANDWIDTH_LIMIT_EXCEEDED,
                status_title: "Bandwidth limit exceeded!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[UNOFFICIAL_CODES.SITE_IS_OVERLOADED] = {
                status_code: UNOFFICIAL_CODES.SITE_IS_OVERLOADED,
                status_title: "Site is overloaded!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[UNOFFICIAL_CODES.SITE_IS_FROZEN] = {
                status_code: UNOFFICIAL_CODES.SITE_IS_FROZEN,
                status_title: "Site is frozen!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[UNOFFICIAL_CODES.NETWORK_READ_TIMEOUT_ERROR] = {
                status_code: UNOFFICIAL_CODES.NETWORK_READ_TIMEOUT_ERROR,
                status_title: "Network read timeout error!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[UNOFFICIAL_CODES.NETWORK_CONNECT_TIMEOUT_ERROR] = {
                status_code: UNOFFICIAL_CODES.NETWORK_CONNECT_TIMEOUT_ERROR,
                status_title: "Network connect timeout error!",
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[INTERNET_INFORMATION_SERVICES.LOGIN_TIME_OUT] = {
                status_code: INTERNET_INFORMATION_SERVICES.LOGIN_TIME_OUT,
                status_title: 'Login time out!',
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[INTERNET_INFORMATION_SERVICES.NGINX.NO_RESPONSE] = {
                status_code: INTERNET_INFORMATION_SERVICES.NGINX.NO_RESPONSE,
                status_title: 'No response from nginx!',
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[INTERNET_INFORMATION_SERVICES.NGINX.REQUEST_HEADER_TOO_LARGE] = {
                status_code: INTERNET_INFORMATION_SERVICES.NGINX.REQUEST_HEADER_TOO_LARGE,
                status_title: 'Request header too large!',
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[INTERNET_INFORMATION_SERVICES.NGINX.SSL_CERTIFICATE_ERROR] = {
                status_code: INTERNET_INFORMATION_SERVICES.NGINX.SSL_CERTIFICATE_ERROR,
                status_title: 'Ssl certificate error!',
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[INTERNET_INFORMATION_SERVICES.NGINX.SSL_CERTIFICATE_REQUIRED] = {
                status_code: INTERNET_INFORMATION_SERVICES.NGINX.SSL_CERTIFICATE_REQUIRED,
                status_title: 'Ssl certificate required!',
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[INTERNET_INFORMATION_SERVICES.NGINX.HTTP_REQUEST_SENT_TO_HTTPS_PORT] = {
                status_code: INTERNET_INFORMATION_SERVICES.NGINX.HTTP_REQUEST_SENT_TO_HTTPS_PORT,
                status_title: 'Http request sent to https port!',
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a[INTERNET_INFORMATION_SERVICES.NGINX.CLIENT_CLOSED_REQUEST] = {
                status_code: INTERNET_INFORMATION_SERVICES.NGINX.CLIENT_CLOSED_REQUEST,
                status_title: 'Client closed request!',
                status_description: _.capitalize(error.message || 'Please contact the support team!') || "Please contact the support team!",
                url: !error.message ? "mailto:".concat(config.configurations().support_team_email) : '/',
                label: !error.message ? 'Send an E-Mail To Support Team' : 'Home'
            },
            _a;
    };
    return ApiError;
}(Error));
