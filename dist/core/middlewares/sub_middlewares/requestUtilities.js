"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reqUtil = void 0;
var Singleton_1 = require("../../Singleton/Singleton");
var reqUtil = function (req, res, next) {
    var constants = Singleton_1.Singleton.getConstantsInstance();
    res.globalPostFormData = function () { return (res.locals["postData"] ? res.locals["postData"] : ""); };
    res.globalGetFormData = function () { return (res.locals["getData"] ? res.locals["getData"] : ""); };
    req.sendFormPostedData = function () { return req.setProp("postData", req.getAllFormPostedData()); };
    req.getAllFormPostedData = function () {
        var _a = req.body || {}, _ = _a["x-csrf-token"], filteredBody = __rest(_a, ["x-csrf-token"]);
        return req.file
            ? Object.assign(filteredBody, req.file)
            : req.files
                ? Object.assign(filteredBody, req.files)
                : filteredBody;
    };
    req.getUploadedFiles = function () { return (req.file ? req.file : req.files ? req.files : {}); };
    req.getUploadedFile = function () { return (req.file ? req.file : {}); };
    req.getFormPostedData = function (param) { return (req.body ? (req.body[param] ? req.body[param].toString() : "") : ""); };
    req.getQueryParams = function () { return (req.query ? req.query : ""); };
    req.getQueryParam = function (param) { return (req.query ? (req.query[param] ? req.query[param] : "") : ""); };
    req.getDynamicParams = function () { return (req.params ? req.params : ""); };
    req.getDynamicParam = function (param) { return (req.params ? (req.params[param] ? req.params[param] : "") : ""); };
    req.isGet = function () { return req.method === constants.REQUEST.TYPE.GET; };
    req.isPost = function () { return req.method === constants.REQUEST.TYPE.POST; };
    req.isPut = function () { return req.method === constants.REQUEST.TYPE.PUT; };
    req.isPatch = function () { return req.method === constants.REQUEST.TYPE.PATCH; };
    req.isDelete = function () { return req.method === constants.REQUEST.TYPE.DELETE; };
    req.getCurrentUser = function () {
        if (res.req.session.isUserAuthenticated) {
            return req.session.currentUser;
        }
        return null;
    };
    next();
};
exports.reqUtil = reqUtil;
