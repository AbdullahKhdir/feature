'use strict';

const BaseModel = require("../../../core/model/BaseModel");
const Lodash    = require("../../utils/Lodash");

/**
 * @class OrderItem
 * @constructor
 * @extends BaseModel
 * @description Defining Model OrderItem
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class OrderItem extends BaseModel{

    constructor() {
        super();

        this.table = 'node.order_items';
        this.columns = {
            id: {
                label: 'Id',
            },
            quantity: {
                label: 'Quantity'
            },
            order_id: {
                label: 'Order Id',
                references: {
                    name: 'order_items',
                    table: 'node.orders',
                    class: 'shop/Order'
                }
            },
            product_id: {
                label: 'Product Id',
                references: {
                    name: 'order_products_items',
                    table: 'node.products',
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

        this._ = new Lodash()._;
    }
};