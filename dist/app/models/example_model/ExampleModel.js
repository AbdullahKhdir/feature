"use strict";
// "use strict";
// import { CustomTypes } from "../../../core/custom_types";
// import SqlModel from "../../../core/model/SqlModel";
// import CartItem from "../shop/CartItem";
// import User from "../shop/User";
// export = class ExampleModel extends SqlModel {
// 	constructor() {
// 		super();
// 		this.initializeModel();
// 	}
// 	/*
// 	 * The can create of the model
// 	 */
// 	protected override canCreate!: () => true;
// 	/*
// 	 * The can update of the model
// 	 */
// 	protected override canUpdate!: () => true;
// 	/*
// 	 * The can delete of the model
// 	 */
// 	protected override canDelete!: () => true;
// 	/*
// 	 * The primary key of the model
// 	 */
// 	protected override primaryKey!: () => "id";
// 	/*
// 	 * The table of the model
// 	 */
// 	protected override table!: () => "database.table";
// 	/*
// 	 * The columns of the model
// 	 */
// 	protected override columns!: () => {};
// 	/*
//      * The reverse references of the model
//      * reverseReferences are used to fetch th data from the
//      * constraint's relation between two tables.
//      *
//      * Options:
//      * 1- table: set the target table as string. (the second target table)
//      * 2- class: set the imported model class as imported class file
//      * 3- column: set the constraint's field as string (foreign key)
//      * 4- settings as object:
//      *  4.1- whereColumn: to retrieve the data after a specific field for example user id (from a the third table "optional")
//      *  4.2- whereTable: the third table to make the comparison with it's column e.g. user => id
//     */
// 	protected override reverseReferences!: () => {
// 		getProducts: {
// 			name: "products_cart_items";
// 			table: "mysql.tbl_cart_items";
// 			class: CartItem;
// 			column: "product_id";
// 			settings: {
// 				whereColumn: "user_id";
// 				whereTable: "mysql.tbl_products";
// 			};
// 		};
// 	};
// 	/*
// 	 * The generic references of the model
// 	 */
// 	protected override genericReferences!: () => {
// 		first_column: {
// 			/*
// 			 * The label of this column (effects rendering)
// 			 */
// 			label: "first_column";
// 			/*
// 			 * If this columns references between two tables.
// 			 *
// 			 * Options:
// 			 * name:  When fetching from the methods of the SqlModel,
// 			 *        you will see "user_cart" function as promise ready to be used as pre fetched data between the two tables.
// 			 *        IMPORTANT: the name must be giving, think of it like a variable initialization or definition,
// 			 *        that has pre fetched data, which are under your disposal by any SqlModel function's call.
// 			 * table: Constraint's relation between this model's table and mysql.tbl_users table
// 			 * class: The Class name of the target table
// 			 */
// 			references: {
// 				name: "user_cart";
// 				table: "mysql.tbl_users";
// 				class: User;
// 				column: "id"; //Default primary key
// 			};
// 		};
// 		second_column: {
// 			label: "second_column";
// 		};
// 		third_column: {
// 			label: "third_column";
// 		};
// 		fourth_column: {
// 			label: "fourth_column";
// 		};
// 		etc: {
// 			label: "etc";
// 		};
// 	};
// };
