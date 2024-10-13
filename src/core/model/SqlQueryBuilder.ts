"use strict";

import Db from "../database/Database";
import { Singleton } from "../Singleton/Singleton";

/**
 * @class SqlQueryBuilder
 * @constructor Model and Built Query
 * @description To build a complex queries using predefined methods
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @example
   this.product is the model name
   this.product.selectModel(Product)
    .where()
    .custom(
        'id in (select mysql.products.id from mysql.products where price != 0)'
    )
    ._and_()
    .contains('description', '1')
    ._and_()
    .nesting()
    .isNotNull('price')
    ._or_()
    .notContains('title', 'cart')
    .closeNesting()
    .done()
    .then(([rows, fields]) => {
        console.log(rows);
    })
    .catch(err => {throw err});
*/
export = class SqlQueryBuilder {
	protected mysql;
	protected db: Db;
	protected query: any;
	protected model: any;
	protected table: any;

	/**
	 * @description Specification of the columns
	 *
	 * Construction:
	 *     column_name: {
	 *         label:    "human-readable name",
	 *         references: {  //Foreign key, data is loaded automatically
	 *             name:   "Name for field in returned array",
	 *             class:  "Class of the modul pointed by the foreign key",
	 *             table:  "Table name of the table to which the foreign key points",
	 *             column: "Column to which the FK points (default: primary key)"
	 *         },
	 *         required: not empty (will be validated), // true or false
	 *     }
	 *
	 * @var {Object} __columns
	 */
	protected columns: any;
	protected path: any;
	protected file_system: any;
	protected _: typeof import("lodash");

	constructor(model_name = null, query = null, table = null, columns = []) {
		this.mysql = Singleton.getDbSession();
		this.db = Singleton.getDb();
		this.model = model_name;
		this.query = query;
		this.table = table;
		this.columns = columns;
		this.path = Singleton.getPath();
		this.file_system = Singleton.getFileSystem();
		this._ = Singleton.getLodash();
	}

	/**
	 * @method getDb
	 * @description Returns an instance of the database initiated object
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Db Object
	 */
	getDb() {
		return this.mysql;
	}

	/**
	 * @method getModel
	 * @description Returns an instance of the initiated model
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Model Object
	 */
	getModel() {
		return this.model;
	}

	/**
	 * @method escapeValue
	 * @description Escapes user input
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string value
	 * @param number value
	 * @returns User escaped values
	 */
	escapeValue(value: any) {
		return this.getDb().escape(value);
	}

	/**
	 * @method selectModel
	 * @description Selects all from the model's table and returns a string with sql query
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Class} modul_name
	 * @returns SqlQueryBuilder
	 */
	selectModel(modul_name: any): boolean | SqlQueryBuilder {
		if (!this._.isNull(modul_name)) {
			if (this._.isFunction(modul_name)) {
				let modules_directory = this.path.join(__dirname, "..", "..", "app", "models");
				const level_one = this.file_system.readdirSync(modules_directory, { withFileTypes: true });
				if (this._.isEmpty(level_one)) {
					throw new Error("Unable to scan models directory");
				} else {
					level_one.forEach((file: any) => {
						let is_dir = file.isDirectory();
						let is_file = file.isFile();
						// @ts-ignore: Object is possibly 'null'.
						const model = modul_name.toString().match(/ (\w+)/)[1];

						if (is_file) {
							const searched_model = this._.replace(file.name.toString(), ".js", "");
							if (searched_model === model) {
								let file_name = model;
								let required_model = require("../../app/models/" + "/" + file_name + ".js");
								this.model = new required_model();
								this.table = this.model.table;
								this.columns = this.model.columns;
								this.query = `SELECT * FROM ${this.model.table} `;
							}
						} else if (is_dir) {
							let directory_name = file.name;
							const level_two: any = this.file_system.readdirSync(modules_directory + "/" + file.name, {
								withFileTypes: true
							});
							if (this._.isEmpty(level_two)) {
								throw new Error("Unable to scan models directory");
							}
							level_two.forEach((file: any) => {
								let is_file = file.isFile();
								if (is_file) {
									const searched_model = this._.replace(file.name.toString(), ".js", "");
									if (searched_model === model) {
										let file_name = model;
										let required_model = require("../../app/models/" +
											directory_name +
											"/" +
											file_name +
											".js");
										this.model = new required_model();
										this.table = this.model.table;
										this.columns = this.model.columns;
										this.query = `SELECT * FROM ${this.model.table} `;
									}
								}
							});
						}
					});
				}
			} else if (this._.isString(modul_name)) {
				let modules_directory = this.path.join(__dirname, "..", "..", "app", "models");
				const level_one = this.file_system.readdirSync(modules_directory, { withFileTypes: true });
				if (this._.isEmpty(level_one)) {
					throw new Error("Unable to scan models directory");
				} else {
					level_one.forEach((file: any) => {
						let is_dir = file.isDirectory();
						let is_file = file.isFile();
						const model = modul_name;

						if (is_file) {
							const searched_model = this._.replace(file.name.toString(), ".js", "");
							if (searched_model === model) {
								let file_name = model;
								let required_model = require("../../app/models/" + "/" + file_name + ".js");
								this.model = new required_model();
								this.table = this.model.table;
								this.columns = this.model.columns;
								this.query = `SELECT * FROM ${this.model.table} `;
							}
						} else if (is_dir) {
							let directory_name = file.name;
							const level_two = this.file_system.readdirSync(modules_directory + "/" + file.name, {
								withFileTypes: true
							});
							if (this._.isEmpty(level_two)) {
								throw new Error("Unable to scan models directory");
							}
							level_two.forEach((file: any) => {
								let is_file = file.isFile();
								if (is_file) {
									const searched_model = this._.replace(file.name.toString(), ".js", "");
									if (searched_model === model) {
										let file_name = model;
										let required_model = require("../../app/models/" +
											directory_name +
											"/" +
											file_name +
											".js");
										this.model = new required_model();
										this.table = this.model.table;
										this.columns = this.model.columns;
										this.query = `SELECT * FROM ${this.model.table} `;
									}
								}
							});
						}
					});
				}
			}
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, this.table, this.columns) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method done
	 * @description Ends a query with a comma
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Promise
	 */
	done() {
		if (!this._.isEmpty(this.query)) {
			this.query = this.query + ";";
		}
		return !!this.query ? this._executeQuery(this.query) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method _and_
	 * @description Adds an and operator
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns SqlQueryBuilder
	 */
	_and_() {
		if (!this._.isEmpty(this.query)) {
			this.query = this.query + " AND ";
		}
		return !!this.query ? new SqlQueryBuilder(this.model, this.query, this.table, this.columns) : !!this.query;
	}

	/**
	 * @method _or_
	 * @description Adds an or operator
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns SqlQueryBuilder
	 */
	_or_() {
		if (!this._.isEmpty(this.query)) {
			this.query = this.query + " OR ";
		}
		return !!this.query ? new SqlQueryBuilder(this.model, this.query, this.table, this.columns) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method is
	 * @description Adds a condition to where clause
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	is(col: any, value: any) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		const _value = this.escapeValue(value);

		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} = ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} = ${_value} `;
		}

		return !!this.query ? new SqlQueryBuilder(model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method isNot
	 * @description Adds a condition to where clause
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	isNot(col: any, value: any) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		const _value = this.escapeValue(value);
		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} != ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} != ${_value} `;
		}

		return !!this.query ? new SqlQueryBuilder(model, this.query, table, columns) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method contains
	 * @description Adds a condition to where clause
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	contains(col: any, value: string) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		value = "%".concat(value);
		const _value = this.escapeValue(value);
		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} LIKE ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} LIKE ${_value} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method notContains
	 * @description Adds a condition to where clause
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	notContains(col: any, value: string) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		value = "%".concat(value);
		const _value = this.escapeValue(value);
		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} NOT LIKE ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT LIKE ${_value} `;
		}
		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method startsWith
	 * @description Checks if column starts with givin value
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	startsWith(col: any, value: string) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		value = "%".concat(value);
		const _value = this.escapeValue(value);
		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} LIKE ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} LIKE ${_value} `;
		}
		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method notStartsWith
	 * @description Checks if column does not start with givin value
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	notStartsWith(col: any, value: string) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		value = "%".concat(value);
		const _value = this.escapeValue(value);
		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} NOT LIKE ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT LIKE ${_value} `;
		}
		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method endsWith
	 * @description Checks if column ends with givin value
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	endsWith(col: any, value: string) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		value = value.concat("%");
		const _value = this.escapeValue(value);

		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} LIKE ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} LIKE ${_value} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method notEndsWith
	 * @description Checks if column does not end with givin value
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	notEndsWith(col: any, value: string) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		value = value.concat("%");
		const _value = this.escapeValue(value);

		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} NOT LIKE ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT LIKE ${_value} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method custom
	 * @description Executes a sql query
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string SQL
	 * @returns SqlQueryBuilder
	 */
	custom(sub_query: string) {
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(sub_query)) {
			if (this._.isEmpty(sub_query)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			model = this.model;
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			model = this.model;
		}

		let custom_query: any = this.escapeValue(sub_query);
		custom_query = custom_query.replaceAll("'", "").replaceAll('"', "");

		if (!this._.isEmpty(custom_query)) {
			this.query = `${this.query} ${custom_query} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ( ${custom_query} )`;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method reset
	 * @description Emptys the sql query
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Boolean
	 */
	reset() {
		let table = null;
		let columns = null;
		let model = null;

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			model = this.model;
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			model = this.model;
		}

		this.query = "";
		return !this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method isNull
	 * @description Checks if column is null
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @returns SqlQueryBuilder
	 */
	isNull(col: any) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} IS NULL `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} IS NULL `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method isNotNull
	 * @description Checks if column is not null
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @returns SqlQueryBuilder
	 */
	isNotNull(col: any) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this.table;
			columns = this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} IS NOT NULL `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} IS NOT NULL `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method matchesPattern
	 * @description Checks if column matches givin regex
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string regex
	 * @returns SqlQueryBuilder
	 */
	matchesPattern(col: any, regex: any) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(regex)) {
			if (this._.isEmpty(regex)) {
				return false;
			}
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} REGEXP ${regex} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} REGEXP ${regex} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method notMatchesPattern
	 * @description Checks if column does not matche givin regex
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string regex
	 * @returns SqlQueryBuilder
	 */
	notMatchesPattern(col: any, regex: any) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(regex)) {
			if (this._.isEmpty(regex)) {
				return false;
			}
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} NOT REGEXP ${regex} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT REGEXP ${regex} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method matchesSearchTerm
	 * @description Checks if the search term matches
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	matchesSearchTerm(col: any, value: string) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		value = "%".concat(value.concat("%"));
		const _value = this.escapeValue(value);
		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} LIKE ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} LIKE ${_value} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method notMatchesSearchTerm
	 * @description Checks if the search term does not matche
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	notMatchesSearchTerm(col: any, value: string) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		value = "%".concat(value.concat("%"));
		const _value = this.escapeValue(value);
		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} NOT LIKE ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT LIKE ${_value} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method from
	 * @description Adds range to column >= Value
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	from(col: any, value: string) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		const _value = this.escapeValue(value);
		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} >= ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} >= ${_value} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method to
	 * @description Adds range to column <= Value
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	to(col: any, value: string) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		const _value = this.escapeValue(value);
		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} <= ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} <= ${_value} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method isLessThan
	 * @description Adds less operator to column < Value
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	isLessThan(col: any, value: string) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		const _value = this.escapeValue(value);
		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} < ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} < ${_value} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method isGreaterThan
	 * @description Adds greater operator to column > Value
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	isGreaterThan(col: any, value: string) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		const _value = this.escapeValue(value);
		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} > ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} > ${_value} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method isLessThanEqual
	 * @description Adds less or equals operators to column <= Value
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	isLessThanEqual(col: any, value: string) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		const _value = this.escapeValue(value);
		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} <= ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} <= ${_value} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method isGreaterThan
	 * @description Adds greater or equal operators to column >= Value
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string value
	 * @param number value
	 * @returns SqlQueryBuilder
	 */
	isGreaterThanEqual(col: any, value: string) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(value)) {
			if (this._.isEmpty(value)) {
				return false;
			}
		} else if (!this._.isNumber(value)) {
			return false;
		}

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		const _value = this.escapeValue(value);
		if (!this._.isEmpty(this.query) && object.includes(col.toString())) {
			this.query = `${this.query} ${col.toString()} >= ${_value} `;
		} else {
			this.query = `SELECT * FROM ${table} WHERE ${col.toString()} >= ${_value} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method where
	 * @description Adds Where clause
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns SqlQueryBuilder
	 */
	where() {
		let table = null;
		let columns = null;
		let model = null;

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			model = this.model;
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			model = this.model;
		}

		if (!this._.isEmpty(this.query)) {
			this.query = `${this.query} WHERE `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method groupBy
	 * @description Adds GroupBy
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @returns SqlQueryBuilder
	 */
	groupBy(col: any) {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		if (!this._.isEmpty(this.query)) {
			this.query = `${this.query} GROUP BY ${col.toString()} `;
		} else {
			this.query = `SELECT * FROM ${table} GROUP BY ${col.toString()} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method having
	 * @description Adds Having clause
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string condition
	 * @returns SqlQueryBuilder
	 */
	having(condition: string) {
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(condition)) {
			if (this._.isEmpty(condition)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			model = this.model;
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			model = this.model;
		}

		if (!this._.isEmpty(this.query) && !this._.isEmpty(condition)) {
			if (this.query.search("GROUP BY") === -1 && this.query.search("group by") === -1) {
				throw new Error('Using "Having" key word requires using "Group By" key word');
			}
			let _condition: any = this.escapeValue(condition);
			_condition = _condition.replaceAll("'", "").replaceAll('"', "");
			this.query = `${this.query} Having ${_condition} `;
			return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
		}
		return false;
	}

	/**
	 * @method orderBy
	 * @description Adds GroupBy
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string column
	 * @param string sort
	 * @returns SqlQueryBuilder
	 */
	orderBy(col: any, sort = "ASC") {
		let object = null;
		let table = null;
		let columns = null;
		let model = null;

		if (this._.isString(col)) {
			if (this._.isEmpty(col)) {
				return false;
			}
		}

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			object = Object.values(Object.keys(columns));
			model = this.model;
			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}

			if (!object.includes(col.toString())) {
				throw new Error("The giving column " + col.toString() + " does not exist in the table " + table);
			}
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			object = Object.values(Object.keys(columns));
			model = this.model;

			if (this._.isEmpty(Object.keys(columns))) {
				return false;
			}
			if (!object.includes(col.toString())) {
				throw new Error("Giving columns " + col.toString() + " does not exist in the table " + table);
			}
		}

		if (!this._.isEmpty(this.query)) {
			this.query = `${this.query} ORDER BY ${col.toString()} ${sort} `;
		} else {
			this.query = `SELECT * FROM ${table} ORDER BY ${col.toString()} ${sort} `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method nesting
	 * @description Opens up a new bracket to nest conditions or sub query
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns SqlQueryBuilder
	 */
	nesting() {
		let table = null;
		let columns = null;
		let model = null;

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			model = this.model;
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			model = this.model;
		}

		if (!this._.isEmpty(this.query)) {
			this.query = `${this.query} ( `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	/**
	 * @method closeNesting
	 * @description Closes an opend bracket of a nested conditions or sub query
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns SqlQueryBuilder
	 */
	closeNesting() {
		let table = null;
		let columns = null;
		let model = null;

		if (this.model) {
			table = this.model.table || this.table;
			columns = this.model.columns || this.columns;
			model = this.model;
		} else {
			table = this._.isEmpty(this.table) ? this.table : "";
			columns = this._.isEmpty(this.columns) ? this.columns : "";
			model = this.model;
		}

		if (!this._.isEmpty(this.query)) {
			this.query = `${this.query} ) `;
		}

		return !!this.query ? new SqlQueryBuilder(this.model, this.query, table, columns) : !!this.query;
	}

	//###########################\\
	//###########################\\

	/**
	 * @method executeQuery
	 * @description Async query executer method
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param string built_query
	 * @returns Promise
	 */
	protected _executeQuery(built_query = this.query) {
		if (!this._.isNull(built_query) && !this._.isEmpty(built_query) && this._.isString(built_query)) {
			return (async () => {
				return await this.db
					.query(built_query)
					.then((result) => {
						if (result) {
							return result;
						}
					})
					.catch((err) => Promise.reject(SQLException(err)));
			})();
		}
	}
};
