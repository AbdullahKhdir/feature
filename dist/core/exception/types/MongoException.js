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
var Singleton_1 = require("../../Singleton/Singleton");
var ApiException_1 = __importDefault(require("../ApiException"));
module.exports = /** @class */ (function (_super) {
    __extends(MongoException, _super);
    function MongoException(message, statusCode) {
        if (message === void 0) { message = ""; }
        if (statusCode === void 0) { statusCode = Singleton_1.Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR; }
        var _this = _super.call(this, "MongoException", message, statusCode) || this;
        Object.setPrototypeOf(_this, MongoException.prototype);
        return _this;
    }
    return MongoException;
}(ApiException_1.default));