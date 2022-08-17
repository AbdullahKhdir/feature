'use strict';

const BaseModel = require("../../../core/model/BaseModel");
const Lodash    = require("../../utils/Lodash");

/**
 * @class Order
 * @constructor
 * @extends BaseModel
 * @description Defining Model Order
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Order extends BaseModel{

    constructor() {
        super();

        this.table = 'node.tbl_orders';
        this.reverse_references = {
            getProducts: {
                table: 'node.tbl_order_items',
                class: 'shop/OrderItem',
                column: 'product_id',
                setting: {
                    where_column: 'user_id',
                    where_table: 'node.tbl_products'
                }
            }
        };
        this.columns = {
            id: {
                label: 'id'
            },
            user_id: {
                label: 'user_id',
                references: {
                    name: 'user_order',
                    table: 'node.tbl_users',
                    class: 'shop/User'
                }
            },
            created_at: {
                label: 'created_at'
            },
            updated_at: {
                label: 'updated_at'
            }
        };

        this.__ = new Lodash().__;
    }
};