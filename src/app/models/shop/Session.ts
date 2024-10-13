"use strict";

import SqlModel from "../../../core/model/SqlModel";
import { CustomTypes } from "../../../core/custom_types";

/**
 * @class Session
 * @constructor
 * @extends SqlModel
 * @description Defining Model Session
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class Session extends SqlModel {
	constructor() {
		super();
		this.initializeModel();
	}

	protected override canCreate: CustomTypes["SqlModelTypes"]["canCreate"] = false;
	protected override canUpdate: CustomTypes["SqlModelTypes"]["canUpdate"] = false;
	protected override canDelete: CustomTypes["SqlModelTypes"]["canDelete"] = false;
	protected override primaryKey: CustomTypes["SqlModelTypes"]["primaryKey"] = "session_id";
	protected override table: CustomTypes["SqlModelTypes"]["table"] = "sql_database.sessions";
	protected override genericReferences: CustomTypes["SqlModelTypes"]["genericReferences"] = {};
	protected override reverseReferences: CustomTypes["SqlModelTypes"]["reverseReferences"] = {};
	public override modelColumns = {
		session_id: {
			label: "Session id"
		},
		expires: {
			label: "Expires",
			required: true
		},
		data: {
			label: "Data",
			required: true
		}
	};
	protected override columns: () => CustomTypes["SqlModelTypes"]["columns"] = () => this.modelColumns as any;
};
