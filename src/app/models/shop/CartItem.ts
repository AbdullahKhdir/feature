"use strict";

import { CustomTypes } from "../../../core/custom_types";
import SqlModel from "../../../core/model/SqlModel";
import Cart from "./Cart";
import Product from "./Product";

/**
 * @class CartItem
 * @constructor
 * @extends SqlModel
 * @description Defining Model CartItem
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class CartItem extends SqlModel {
	constructor() {
		super();
		this.initializeModel();
	}

	protected override canCreate: CustomTypes["SqlModelTypes"]["canCreate"] = true;
	protected override canUpdate: CustomTypes["SqlModelTypes"]["canUpdate"] = true;
	protected override canDelete: CustomTypes["SqlModelTypes"]["canDelete"] = true;
	protected override primaryKey: CustomTypes["SqlModelTypes"]["primaryKey"] = "id";
	protected override table: CustomTypes["SqlModelTypes"]["table"] = "sql_database.tbl_cart_items";
	protected override genericReferences: CustomTypes["SqlModelTypes"]["genericReferences"] = {};
	protected override reverseReferences: CustomTypes["SqlModelTypes"]["reverseReferences"] = {
		get_products: {
			name: "cart_products",
			table: "sql_database.tbl_cart_items",
			class: CartItem,
			column: "product_id",
			settings: {
				whereColumn: "user_id", //? value of user_id does not exists in tbl_cart_items
				whereTable: "sql_database.tbl_products"
			}
		}
	};
	public override modelColumns = {
		id: {
			label: "Id"
		},
		quantity: {
			label: "Quantity",
			required: true
		},
		cart_id: {
			label: "Cart Id",
			references: {
				name: "items_cart",
				table: "sql_database.tbl_carts",
				class: Cart,
				column: "id"
			},
			required: true
		},
		product_id: {
			label: "Product Id",
			references: {
				name: "items_cart_products",
				table: "sql_database.tbl_products",
				class: Product,
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
	public override columns: () => CustomTypes["SqlModelTypes"]["columns"] = () => this.modelColumns as any;
};
