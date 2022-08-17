'use strict';

const BaseModel = require("../../../core/model/BaseModel");
const Lodash    = require("../../utils/Lodash");

/**
 * @class Cart
 * @constructor
 * @extends BaseModel
 * @description Defining Model Cart
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Cart extends BaseModel{

    constructor() {
        super();

        this.table = 'node.tbl_carts';
        this.reverse_references = {
            getProducts: {
                table: 'node.tbl_cart_items',
                class: 'shop/CartItem',
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
                    name: 'user_cart',
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