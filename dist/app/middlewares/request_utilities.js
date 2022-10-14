"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reqUtil = void 0;
var Singleton_1 = require("../../core/Singleton/Singleton");
function reqUtil(req, res, next) {
    var constants = Singleton_1.Singleton.getConstants();
    res.globalPostFormData = function () { return res.locals['post_data'] ? res.locals['post_data'] : ''; };
    res.globalGetFormData = function () { return res.locals['get_data'] ? res.locals['get_data'] : ''; };
    req.sendFormPostedData = function () { return req.setProp('post_data', req.getAllFormPostedData()); };
    req.getAllFormPostedData = function () { return req.body ? req.file ? Object.assign(req.body, req.file) : req.files ? Object.assign(req.body, req.files) : req.body : ''; };
    req.getUploadedFiles = function () { return req.file ? req.file : req.files ? req.files : {}; };
    req.getUploadedFile = function () { return req.file ? req.file : {}; };
    req.getFormPostedData = function (param) { return req.body ? req.body[param] ? req.body[param].toString() : '' : ''; };
    req.getQueryParams = function () { return req.query ? req.query : ''; };
    req.getQueryParam = function (param) { return req.query ? req.query[param] ? req.query[param] : '' : ''; };
    req.getDynamicParams = function () { return req.params ? req.params : ''; };
    req.getDynamicParam = function (param) { return req.params ? req.params[param] ? req.params[param] : '' : ''; };
    req.isGet = function () { return req.method === constants.REQUEST.TYPE.GET; };
    req.isPost = function () { return req.method === constants.REQUEST.TYPE.POST; };
    req.isPut = function () { return req.method === constants.REQUEST.TYPE.PUT; };
    req.isPatch = function () { return req.method === constants.REQUEST.TYPE.PATCH; };
    req.isDelete = function () { return req.method === constants.REQUEST.TYPE.DELETE; };
    req.getCurrentUser = function () {
        if (res.req.session.is_authenticated) {
            return req.session.currentUser;
        }
        return null;
    };
}
exports.reqUtil = reqUtil;
