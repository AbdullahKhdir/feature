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
var Singleton_1 = require("../../Singleton/Singleton");
var ExpressResponse_1 = require("../ExpressResponse");
module.exports = /** @class */ (function (_super) {
    __extends(JsonResponse, _super);
    function JsonResponse(code, message, data) {
        var _this = this;
        var _constants = Singleton_1.Singleton.getConstants();
        _this = _super.call(this, code || _constants.HTTPS_STATUS.SUCCESS.OK, message) || this;
        _this.jsonMessage = message;
        _this.data = data;
        _this.code = code;
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
        return _super.prototype.renderAsJson.call(this, res, Object.assign({ status_code: this.code || Singleton_1.Singleton.getConstants().HTTPS_STATUS.SUCCESS.OK }, { message: this.jsonMessage }, { data: this.data }));
    };
    return JsonResponse;
}(ExpressResponse_1.ExpressResponse));
