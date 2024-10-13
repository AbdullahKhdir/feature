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
var Cart_1 = __importDefault(require("./Cart"));
var Product_1 = __importDefault(require("./Product"));
module.exports = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        var _this = _super.call(this) || this;
        _this.canCreate = true;
        _this.canUpdate = true;
        _this.canDelete = false;
        _this.primaryKey = "id";
        _this.table = "sql_database.tbl_users";
        _this.genericReferences = {};
        _this.reverseReferences = {
            product_user_id: {
                name: "user_products",
                table: "sql_database.tbl_products",
                class: Product_1.default,
                column: "user_id"
            },
            cart_user_id: {
                name: "user_cart",
                table: "sql_database.tbl_carts",
                class: Cart_1.default,
                column: "user_id"
            }
        };
        _this.modelColumns = {
            id: {
                label: "id",
                type: "AUTO_INCREMENT"
            },
            first_name: {
                label: "First Name",
                required: true,
                type: "VARCHAR"
            },
            last_name: {
                label: "Last Name",
                required: true,
                type: "VARCHAR"
            },
            email: {
                label: "email",
                required: true,
                type: "VARCHAR"
            },
            password: {
                label: "password",
                required: true,
                type: "VARCHAR"
            },
            created_at: {
                label: "created_at",
                type: "DATETIME"
            },
            updated_at: {
                label: "updated_at",
                type: "DATETIME"
            }
        };
        _this.columns = function () { return _this.modelColumns; };
        _this.initializeModel();
        return _this;
    }
    return User;
}(SqlModel_1.default));
