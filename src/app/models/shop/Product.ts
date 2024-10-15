"use strict";

import SqlModel from "../../../core/model/SqlModel";
import CartItem from "./CartItem";
import User from "./User";
import { CustomTypes } from "../../../core/custom_types";

/**
 * @class Product
 * @constructor
 * @extends SqlModel
 * @description Defining Model Product
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class Product extends SqlModel {
	constructor() {
		super();
		this.initializeModel();
	}

	protected override canCreate: CustomTypes["SqlModelTypes"]["canCreate"] = true;
	protected override canUpdate: CustomTypes["SqlModelTypes"]["canUpdate"] = true;
	protected override canDelete: CustomTypes["SqlModelTypes"]["canDelete"] = true;
	protected override primaryKey: CustomTypes["SqlModelTypes"]["primaryKey"] = "id";
	protected override table: CustomTypes["SqlModelTypes"]["table"] = "sql_database.tbl_products";
	protected override genericReferences: CustomTypes["SqlModelTypes"]["genericReferences"] = {};
	protected override reverseReferences: CustomTypes["SqlModelTypes"]["reverseReferences"] = {
		get_products: {
			name: "product_cart_items",
			table: "sql_database.tbl_cart_items",
			class: CartItem,
			column: "product_id"
		}
	};
	public override modelColumns = {
		id: {
			label: "id",
			// todo add to all models
			isPrimaryKey: true
		},
		user_id: {
			label: "user_id",
			references: {
				name: "user_products",
				table: "sql_database.tbl_users",
				class: User,
				column: "id"
			},
			// todo add to all models and check in sqlModel
			isForeignKey: true,
			required: true
		},
		title: {
			label: "title",
			required: true
		},
		imageUrl: {
			label: "imageUrl",
			required: false
		},
		description: {
			label: "description",
			required: true
		},
		price: {
			label: "price",
			required: true
		},
		created_at: {
			label: "created_at",
			type: "DATETIME"
		},
		updated_at: {
			label: "updated_at",
			type: "DATETIME"
		}
	};
	protected override columns: () => CustomTypes["SqlModelTypes"]["columns"] = () => this.modelColumns as any;
};
