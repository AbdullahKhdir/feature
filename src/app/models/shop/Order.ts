"use strict";

import { CustomTypes } from "../../../core/custom_types";
import SqlModel from "../../../core/model/SqlModel";
import OrderItem from "./OrderItem";
import User from "./User";

/**
 * @class Order
 * @constructor
 * @extends SqlModel
 * @description Defining Model Order
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class Order extends SqlModel {
	constructor() {
		super();
		this.initializeModel();
	}

	protected override canCreate: CustomTypes["SqlModelTypes"]["canCreate"] = true;
	protected override canUpdate: CustomTypes["SqlModelTypes"]["canUpdate"] = true;
	protected override canDelete: CustomTypes["SqlModelTypes"]["canDelete"] = true;
	protected override primaryKey: CustomTypes["SqlModelTypes"]["primaryKey"] = "id";
	protected override table: CustomTypes["SqlModelTypes"]["table"] = "sql_database.tbl_orders";
	protected override genericReferences: CustomTypes["SqlModelTypes"]["genericReferences"] = {};
	protected override reverseReferences: CustomTypes["SqlModelTypes"]["reverseReferences"] = {
		get_products: {
			name: "order_products",
			table: "sql_database.tbl_order_items",
			class: OrderItem,
			column: "product_id",
			settings: {
				whereColumn: "user_id",
				whereTable: "sql_database.tbl_products"
			}
		}
	};
	public override modelColumns = {
		id: {
			label: "id"
		},
		user_id: {
			label: "user_id",
			references: {
				name: "user_order",
				table: "sql_database.tbl_users",
				class: User,
				column: "id"
			},
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
