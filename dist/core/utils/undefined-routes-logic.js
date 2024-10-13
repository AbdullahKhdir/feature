"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.undefinedHttpRequest = exports.error = exports.exception = exports.siteNotFound = exports.csrf = void 0;
var capitalize = function (s) { return s && s[0].toUpperCase() + s.slice(1); };
function csrf(res, object) {
    var _a, _b;
    if (object === void 0) { object = {}; }
    var _object = {
        nav_title: "",
        path: "/undefined_routes/",
        isUserAuthenticated: (_b = (_a = res === null || res === void 0 ? void 0 : res.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.isUserAuthenticated,
        error: "",
        warning: "",
        success: null,
        status_code: 403,
        status_title: "Request was interrupted!",
        status_description: "Please do not alter or delete the csrf token!",
        url: "/",
        label: "Home"
    };
    return Object.assign(_object, object);
}
exports.csrf = csrf;
function siteNotFound(res, return_type, object) {
    var _a, _b;
    if (return_type === void 0) { return_type = "template"; }
    if (object === void 0) { object = {}; }
    var _object;
    if (return_type === "template") {
        _object = {
            nav_title: "",
            path: "/undefined_routes/",
            isUserAuthenticated: (_b = (_a = res === null || res === void 0 ? void 0 : res.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.isUserAuthenticated,
            error: null,
            warning: null,
            success: null,
            status_code: 404,
            status_title: "UH OH! You're lost.",
            status_description: "The page you are looking for does not exist.\n            How you got here is a mystery. But you can click the button below\n            to go back to the homepage.",
            url: "/",
            label: "Home"
        };
    }
    else {
        _object = {
            statusCode: 400,
            message: "Bad Request"
        };
    }
    return Object.assign(_object, object);
}
exports.siteNotFound = siteNotFound;
function exception(res, return_type, object) {
    var _a, _b;
    if (return_type === void 0) { return_type = "template"; }
    if (object === void 0) { object = {}; }
    var error_message = null;
    if (object instanceof Error) {
        error_message = object.message;
    }
    var _object;
    if (return_type === "template") {
        _object = {
            nav_title: "",
            path: "/undefined_routes/",
            isUserAuthenticated: (_b = (_a = res === null || res === void 0 ? void 0 : res.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.isUserAuthenticated,
            error: null,
            warning: null,
            success: null,
            status_code: 503,
            status_title: "Exception is thrown.",
            status_description: capitalize(error_message) || "Please contact the support team!",
            url: "/",
            label: "Home"
        };
    }
    else {
        _object = {
            statusCode: 503,
            message: capitalize(error_message) || "Please contact the support team!"
        };
    }
    return Object.assign(_object, object);
}
exports.exception = exception;
function error(res, return_type, object) {
    var _a, _b;
    if (return_type === void 0) { return_type = "template"; }
    if (object === void 0) { object = {}; }
    var error_message = null;
    if (object instanceof Error) {
        error_message = object.message;
    }
    var _object;
    if (return_type === "template") {
        _object = {
            nav_title: "",
            path: "/undefined_routes/",
            isUserAuthenticated: (_b = (_a = res === null || res === void 0 ? void 0 : res.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.isUserAuthenticated,
            error: null,
            warning: null,
            success: null,
            status_code: 500,
            status_title: "Unexpected error",
            status_description: capitalize(error_message) || "Please contact the support team!",
            url: "/",
            label: "Home"
        };
    }
    else {
        _object = {
            statusCode: 500,
            message: capitalize(error_message) || "Please contact the support team!"
        };
    }
    return Object.assign(_object, object);
}
exports.error = error;
function undefinedHttpRequest(res, return_type, object) {
    var _a, _b;
    if (return_type === void 0) { return_type = "template"; }
    if (object === void 0) { object = {}; }
    var _object;
    if (return_type === "template") {
        _object = {
            nav_title: "",
            path: "/undefined_routes/",
            isUserAuthenticated: (_b = (_a = res === null || res === void 0 ? void 0 : res.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.isUserAuthenticated,
            error: null,
            warning: null,
            success: null,
            status_code: 400,
            status_title: "Bad Request",
            status_description: "Wondering from where have you requested this url, but you can click the button below\n            to go back to the homepage.",
            url: "/",
            label: "Home"
        };
    }
    else {
        _object = {
            statusCode: 400,
            message: "Bad Request"
        };
    }
    return Object.assign(_object, object);
}
exports.undefinedHttpRequest = undefinedHttpRequest;
