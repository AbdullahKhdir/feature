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
var SqlModel_1 = __importDefault(require("../../../core/model/SqlModel"));
module.exports = /** @class */ (function (_super) {
    __extends(Session, _super);
    function Session() {
        var _this = _super.call(this) || this;
        _this.canCreate = false;
        _this.canUpdate = false;
        _this.canDelete = false;
        _this.primaryKey = "session_id";
        _this.table = "sql_database.sessions";
        _this.genericReferences = {};
        _this.reverseReferences = {};
        _this.modelColumns = {
            session_id: {
                label: "Session id"
            },
            expires: {
                label: "Expires",
                required: true
            },
            data: {
                label: "Data",
                required: true
            }
        };
        _this.columns = function () { return _this.modelColumns; };
        _this.initializeModel();
        return _this;
    }
    return Session;
}(SqlModel_1.default));
