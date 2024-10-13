"use strict";
// "use strict";
// import { CustomTypes } from "../../../core/custom_types";
// import SqlModel from "../../../core/model/SqlModel";
// import User from "../shop/User";
// /**
//  * @class Chat
//  * @constructor
//  * @extends SqlModel
//  * @description Defining Model Chat
//  * @version 1.0.0
//  * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
//  */
// export = class Chat extends SqlModel {
// 	constructor() {
// 		super();
// 		this.initializeModel();
// 	}
// 	protected override canCreate: () => CustomTypes["SqlModelTypes"]["canCreate"] = () => true;
// 	protected override canUpdate: () => CustomTypes["SqlModelTypes"]["canUpdate"] = () => true;
// 	protected override canDelete: () => CustomTypes["SqlModelTypes"]["canDelete"] = () => true;
// 	protected override primaryKey: () => CustomTypes["SqlModelTypes"]["primaryKey"] = () => "id";
// 	protected override table: () => CustomTypes["SqlModelTypes"]["table"] = () => "mysql.tbl_chat";
// 	protected override genericReferences: () => CustomTypes["SqlModelTypes"]["genericReferences"] = () => ({});
// 	protected override columns: () => CustomTypes["SqlModelTypes"]["columns"] = () => ({
// 		id: {
// 			label: "ID"
// 		},
// 		user_id: {
// 			label: "User id",
// 			references: {
// 				name: "user_chat",
// 				table: "mysql.tbl_users",
// 				class: User,
// 				column: "id"
// 			},
// 			required: true
// 		},
// 		receiver_id: {
// 			label: "Receiver id",
// 			references: {
// 				name: "receiver_chat",
// 				table: "mysql.tbl_users",
// 				class: User,
// 				column: "id"
// 			},
// 			required: true
// 		},
// 		message: {
// 			label: "Message",
// 			required: true
// 		},
// 		created_at: {
// 			label: "Created at",
// 			type: "datetime"
// 		}
// 	});
// 	protected override reverseReferences: () => CustomTypes["SqlModelTypes"]["reverseReferences"] = () => ({});
// };
