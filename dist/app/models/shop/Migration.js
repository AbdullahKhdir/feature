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
    __extends(Migration, _super);
    function Migration() {
        var _this = _super.call(this) || this;
        _this.canCreate = true;
        _this.canUpdate = false;
        _this.canDelete = false;
        _this.primaryKey = "id";
        _this.table = "sql_database.tbl_db_migrations";
        _this.genericReferences = {};
        _this.reverseReferences = {};
        _this.modelColumns = {
            id: {
                label: "Id"
            },
            migrations_file_name: {
                label: "Migrations File Name",
                required: true
            },
            migrations_sql: {
                label: "Migrations Sql",
                required: true
            },
            created_at: {
                label: "Created at",
                type: "DATETIME"
            }
        };
        _this.columns = function () { return _this.modelColumns; };
        _this.initializeModel();
        return _this;
    }
    return Migration;
}(SqlModel_1.default));
