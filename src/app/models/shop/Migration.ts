"use strict";

import SqlModel from "../../../core/model/SqlModel";
import RuntimeException from "../../../core/exception/types/RuntimeException";
import { getClass } from "../../../core/utils/helperFunctions";
import { CustomTypes } from "../../../core/custom_types";

/**
 * @class Migration
 * @constructor
 * @extends SqlModel
 * @description Defining Model Migration
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class Migration extends SqlModel {
	constructor() {
		super();
		this.initializeModel();
	}

	protected override canCreate: CustomTypes["SqlModelTypes"]["canCreate"] = true;
	protected override canUpdate: CustomTypes["SqlModelTypes"]["canUpdate"] = false;
	protected override canDelete: CustomTypes["SqlModelTypes"]["canDelete"] = false;
	protected override primaryKey: CustomTypes["SqlModelTypes"]["primaryKey"] = "id";
	protected override table: CustomTypes["SqlModelTypes"]["table"] = "sql_database.tbl_db_migrations";
	protected override genericReferences: CustomTypes["SqlModelTypes"]["genericReferences"] = {};
	protected override reverseReferences: CustomTypes["SqlModelTypes"]["reverseReferences"] = {};
	public override modelColumns = {
		id: {
			label: "Id"
		},
		migrations_file_name: {
			label: "Migrations File Name",
			required: true
		},
		migrations_sql: {
			label: "Migrations Sql",
			required: true
		},
		created_at: {
			label: "Created at",
			type: "DATETIME"
		}
	};
	protected override columns: () => CustomTypes["SqlModelTypes"]["columns"] = () => this.modelColumns as any;
};
