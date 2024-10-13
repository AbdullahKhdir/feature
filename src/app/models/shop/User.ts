"use strict";

import { CustomTypes } from "../../../core/custom_types";
import SqlModel from "../../../core/model/SqlModel";
import Cart from "./Cart";
import Product from "./Product";

/**
 * @class User
 * @constructor
 * @extends SqlModel
 * @description Defining Model User
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class User extends SqlModel {
	constructor() {
		super();
		this.initializeModel();
	}

	protected canCreate: CustomTypes["SqlModelTypes"]["canCreate"] = true;
	protected canUpdate: CustomTypes["SqlModelTypes"]["canUpdate"] = true;
	protected canDelete: CustomTypes["SqlModelTypes"]["canDelete"] = false;
	protected primaryKey: CustomTypes["SqlModelTypes"]["primaryKey"] = "id";
	protected table: CustomTypes["SqlModelTypes"]["table"] = "sql_database.tbl_users";
	protected genericReferences: CustomTypes["SqlModelTypes"]["genericReferences"] = {};
	protected reverseReferences: CustomTypes["SqlModelTypes"]["reverseReferences"] = {
		product_user_id: {
			name: "user_products",
			table: "sql_database.tbl_products",
			class: Product,
			column: "user_id"
		},
		cart_user_id: {
			name: "user_cart",
			table: "sql_database.tbl_carts",
			class: Cart,
			column: "user_id"
		}
	};
	public override modelColumns = {
		id: {
			label: "id",
			type: "AUTO_INCREMENT"
		},
		first_name: {
			label: "First Name",
			required: true,
			type: "VARCHAR"
		},
		last_name: {
			label: "Last Name",
			required: true,
			type: "VARCHAR"
		},
		email: {
			label: "email",
			required: true,
			type: "VARCHAR"
		},
		password: {
			label: "password",
			required: true,
			type: "VARCHAR"
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
