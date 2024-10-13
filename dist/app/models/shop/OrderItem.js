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
var Order_1 = __importDefault(require("./Order"));
var Product_1 = __importDefault(require("./Product"));
module.exports = /** @class */ (function (_super) {
    __extends(OrderItem, _super);
    function OrderItem() {
        var _this = _super.call(this) || this;
        _this.canCreate = true;
        _this.canUpdate = true;
        _this.canDelete = true;
        _this.primaryKey = "id";
        _this.table = "sql_database.tbl_order_items";
        _this.genericReferences = {};
        _this.reverseReferences = {};
        _this.modelColumns = {
            id: {
                label: "Id"
            },
            quantity: {
                label: "Quantity",
                required: true
            },
            order_id: {
                label: "Order Id",
                references: {
                    name: "order_items",
                    table: "sql_database.tbl_orders",
                    class: Order_1.default,
                    column: "id"
                },
                required: true
            },
            product_id: {
                label: "Product Id",
                references: {
                    name: "order_products_items",
                    table: "sql_database.tbl_products",
                    class: Product_1.default,
                    column: "id"
                },
                required: true
            },
            created_at: {
                label: "Created at",
                type: "DATETIME"
            },
            updated_at: {
                label: "Updated at",
                type: "DATETIME"
            }
        };
        _this.columns = function () { return _this.modelColumns; };
        _this.initializeModel();
        return _this;
    }
    return OrderItem;
}(SqlModel_1.default));
