"use strict";

import { CustomTypes } from "../../../core/custom_types";
import SqlModel from "../../../core/model/SqlModel";

/**
 * @class SecurityQuestion
 * @constructor
 * @extends SqlModel
 * @description Defining Model SecurityQuestion
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class SecurityQuestion extends SqlModel {
	constructor() {
		super();
		this.initializeModel();
	}

	protected override canCreate: CustomTypes["SqlModelTypes"]["canCreate"] = false;
	protected override canUpdate: CustomTypes["SqlModelTypes"]["canUpdate"] = false;
	protected override canDelete: CustomTypes["SqlModelTypes"]["canDelete"] = true;
	protected override primaryKey: CustomTypes["SqlModelTypes"]["primaryKey"] = "id";
	protected override table: CustomTypes["SqlModelTypes"]["table"] = "sql_database.tbl_security_questions";
	protected override genericReferences: CustomTypes["SqlModelTypes"]["genericReferences"] = {};
	public override modelColumns = {
		id: {
			label: "Id",
			required: true
		},
		question: {
			label: "Question",
			required: true
		},
		created_at: {
			label: "Created at",
			required: true,
			type: "DATETIME"
		},
		updated_at: {
			label: "Updated at",
			required: true,
			type: "DATETIME"
		}
	};
	protected override reverseReferences: CustomTypes["SqlModelTypes"]["reverseReferences"] = {};
	protected override columns: () => CustomTypes["SqlModelTypes"]["columns"] = () => this.modelColumns as any;
};
