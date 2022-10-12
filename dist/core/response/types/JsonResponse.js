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
var Singleton_1 = require("../../Singleton/Singleton");
var ExpressResponse_1 = require("../ExpressResponse");
module.exports = /** @class */ (function (_super) {
    __extends(JsonResponse, _super);
    function JsonResponse(message, data) {
        var _this = this;
        var _constants = Singleton_1.Singleton.getConstants();
        _this = _super.call(this, _constants.HTTPS_STATUS.SUCCESS.OK, 'OK', message) || this;
        _this._message = message;
        _this.data = data;
        return _this;
    }
    /**
     * @function sendAsJson
     * @description Sends json response to the client
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Response res
     * @returns Response
    */
    JsonResponse.prototype.sendAsJson = function (res) {
        return _super.prototype.renderAsJson.call(this, res, Object.assign({ status_code: Singleton_1.Singleton.getConstants().HTTPS_STATUS.SUCCESS.OK }, { message: this.getMessage() }, { data: this.getData() }));
    };
    /**
     * @function getData
     * @description Gets the json data
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Object
    */
    JsonResponse.prototype.getData = function () {
        return this.data;
    };
    /**
     * @function getMessage
     * @description Gets the message
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Object
    */
    JsonResponse.prototype.getMessage = function () {
        return this.message;
    };
    return JsonResponse;
}(ExpressResponse_1.ExpressResponse));
