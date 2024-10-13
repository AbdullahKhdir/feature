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
var SecurityQuestion_1 = __importDefault(require("./SecurityQuestion"));
var User_1 = __importDefault(require("./User"));
module.exports = /** @class */ (function (_super) {
    __extends(UserSecurityQuestion, _super);
    function UserSecurityQuestion() {
        var _this = _super.call(this) || this;
        _this.canCreate = true;
        _this.canUpdate = true;
        _this.canDelete = true;
        _this.primaryKey = "id";
        _this.table = "sql_database.tbl_users_security_questions";
        _this.genericReferences = {};
        _this.reverseReferences = {};
        _this.modelColumns = {
            id: {
                label: "id",
                references: {
                    name: "user_security",
                    table: "sql_database.tbl_users",
                    class: User_1.default,
                    column: "id"
                },
                required: true
            },
            question: {
                label: "Question",
                references: {
                    name: "question_id",
                    table: "sql_database.tbl_security_questions",
                    class: SecurityQuestion_1.default,
                    column: "id"
                },
                required: true
            },
            created_at: {
                label: "Created at",
                type: "DATETIME"
            },
            updated_at: {
                label: "Update at",
                type: "DATETIME"
            }
        };
        _this.columns = function () { return _this.modelColumns; };
        _this.initializeModel();
        return _this;
    }
    return UserSecurityQuestion;
}(SqlModel_1.default));
