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
    __extends(SecurityQuestion, _super);
    function SecurityQuestion() {
        var _this = _super.call(this) || this;
        _this.canCreate = false;
        _this.canUpdate = false;
        _this.canDelete = true;
        _this.primaryKey = "id";
        _this.table = "sql_database.tbl_security_questions";
        _this.genericReferences = {};
        _this.modelColumns = {
            id: {
                label: "Id",
                required: true
            },
            question: {
                label: "Question",
                required: true
            },
            created_at: {
                label: "Created at",
                required: true,
                type: "DATETIME"
            },
            updated_at: {
                label: "Updated at",
                required: true,
                type: "DATETIME"
            }
        };
        _this.reverseReferences = {};
        _this.columns = function () { return _this.modelColumns; };
        _this.initializeModel();
        return _this;
    }
    return SecurityQuestion;
}(SqlModel_1.default));
