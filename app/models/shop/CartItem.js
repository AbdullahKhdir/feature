'use strict';

const BaseModel = require("../../../core/model/BaseModel");
const Lodash    = require("../../utils/Lodash");

/**
 * @class CartItem
 * @constructor
 * @extends BaseModel
 * @description Defining Model CartItem
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class CartItem extends BaseModel{

    constructor() {
        super();

        this.table = 'node.tbl_cart_items';
        this.columns = {
            id: {
                label: 'Id',
            },
            quantity: {
                label: 'Quantity'
            },
            cart_id: {
                label: 'Cart Id',
                references: {
                    name: 'items_cart',
                    table: 'node.tbl_carts',
                    class: 'shop/Cart'          
                }
            },
            product_id: {
                label: 'Product Id',
                references: {
                    name: 'items_cart_products',
                    table: 'node.tbl_products',
                    class: 'shop/Products'
                }
            },
            created_at: {
                label: 'Created at'
            },
            updated_at: {
                label: 'Updated at'
            }
        };

        this.__ = new Lodash().__;
    }
};