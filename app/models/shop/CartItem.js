'use strict';

const BaseModel = require("../../../core/model/BaseModel");
const Lodash = require("../../utils/Lodash");

module.exports = class CartItem extends BaseModel{

    constructor() {
        super();

        this.table = 'node.cart_items';
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
                    table: 'node.carts',
                    class: 'shop/Cart'          
                }
            },
            product_id: {
                label: 'Product Id',
                references: {
                    name: 'items_cart_products',
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