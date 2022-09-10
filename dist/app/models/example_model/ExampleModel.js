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
    __extends(ExampleModel, _super);
    function ExampleModel() {
        var _this = _super.call(this) || this;
        /*
         * The first source table of the model
         */
        _this.table = 'database_name.table_name';
        /*
         * reverse_references are used to fetch th data from the
         * constraint's relation between two tables.
         *
         * Options:
         * 1- table: set the target table. (the second target table)
         * 2- class: set the Model class path
         * 3- column: set the constraint's field (foreign key)
         * 4- setting:
         *  4.1- where_column: to retrieve the data after a specific field for example user id (from a the third table, optional)
         *  4.2- where_table:  the third table to make the comparison with it's column e.g. user id
         */
        // this.reverse_references = {
        //     getProducts: {
        //         table: 'node.tbl_cart_items',
        //         class: 'shop/CartItem',
        //         column: 'product_id',
        //         setting: {
        //             where_column: 'user_id',
        //             where_table: 'node.tbl_products'
        //         }
        //     }
        // };
        _this.columns = {
            first_column: {
                /*
                 * The label of this column (effects rendering)
                 */
                label: 'first_column',
                /*
                 * If this columns references between two tables.
                 *
                 * Options:
                 * name:  When fetching from the methods of the BaseModel,
                 *        you will see "user_cart" function as promise ready to be used as pre fetched data between the two tables.
                 *        IMPORTANT: the name must be giving, think of it like a variable initialization or definition,
                 *        that has pre fetched data, which are under your disposal by any BaseModel function's call.
                 * table: Constraint's relation between this model's table and node.tbl_users table
                 * class: The Class name of the target table
                 */
                // references: {
                //     name: 'user_cart',
                //     table: 'node.tbl_users',
                //     class: 'shop/User',
                //     column: 'id' //Default primary key
                // }
            },
            second_column: {
                label: 'second_column'
            },
            third_column: {
                label: 'third_column'
            },
            fourth_column: {
                label: 'fourth_column'
            },
            etc: {
                label: 'etc'
            }
        };
        return _this;
    }
    return ExampleModel;
}(BaseModel_1.default));
