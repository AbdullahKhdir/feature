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
var CartItem_1 = __importDefault(require("./CartItem"));
var User_1 = __importDefault(require("./User"));
module.exports = /** @class */ (function (_super) {
    __extends(Product, _super);
    function Product() {
        var _this = _super.call(this) || this;
        _this.canCreate = true;
        _this.canUpdate = true;
        _this.canDelete = true;
        _this.primaryKey = "id";
        _this.table = "sql_database.tbl_products";
        _this.genericReferences = {};
        _this.reverseReferences = {
            get_products: {
                name: "product_cart_items",
                table: "sql_database.tbl_cart_items",
                class: CartItem_1.default,
                column: "product_id"
            }
        };
        _this.modelColumns = {
            id: {
                label: "id",
                // todo add to all models
                isPrimaryKey: true
            },
            user_id: {
                label: "user_id",
                references: {
                    name: "user_products",
                    table: "sql_database.tbl_users",
                    class: User_1.default,
                    column: "id"
                },
                // todo add to all models and check in sqlModel
                isForeignKey: true,
                required: true
            },
            title: {
                label: "title",
                required: true
            },
            imageUrl: {
                label: "imageUrl",
                required: false
            },
            description: {
                label: "description",
                required: true
            },
            price: {
                label: "price",
                required: true
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
    return Product;
}(SqlModel_1.default));
