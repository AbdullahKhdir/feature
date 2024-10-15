"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressResponse = void 0;
var config = __importStar(require("../config"));
var ApiException_1 = __importDefault(require("../exception/ApiException"));
var Singleton_1 = require("../Singleton/Singleton");
var undefined_routes_logic_1 = require("../utils/undefined-routes-logic");
var Error_1 = __importDefault(require("../error/types/Error"));
/**
 * @class Response
 * @constructor
 * @description Class Response is used to define the Response Objects
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
var ExpressResponse = /** @class */ (function () {
    function ExpressResponse(statusCode, message) {
        if (message === void 0) { message = ""; }
        this.message = message;
        this.statusCode = statusCode;
        this.constants = Singleton_1.Singleton.getConstants();
        this.express = Singleton_1.Singleton.getExpress();
        this._ = Singleton_1.Singleton.getLodash();
    }
    Object.defineProperty(ExpressResponse.prototype, "getMessage", {
        /**
         * @function getMessage
         * @description getter for the property message
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns {string}
         */
        get: function () {
            return this.message;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ExpressResponse.prototype, "setMessage", {
        /**
         * @function setMessage
         * @description setter for the property message
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         */
        set: function (message) {
            this.message = message;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ExpressResponse.prototype, "getStatusCode", {
        /**
         * @function getStatusCode
         * @description getter for the status code
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns {number}
         */
        get: function () {
            return this.statusCode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ExpressResponse.prototype, "setStatusCode", {
        /**
         * @function setStatusCode
         * @description setter for the property statusCode
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         */
        set: function (statusCode) {
            this.statusCode = statusCode;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @function renderAsJson
     * @description Sends a json response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Response} resopnse
     * @param {any} data
     * @param {number} status
     * @returns {Response}
     */
    ExpressResponse.prototype.renderAsJson = function (resopnse, data, status) {
        var _a;
        if (status === void 0) { status = this.constants.HTTPS_STATUS.SUCCESS.OK; }
        resopnse.type(this.constants.RESPONSE.TYPES.JSON);
        return resopnse.status((_a = this.getStatusCode) !== null && _a !== void 0 ? _a : status).json(ExpressResponse.sanitize(data));
    };
    /**
     * @function render
     * @description Sends a html response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Response} response
     * @param {string} template
     * @param {object} options
     * @param {Function} callback
     * @param Number status
     * @returns {Response}
     */
    ExpressResponse.prototype.render = function (response, template, options, status, callback) {
        var _this = this;
        var _a, _b;
        if (options === void 0) { options = {}; }
        if (status === void 0) { status = this.constants.HTTPS_STATUS.SUCCESS.OK; }
        response.type(this.constants.RESPONSE.TYPES.HTML);
        if (callback) {
            response
                .status((_a = this.getStatusCode) !== null && _a !== void 0 ? _a : status)
                .render(template, options, function (error, html) {
                if (error) {
                    response
                        .status(_this.constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR)
                        .send("An error occurred while rendering the page. \n ".concat(error));
                }
                else {
                    callback(error, html);
                }
            });
            return response;
        }
        response.status((_b = this.getStatusCode) !== null && _b !== void 0 ? _b : status).render(template, options);
        return response;
    };
    /**
     * @function redirect
     * @description redirect response to html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Response} response
     * @param {string} url
     * @param {number} status
     * @returns {Response}
     */
    ExpressResponse.prototype.redirect = function (response, url, status) {
        var _a;
        if (status === void 0) { status = this.constants.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY; }
        response.type(this.constants.RESPONSE.TYPES.HTML);
        response.redirect((_a = this.getStatusCode) !== null && _a !== void 0 ? _a : status, url);
        return response;
    };
    /**
     * @function toSameSite
     * @description redirect response to html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Response} response
     * @param {number} status
     * @returns {Response}
     */
    ExpressResponse.prototype.toSameSite = function (response, status) {
        var _a;
        if (status === void 0) { status = this.constants.HTTPS_STATUS.REDIRECTION.PERMANENT_REDIRECT; }
        response.type(this.constants.RESPONSE.TYPES.HTML);
        response.redirect((_a = this.getStatusCode) !== null && _a !== void 0 ? _a : status, response.req.url);
        return response;
    };
    /**
     * @function postToSameSite
     * @description redirect response to html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Response} response
     * @param {number} status
     * @returns {Response}
     */
    ExpressResponse.prototype.postToSameSite = function (response, status) {
        var _a;
        if (status === void 0) { status = this.constants.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY; }
        response.type(this.constants.RESPONSE.TYPES.HTML);
        response.redirect((_a = this.getStatusCode) !== null && _a !== void 0 ? _a : status, response.req.route.path);
        return response;
    };
    /**
     * @function siteNotFound
     * @description undefined_routes html page
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Response} response
     * @returns {Response}
     */
    ExpressResponse.prototype.siteNotFound = function (response) {
        return this.render(response, "undefined_routes", (0, undefined_routes_logic_1.siteNotFound)(response), this.constants.HTTPS_STATUS.CLIENT_ERRORS.NOT_FOUND);
    };
    /**
     * @function onErrorValidation
     * @description renders all the validation errors back to the user
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Response} response
     * @param {object[] | string} errors
     * @returns {Response}
     */
    ExpressResponse.prototype.onErrorValidation = function (response, errors) {
        response.type(this.constants.RESPONSE.TYPES.HTML);
        if (!response.req.flash) {
            throw new Error("Flash middleware is not initialized");
        }
        if (typeof errors !== "undefined") {
            if (this._.isArray(errors) && !this._.isEmpty(errors)) {
                var objWarnings_1 = {};
                var erroredParams_1 = {};
                errors.forEach(function (error, index) {
                    var _a, _b;
                    Object.assign(objWarnings_1, (_a = {}, _a[index] = "".concat(error.msg), _a));
                    Object.assign(erroredParams_1, (_b = {}, _b[index] = "".concat(error.param), _b));
                });
                response.req.flash("validationErrors", JSON.stringify(objWarnings_1));
                response.req.flash("erroredInputs", JSON.stringify(erroredParams_1));
            }
            else if (typeof errors === "string") {
                var error = errors;
                response.req.flash("validationErrors", JSON.stringify({ error: error }));
                response.req.flash("erroredInputs", JSON.stringify({ error: error }));
            }
        }
        var status = null;
        if (response.req.method === this.constants.REQUEST.TYPE.GET) {
            status = this.constants.HTTPS_STATUS.REDIRECTION.PERMANENT_REDIRECT;
        }
        else if (response.req.method === this.constants.REQUEST.TYPE.POST) {
            status = this.constants.HTTPS_STATUS.REDIRECTION.MOVED_PERMANENTLY;
        }
        else {
            status = this.constants.HTTPS_STATUS.REDIRECTION.TEMPORARY_REDIRECT;
        }
        response.redirect(status, response.req.url || "/");
        return response;
    };
    /**
     * @function sendPdf
     * @description returns a pdf file to be downloaded instantly
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Response} response
     * @param {PDFKit.PDFDocument | ReadStream} pdf
     * @param {string} pdf_name
     * @param {boolean} to_download
     * @returns {Response}
     */
    ExpressResponse.prototype.sendPdf = function (response, pdf, pdf_name, to_download) {
        if (pdf_name === void 0) { pdf_name = "pdf"; }
        if (to_download === void 0) { to_download = false; }
        var date = new Date();
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, "0");
        var day = String(date.getDate()).padStart(2, "0");
        var hours = String(date.getHours()).padStart(2, "0");
        var minutes = String(date.getMinutes()).padStart(2, "0");
        response.setHeader("Content-Type", this.constants.RESPONSE.TYPES.PDF);
        response.setHeader("Content-Disposition", "".concat(to_download ? "attachment" : "inline", "; filename=\"").concat(year, "_").concat(month, "_").concat(day, "_").concat(hours, "_").concat(minutes, "_").concat(pdf_name, ".pdf\""));
        pdf.pipe(response);
        return response;
    };
    /**
     * @function invalidCsrfResponse
     * @description undefined_routes html page for invalid csrf response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Response} response
     * @returns {Response}
     */
    ExpressResponse.prototype.invalidCsrfResponse = function (response) {
        return this.render(response, "undefined_routes", (0, undefined_routes_logic_1.csrf)(response), undefined, this.constants.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN);
    };
    /**
     * @function onError
     * @description undefined_routes html page on throwing an error
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Response} response
     * @param {NextFunction} next
     * @param {Error | string | { message?: string; statusCode: number }} error
     * @returns {Response | void}
     */
    ExpressResponse.prototype.onError = function (response, next, error) {
        var _a, _b, _c;
        var environment = config.configurations().environment;
        var detailedError = this.getDetailedError();
        var error_message = typeof error === "string" ? error : error instanceof Error ? (_a = error.stack) !== null && _a !== void 0 ? _a : "" : "Unexpected error";
        if (environment === "development") {
            if (typeof error === "string") {
                error = error + "\n".concat(detailedError);
                var customError = new Error_1.default(error);
                customError.statusCode = this.constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
                return next(customError);
            }
            else if (error instanceof Error) {
                error.message = "".concat(error.stack);
                return next(error);
            }
            return this.renderErrorPage(response, "Unexpected error", 500, "Please contact the support team.");
        }
        if (error instanceof Error && !(error instanceof ApiException_1.default)) {
            console.error(error_message);
            error.statusCode = 500;
            return next((_b = error.stack) !== null && _b !== void 0 ? _b : "\n".concat(detailedError));
        }
        else if (typeof error === "string") {
            var genericError = new Error(error + "\n".concat(detailedError));
            return next(genericError);
        }
        else if (typeof error === "object" && error instanceof ApiException_1.default) {
            return next((_c = error.stack) !== null && _c !== void 0 ? _c : "\n".concat(detailedError));
        }
        return this.renderErrorPage(response, error_message, 500, "Unexpected error occurred.");
    };
    /**
     * @function renderErrorPage
     * @description undefined_routes html page on throwing an error
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Response} response
     * @param {string} title
     * @param {number} statusCode
     * @param {string} description
     * @returns {Response}
     */
    ExpressResponse.prototype.renderErrorPage = function (response, title, statusCode, description) {
        var _a, _b;
        return this.render(response, "undefined_routes", {
            nav_title: "",
            path: "/undefined_routes/",
            isUserAuthenticated: (_b = (_a = response === null || response === void 0 ? void 0 : response.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.isUserAuthenticated,
            error: null,
            warning: null,
            success: null,
            status_code: statusCode,
            status_title: title,
            status_description: description,
            url: "/",
            label: "Home"
        }, undefined, this.constants.HTTPS_STATUS.SERVER_ERRORS.SERVICE_UNAVAILABLE);
    };
    /**
     * @function send
     * @description Sends a html response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Response} response
     * @param {any} body
     * @param {number} status
     * @returns Response
     */
    ExpressResponse.prototype.send = function (response, body, status) {
        var _a;
        if (status === void 0) { status = this.constants.HTTPS_STATUS.SUCCESS.OK; }
        response.type(this.constants.RESPONSE.TYPES.HTML);
        response.status((_a = this.statusCode) !== null && _a !== void 0 ? _a : status).send(body);
        return response;
    };
    /**
     * @function sanitize
     * @description Prepares and cleans the json data to be send in the response
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Response} response
     * @returns {object}
     */
    ExpressResponse.sanitize = function (response) {
        var clone = {};
        Object.assign(clone, response);
        for (var i in clone)
            if (typeof clone[i] === "undefined")
                delete clone[i];
        return clone;
    };
    /**
     * @function getErrorDetails
     * @description Captures and returns detailed error information, including function name, file name, line number, and column number.
     * @returns {string} A string containing error information.
     */
    ExpressResponse.prototype.getDetailedError = function () {
        var util = require("node:util");
        var callSites = util.getCallSite(); // Adjust based on actual util method availability
        var detailedError = "\n Stack Trace: \n";
        callSites.forEach(function (callSite, index) {
            var _a, _b, _c, _d;
            detailedError += "CallSite ".concat(index + 1, ": \n");
            detailedError += "Function Name: ".concat((_a = callSite.functionName) !== null && _a !== void 0 ? _a : "N/A", " \n");
            detailedError += "Script Name: ".concat((_b = callSite.scriptName) !== null && _b !== void 0 ? _b : "N/A", " \n");
            detailedError += "Line Number: ".concat((_c = callSite.lineNumer) !== null && _c !== void 0 ? _c : "N/A", " \n");
            detailedError += "Column Number: ".concat((_d = callSite.column) !== null && _d !== void 0 ? _d : "N/A", " \n");
        });
        return detailedError || "Unable to extract stack trace.";
    };
    return ExpressResponse;
}());
exports.ExpressResponse = ExpressResponse;
