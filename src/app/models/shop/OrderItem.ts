"use strict";

import { CustomTypes } from "../../../core/custom_types";
import SqlModel from "../../../core/model/SqlModel";
import Order from "./Order";
import Product from "./Product";

/**
 * @class OrderItem
 * @constructor
 * @extends SqlModel
 * @description Defining Model OrderItem
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class OrderItem extends SqlModel {
	constructor() {
		super();
		this.initializeModel();
	}

	protected override canCreate: CustomTypes["SqlModelTypes"]["canCreate"] = true;
	protected override canUpdate: CustomTypes["SqlModelTypes"]["canUpdate"] = true;
	protected override canDelete: CustomTypes["SqlModelTypes"]["canDelete"] = true;
	protected override primaryKey: CustomTypes["SqlModelTypes"]["primaryKey"] = "id";
	protected override table: CustomTypes["SqlModelTypes"]["table"] = "sql_database.tbl_order_items";
	protected override genericReferences: CustomTypes["SqlModelTypes"]["genericReferences"] = {};
	protected override reverseReferences: CustomTypes["SqlModelTypes"]["reverseReferences"] = {};
	public override modelColumns = {
		id: {
			label: "Id"
		},
		quantity: {
			label: "Quantity",
			required: true
		},
		order_id: {
			label: "Order Id",
			references: {
				name: "order_items",
				table: "sql_database.tbl_orders",
				class: Order,
				column: "id"
			},
			required: true
		},
		product_id: {
			label: "Product Id",
			references: {
				name: "order_products_items",
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
	protected override columns: () => CustomTypes["SqlModelTypes"]["columns"] = () => this.modelColumns as any;
};
