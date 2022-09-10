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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var BaseModel_1 = __importDefault(require("../../../core/model/BaseModel"));
module.exports = /** @class */ (function (_super) {
    __extends(OrderItem, _super);
    function OrderItem() {
        var _this = _super.call(this) || this;
        _this.can_create = true;
        _this.can_update = true;
        _this.can_delete = true;
        _this.primary_key = 'id';
        _this.table = 'node.tbl_order_items';
        _this.columns = {
            id: {
                label: 'Id',
            },
            quantity: {
                label: 'Quantity',
                required: true
            },
            order_id: {
                label: 'Order Id',
                references: {
                    name: 'order_items',
                    table: 'node.tbl_orders',
                    class: 'shop/Order'
                },
                required: true
            },
            product_id: {
                label: 'Product Id',
                references: {
                    name: 'order_products_items',
                    table: 'node.tbl_products',
                    class: 'shop/Products'
                },
                required: true
            },
            created_at: {
                label: 'Created at',
                type: 'datetime'
            },
            updated_at: {
                label: 'Updated at',
                type: 'datetime'
            }
        };
        return _this;
        // this.descripeTable(this.table)
        // .then(result => {
        //     let db_columns_list: any = [];
        //     const columns = result[0];
        //     let invalid_columns = [];
        //     // @ts-ignore 
        //     columns.forEach(column => {
        //         /*
        //         * If columns is in the db but not in this.columns, it will get populated
        //         */
        //         if (Object.keys(this.columns).indexOf(column['Field']) === -1 && column['Key'] !== 'PRI') {
        //             this.columns[column['Field']] = {
        //                 label:   this.__.capitalize(this.__.startCase(column['Field'])),
        //                 type:    column['Type'],
        //                 default: column['Default'] ? column['Default'] : null,
        //             }
        //         }
        //         db_columns_list.push(column["Field"]);
        //     });
        //     /*
        //     * If columns is not in the db but in this.columns, a run time exception will be thrown
        //     */
        //     invalid_columns = Object.keys(this.columns).filter(x => !db_columns_list.includes(x));
        //     if (!this.__.isEmpty(invalid_columns)) {
        //         throw new RuntimeException(
        //             "Columns ["+
        //             invalid_columns.join(',')+" "+
        //             "] not available in database for the Model "+
        //             getClass(this)
        //         );
        //     }
        //     return;
        // })
        // .catch(err => {throw err});
    }
    return OrderItem;
}(BaseModel_1.default));
