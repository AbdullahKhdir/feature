'use strict';

const BaseModel = require("../../../core/model/BaseModel");
const Lodash = require("../../utils/Lodash");

module.exports = class Cart extends BaseModel{

    constructor() {
        super();

        this.table = 'node.carts';
        this.reverse_references = {
            getProducts: {
                table: 'node.cart_items',
                class: 'shop/CartItem',
                column: 'product_id',
                setting: {
                    where_column: 'user_id',
                    where_table: 'node.products'
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
                    table: 'node.users',
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

        this._ = new Lodash()._;
    }
};