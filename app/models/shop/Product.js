'use strict';

const BaseModel = require("../../../core/model/BaseModel");
const Lodash    = require("../../utils/Lodash");

/**
 * @class Product
 * @constructor
 * @extends BaseModel
 * @description Defining Model Product
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Product extends BaseModel {
    constructor() {
        super();

        this.table = 'node.products';
        this.reverse_references = {
            getProducts: {
                table: 'node.cart_items',
                class: 'shop/CartItem',
                column: 'product_id'
            }
        };
        this.columns = {
            id: {
                label: 'id'
            },
            user_id: {
                label: 'user_id',
                references: {
                    name: 'user_products',
                    table: 'node.users',
                    class: 'shop/User'
                }
            },
            title: {
                label: 'title'
            },
            imageUrl: {
                label: 'imageUrl'
            },
            description: {
                label: 'description'
            },
            price: {
                label: 'price'
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