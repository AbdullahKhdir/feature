"use strict";

import Db from "../database/Database";
import LogicException from "../exception/types/LogicException";
import SQLException from "../exception/types/SQLException";
import { Singleton } from "../Singleton/Singleton";
import { getClass, isConstructor, isInstance } from "../utils/helperFunctions";
import { CustomTypes } from "../custom_types";
import mysql, { RowDataPacket, PoolConnection, OkPacket, ResultSetHeader, FieldPacket } from "mysql2/promise";
import Redis from "../redis/Redis";
import * as config from "../config";

/**
 * @class SqlModel
 * @constructor
 * @description Class SqlModel is used to prepare suitable environment to build queries for the models
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
abstract class SqlModel {
	/**
	 * @description MYSQL NUMBER FLAG FOR PRIMARY KEY
	 * @var {number} MYSQL_PRIMARY_KEY_FLAG
	 */
	private MYSQL_PRIMARY_KEY_FLAG = 16939;

	/**
	 * @description Determines whether INSERT can be executed
	 * @var {boolean} canCreate
	 */
	protected abstract canCreate: CustomTypes["SqlModelTypes"]["canCreate"];

	/**
	 * determines whether UPDATE can be executed
	 * @var {boolean} canUpdate
	 */
	protected abstract canUpdate: CustomTypes["SqlModelTypes"]["canUpdate"];

	/**
	 * determines whether DELETE can be executed
	 * @var {boolean} canDelete
	 */
	protected abstract canDelete: CustomTypes["SqlModelTypes"]["canDelete"];

	/**
	 * @description Primary key of the table
	 * @var {string} primaryKey
	 */
	protected abstract primaryKey: CustomTypes["SqlModelTypes"]["primaryKey"];

	/**
	 * @description table property
	 * @var {string} table
	 */
	protected abstract table: CustomTypes["SqlModelTypes"]["table"];

	/**
	 * @description table property
	 * @var {object} modelColumns
	 */
	public abstract modelColumns: any;
	protected abstract columns(): CustomTypes["SqlModelTypes"]["columns"];

	/**
    * @description make reverse references available in the result
    +
    * Configuration format:
    *
    * this.reverseReferences: {
    *     '[Index im Result]' : {
    *         'table': "Table name",
    *         'class': "Model name",
    *         #should be foreign_key#
    *         'column': "Foreign key column in the other model",
    *         settings: {
    *             #should be foreign_key#
    *             whereColumn: "Foreign key comparison with other columns of other models",
    *             whereTable:  "Table name"
    *         }
    *     }
    * }
    *
    * @var {object} reverseReferences
    */
	protected abstract reverseReferences: CustomTypes["SqlModelTypes"]["reverseReferences"];

	/**
	 * @description Illustration of generic references (table and PK in 2 columns)
	 *
	 * Format:
	 *  this.generic_references: {
	 *      [Index im Result]' : {
	 *          'pk_column': "Name of the column in which the PK of the object is stored"
	 *          'table_column': "Name of the column in which the table of the object is stored"
	 *      }
	 *  }
	 *
	 * @var {object} genericReferences
	 */
	protected abstract genericReferences: object;

	/**
	 * @description Flag to track if initializeModel() was called
	 * @var {boolean} isInitialized
	 */
	protected isInitialized: boolean = false;
	protected _columnsValidationExcuted: boolean = false;
	protected model: string;
	protected pool: mysql.Pool;
	protected db: Db;
	protected redis: Redis;
	protected mysql: typeof mysql;
	protected constants;
	protected _: typeof import("lodash");
	protected connection!: PoolConnection;

	// todo export NODE_COMPILE_CACHE_PATH=/path/to/your/custom/cache/directory
	// todo node 22.09 module.enableCompileCache();
	// todo const util = require('node:util'); const {functionName, scriptName, lineNumber, column} = util.getCallSite()
	// todo cluster module in node for handling multiple-core systems
	// todo io.js, N-API, llhttp, HTTP/2 and HTTP3 ?

	// todo see what seqeulize have to offer of functionalities and do implement them
	// todo mysql cache - redis caching
	constructor() {
		this.mysql = Singleton.getDbSession();
		this.model = getClass(this);
		this.pool = Singleton.getDb().pool;
		this.db = Singleton.getDb();
		this.redis = Singleton.getRedisInstance();
		this.constants = Singleton.getConstants();
		this._ = Singleton.getLodash();

		setTimeout(() => {
			if (!this.isInitialized) {
				throw new Error(`initializeModel() was not called in the derived class (${this.model}).`);
			}
		}, 0);
	}

	/**
	 * @function initializeModel
	 * @version 1.0.0
	 * @description initializes the model required functionalities and set a flag to true
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns {Promise<never>}
	 */
	public initializeModel(): void {
		this.modelColumns = this.columns();
		this.isInitialized = true;
	}

	/**
	 * @function handleException
	 * @version 1.0.0
	 * @description Handles SQL exceptions by rejecting with an error message.
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {new (message: string) => SQLException | LogicException} type - The type of the error
	 * @param {string} message - The error message.
	 * @param {unknown} error - Optional additional error details.
	
	 * @returns {Promise<never>}
	 */
	async handleException(
		type: new (message: string) => SQLException | LogicException,
		message: string,
		error?: unknown
	): Promise<never> {
		return Promise.reject(new type(`${message} \n ${error || ""}`));
	}

	/**
	 * @function validateTypesAgainstModelColumns
	 * @description Validates the types of an object (values, params, where clause) against the defined modelColumns.
	 * @param {object} data - The object to validate (values, params, or where clause).
	 * @returns {Promise<boolean | SQLException>} - Resolves true if valid, otherwise throws SQLException.
	 */
	protected async validateTypesAgainstModelColumns(
		data: Partial<{ [key: string]: any }>
	): Promise<boolean | SQLException> {
		for (const key in data) {
			if (this.modelColumns.hasOwnProperty(key)) {
				const expectedType = this.modelColumns[key]?.type;
				const actualValue = data[key];

				if (!expectedType) continue;

				const isValid = this.validateType(expectedType, actualValue);
				if (!isValid) {
					return await this.handleException(
						SQLException,
						`Invalid type for column "${key}". Expected type "${expectedType}" but got value "${actualValue}" of type "${typeof actualValue}".`
					);
				}
			} else {
				return await this.handleException(
					SQLException,
					`The column "${key}" does not exist in the modelColumns of the model "${this.model}".`
				);
			}
		}

		return true;
	}

	/**
	 * @function validateType
	 * @description A utility function to validate if a value matches the expected SQL type.
	 * @param {string} expectedType - The expected SQL type (from modelColumns).
	 * @param {any} value - The actual value to check.
	 * @returns {boolean} - Returns true if the value matches the expected type.
	 */
	protected validateType(expectedType: string, value: any): boolean {
		switch (expectedType) {
			case "TINYINT":
			case "SMALLINT":
			case "MEDIUMINT":
			case "INT":
			case "INTEGER":
			case "BIGINT":
				return Number.isInteger(value);
			case "FLOAT":
			case "DOUBLE":
			case "NUMERIC":
			case "DECIMAL":
				return typeof value === "number";
			case "BOOLEAN":
			case "BOOL":
				return typeof value === "boolean";
			case "CHAR":
			case "VARCHAR":
			case "TEXT":
			case "TINYTEXT":
			case "MEDIUMTEXT":
			case "LONGTEXT":
				return typeof value === "string";
			case "DATE":
			case "DATETIME":
			case "TIMESTAMP":
			case "TIME":
			case "YEAR":
				return value instanceof Date || typeof value === "string";
			case "JSON":
				return typeof value === "object";
			default:
				return true;
		}
	}

	/**
	 * @function describeTable
	 * @description Describes a table in the database
	 * @param {string} table - Table name
	 * @returns {Promise<[T, FieldPacket[]]>}
	 */
	async describeTable(
		table: string,
		connection?: PoolConnection
	): Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader> {
		if (!this._columnsValidationExcuted) {
			await this.validateColumns();
		}

		let automaticConnectionRelease = true;
		if (connection) {
			automaticConnectionRelease = false;
		} else {
			connection = await this.pool.getConnection();
		}

		try {
			const [result] = await connection.query(`DESC ${table};`);

			if (automaticConnectionRelease) {
				connection.release();
			}

			return result;
		} catch (error) {
			connection.release();
			throw error;
		}
	}

	/**
	 * @function validateColumns
	 * @description Validates the columns of the model with the corresponding table
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns {Promise<SQLException|boolean>}
	 */
	protected async validateColumns(): Promise<SQLException | void> {
		if (this._columnsValidationExcuted) {
			return;
		}

		this._columnsValidationExcuted = true;

		if (this._.isEmpty(this.modelColumns)) {
			return await this.handleException(
				SQLException,
				`The public modelColumns property the ${this.model} of the table ${this.table} is not implemented!`
			);
		}

		if (this._.isEmpty(this.table)) {
			return await this.handleException(
				SQLException,
				`The table property of the ${this.model} of the table ${this.table} is not implemented!`
			);
		}

		const correspondingTable = await this.describeTable(this.table);
		const describedColumns = (correspondingTable as Array<{ Field: string }>).map((item) => item.Field);

		for (const column of Object.keys(this.modelColumns)) {
			if (describedColumns.includes(column) && !column && !this.primaryKey) {
				return await this.handleException(
					SQLException,
					`The column "${column}" must be assigned in the columns abstract function in "${this.model}" of the table "${this.table}"!`
				);
			}

			if (!describedColumns.includes(column)) {
				return await this.handleException(
					SQLException,
					`The column "${column}" must not be assigned in the columns abstract function in "${this.model}" of the table "${this.table}"!`
				);
			}
		}

		return;
	}

	/**
	 * @function delete
	 * @description Deletes a data record from the specified table.
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {string} table - The name of the table from which the record will be deleted.
	 * @param {string|number|Object} id - The primary key or an object representing the condition to match the record.
	 * A promise that resolves with the query result or rejects with an exception.
	 * @throws {LogicException} If the user is not allowed to delete records.
	 * @throws {SQLException} If the ID is invalid, the table doesn't exist, or the query fails.
	 * @returns {Promise<LogicException | SQLException | [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>}
	 */
	async delete(
		id: CustomTypes["mysqlFunctions"]["delete"]["id"],
		connection?: PoolConnection
	): Promise<CustomTypes["mysqlFunctions"]["fetch"]["returnType"]> {
		if (!this._columnsValidationExcuted) {
			await this.validateColumns();
		}

		let automaticConnectionRelease = true;
		if (connection) {
			automaticConnectionRelease = false;
		} else {
			connection = await this.pool.getConnection();
		}

		if (!this.canDelete) {
			connection.release();
			return await this.handleException(LogicException, "User cannot delete!");
		}

		if (this._.isEmpty(id) && !this._.isNumber(id)) {
			connection.release();
			return await this.handleException(SQLException, "Primary key must not be empty!");
		}

		if (!this._.isString(id) && !this._.isNumber(id) && !this._.isObject(id)) {
			connection.release();
			return await this.handleException(SQLException, "Invalid ID type!");
		}

		if (this._.isEmpty(this.table)) {
			connection.release();
			return await this.handleException(SQLException, "Table name must not be empty!");
		}

		const tableExists = !!(await this.describeTable(this.table, connection));
		if (!tableExists) {
			connection.release();
			return await this.handleException(
				SQLException,
				`The table "${this.table}" does not exist in the database!`
			);
		}

		let query = "";
		let params: any;

		if (this._.isObject(id)) {
			const whereClauses = Object.keys(id)
				.filter((key) => id[key] !== undefined)
				.map((key) => `${key} = ${this.mysql.escape(id[key])}`);

			if (whereClauses.length === 0) {
				connection.release();
				return await this.handleException(SQLException, "Invalid object format for ID");
			}

			query = `DELETE FROM ${this.table} WHERE ?;`;
			params = whereClauses.join(" AND ");
		} else if (this._.isNumber(id) || !isNaN(Number(id))) {
			query = `DELETE FROM ${this.table} WHERE ID = ?;`;
			params = +id;
		} else {
			connection.release();
			return await this.handleException(SQLException, "Invalid ID format");
		}

		try {
			const [result]: CustomTypes["mysqlTypes"]["mysqlQueryType"] = await connection.query(query, params);

			if (automaticConnectionRelease) {
				connection.release();
			}
			return (result as any).affectedRows;
		} catch (error) {
			connection.release();
			return await this.handleException(SQLException, `Query could not be executed!. \n Error: ${error}`);
		}
	}

	/**
	 * @function deleteAll
	 * @description Deletes all data records from a specified table.
	 * @version 1.0.1
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {string} table - The name of the table from which all records will be deleted.
	 * A promise that resolves with the query result or rejects with an exception.
	 * @throws {LogicException} If the user is not allowed to delete records.
	 * @throws {SQLException} If the table doesn't exist or the query fails.
	 * @returns {Promise<LogicException | SQLException | [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>}
	 */
	async deleteAll(connection?: PoolConnection): Promise<CustomTypes["mysqlFunctions"]["fetch"]["returnType"]> {
		if (!this._columnsValidationExcuted) {
			await this.validateColumns();
		}

		let automaticConnectionRelease = true;
		if (connection) {
			automaticConnectionRelease = false;
		} else {
			connection = await this.pool.getConnection();
		}

		if (!this.canDelete) {
			connection.release();
			return await this.handleException(LogicException, "User cannot delete!");
		}

		if (this._.isEmpty(this.table)) {
			connection.release();
			return await this.handleException(SQLException, "Table must not be empty!");
		}

		const tableExists = !!(await this.describeTable(this.table, connection));
		if (!tableExists) {
			connection.release();
			return await this.handleException(SQLException, `The Table ${this.table} does not exist in the database!`);
		}

		try {
			const [result]: CustomTypes["mysqlTypes"]["mysqlQueryType"] = await connection.query(
				`DELETE FROM ${this.table};`
			);

			if (automaticConnectionRelease) {
				connection.release();
			}
			return (result as any).affectedRows;
		} catch (error) {
			connection.release();
			return await this.handleException(SQLException, "Query could not be executed!");
		}
	}

	/**
	 * @function filter
	 * @description filters data records
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Object} params - specified params for filtering query
	 * @param {boolean} isRecursiv - is recursive indeicates if all foreign key must be fetched from the db (expensive)
	 * @param {String} limit - placeholde for limiting records
	 * @param {string} order - order by type for the query
	 * @returns {Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader | SQLException |LogicException>}
	 */
	async filter(
		params?:
			| Partial<{
					[key in keyof this["modelColumns"]]: string | number | undefined;
			  }>
			| string,
		isRecursiv: boolean = false,
		limit: string | number = "",
		order: string = "ASC",
		connection?: PoolConnection
	): Promise<CustomTypes["mysqlTypes"]["mysqlQuery"]> {
		if (!this._columnsValidationExcuted) {
			await this.validateColumns();
		}

		if (this._.isString(params)) {
			const parsedParams = this.parseSqlConditionString(params);
			await this.validateTypesAgainstModelColumns(parsedParams);
		}

		if (this._.isObject(params)) {
			await this.validateTypesAgainstModelColumns(params);
		}

		return await this.fetchQuery(this.table, params!, true, false, false, isRecursiv, order, limit, connection);
	}

	/**
	 * @function get
	 * @description gets only one data record
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {object | number} params - specified params for get query
	 * @param {boolean} isRecursiv - is recursive indeicates if all foreign key must be fetched from the db (expensive)
	 * @returns {Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader | SQLException |LogicException>}
	 */
	async get(
		params:
			| Partial<{
					[key in keyof this["modelColumns"]]: string | number | undefined;
			  }>
			| number,
		isRecursiv: boolean = false,
		connection?: PoolConnection
	): Promise<CustomTypes["mysqlTypes"]["mysqlQuery"]> {
		if (!this._columnsValidationExcuted) {
			await this.validateColumns();
		}

		if (this._.isObject(params)) {
			await this.validateTypesAgainstModelColumns(params);
		}

		return await this.fetchQuery(this.table, params!, false, true, false, isRecursiv, "", "", connection);
	}

	/**
	 * @function all
	 * @description gets all data records
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {string} order - order by type for the query
	 * @param {boolean} isRecursiv - is recursive indeicates if all foreign key must be fetched from the db (expensive)
	 * @param {string} table - the name of the table from which the query will executed from
	 * @returns {Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader | SQLException |LogicException>}
	 */
	async all(
		order: string = "ASC",
		isRecursiv: boolean = false,
		connection?: PoolConnection
	): Promise<CustomTypes["mysqlTypes"]["mysqlQuery"]> {
		if (!this._columnsValidationExcuted) {
			await this.validateColumns();
		}
		return await this.fetchQuery(this.table, {}, false, false, true, isRecursiv, order, "", connection);
	}

	/**
	 * @function create
	 * @description create a data record
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {object} values - values for creating the record as an object
	 * @returns {Promise<mysql.RowDataPacket[] | mysql.OkPacket | mysql.ResultSetHeader>}
	 */
	async create(
		values: Partial<{
			[key in keyof this["modelColumns"]]: string | number | undefined;
		}>,
		connection?: PoolConnection
	): Promise<CustomTypes["mysqlFunctions"]["create"]> {
		if (!this._columnsValidationExcuted) {
			await this.validateColumns();
		}

		await this.validateTypesAgainstModelColumns(values);

		let automaticConnectionRelease = true;
		if (connection) {
			automaticConnectionRelease = false;
		} else {
			connection = await this.pool.getConnection();
		}

		if (this.canCreate !== true) {
			connection.release();
			return await this.handleException(LogicException, "User can not create!");
		}

		if (this._.isEmpty(this.table)) {
			connection.release();
			return await this.handleException(LogicException, "Table must not be empty!");
		}

		const tableExists = !!(await this.describeTable(this.table, connection));
		if (!tableExists) {
			connection.release();
			return await this.handleException(SQLException, `The Table ${this.table} does not exist in the database!`);
		}

		if (!this._.isObject(values) || this._.isEmpty(values)) {
			connection.release();
			return await this.handleException(LogicException, "No columns neither values are specified!");
		}

		try {
			const [result]: CustomTypes["mysqlTypes"]["mysqlQueryType"] = await connection.query(
				`INSERT INTO ${this.table} SET ?;`,
				[values]
			);

			if (automaticConnectionRelease) {
				connection.release();
			}
			return (result as any).insertId;
		} catch (error) {
			connection.release();
			return await this.handleException(SQLException, `Failed to insert data into the table! \n Error: ${error}`);
		}
	}

	/**
	 * @function update
	 * @description updates data record(s)
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {string} table - the name of the table from which the query will executed from
	 * @param {object} values - values for updating the records as an object
	 * @param {object|number|null} where - where as a object or number of the id or null for the update query
	 * @returns {Promise<mysql.RowDataPacket[] | mysql.OkPacket | mysql.ResultSetHeader>}
	 */
	async update(
		values: Partial<{
			[key in keyof this["modelColumns"]]: string | number | undefined;
		}>,
		where?: Partial<
			| {
					[key in keyof this["modelColumns"]]: string | number | undefined;
			  }
			| string
			| number
		>,
		connection?: PoolConnection
	): Promise<CustomTypes["mysqlFunctions"]["update"]> {
		if (!this._columnsValidationExcuted) {
			await this.validateColumns();
		}
		await this.validateTypesAgainstModelColumns(values);

		let automaticConnectionRelease = true;
		if (connection) {
			automaticConnectionRelease = false;
		} else {
			connection = await this.pool.getConnection();
		}

		if (this.canDelete === true) {
			connection.release();
			return await this.handleException(LogicException, "User can not update!");
		}

		if (this._.isEmpty(this.table)) {
			connection.release();
			return await this.handleException(LogicException, "Table must not be empty!");
		}

		if (!this._.isObject(values) || this._.isEmpty(values)) {
			connection.release();
			return await this.handleException(SQLException, "No columns neither values are specified!");
		}

		const tableExists = !!(await this.describeTable(this.table, connection));
		if (!tableExists) {
			connection.release();
			return await this.handleException(SQLException, `The Table ${this.table} does not exist in the database!`);
		}

		let primaryKey: string = this.primaryKey;

		if (this._.isEmpty(primaryKey)) {
			try {
				primaryKey = await this.getTablePrimaryKey(this.table, connection);
			} catch (error) {
				connection.release();
				return await this.handleException(
					SQLException,
					`Could not retrieve primary key of the table "${this.table}"!`,
					error
				);
			}
		}

		let result: CustomTypes["mysqlTypes"]["mysqlQueryType"][0];
		if (this._.isObject(where)) {
			const whereClauses = Object.keys(where)
				.map((key) => `${key} = ?`)
				.join(" AND ");
			const whereValues = Object.values(where);
			[result] = await connection.query(`UPDATE ${this.table} SET ? WHERE ${whereClauses};`, [
				values,
				...whereValues
			]);
		} else if (this._.isString(where)) {
			[result] = await connection.query(`UPDATE ${this.table} SET ? WHERE ${where};`, [values]);
		} else if (this._.isNumber(where)) {
			[result] = await connection.query(`UPDATE ${this.table} SET ? WHERE id = ?;`, [values, where]);
		} else {
			[result] = await connection.query(`UPDATE ${this.table} SET ?;`, [values]);
		}

		if (automaticConnectionRelease) {
			connection.release();
		}

		if (result && (result as any).affectedRows) {
			return (result as any).affectedRows;
		}

		return Promise.reject(new SQLException("Query could not be executed!"));
	}

	/**
	 * @function getTablePrimaryKey
	 * @description gets the table primary key
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {String} table - the name of the table from which the query will executed from
	 * @returns {Promise<string>}
	 */
	protected async getTablePrimaryKey(table: string = this.table, connection?: PoolConnection): Promise<string> {
		let automaticConnectionRelease = true;
		if (connection) {
			automaticConnectionRelease = false;
		} else {
			connection = await this.pool.getConnection();
		}

		if (!this._.isEmpty(this.primaryKey)) {
			if (automaticConnectionRelease) {
				connection.release();
			}
			return this.primaryKey;
		}

		const database_index = table.indexOf(".");
		if (database_index === this.constants.STRING_RETURN_NUMBERS.NOT_FOUND) {
			connection.release();
			return Promise.reject(
				new SQLException(
					`Please write the database name in the return value of the abstract function "table() = ${table}" in the module class (${this.model})`
				)
			);
		}

		const length = table.toString().length;
		const result = !!(await this.describeTable(table, connection));

		if (!result) {
			connection.release();
			return Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`));
		}

		const database = table.substring(0, database_index);
		const table_name = table.substring(database_index + 1, length);

		const query = (await connection.query(
			"select COLUMN_NAME from information_schema.KEY_COLUMN_USAGE " +
				"where CONSTRAINT_NAME='PRIMARY' AND TABLE_NAME='" +
				table_name +
				"' " +
				"AND TABLE_SCHEMA='" +
				database +
				"'"
		)) as RowDataPacket[];

		if (automaticConnectionRelease) {
			connection.release();
		}

		if (this._.isEmpty(query)) {
			connection.release();
			return Promise.reject(new SQLException("Query could not be executed!"));
		}

		return Promise.resolve(query[0][0]["COLUMN_NAME"]);
	}

	/**
	 * @function fetchQuery
	 * @description fetches a query from the database
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {string} table
	 * @param {Partial<{ [key in keyof CustomTypes["SqlModelTypes"]["columns"]]: string | number | null } | string | number>} params
	 * @param {boolean} isFilter - a placeholder for executing the query methodic for different functionalities
	 * @param {boolean} fetchAll - a placeholder for executing the query methodic for all records of the specified model
	 * @param {number} limit - placeholde for limiting records
	 * @returns {Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader | SQLException | LogicException | { [key: string]: any };>}
	 */
	protected async fetchQuery(
		table: string = this.table,
		params: CustomTypes["mysqlFunctions"]["fetch"]["mixed"]["params"],
		isFilter: boolean = false,
		isGet: boolean = false,
		fetchAll: boolean = false,
		isRecursiv: boolean = false,
		order: string = "ASC",
		limit: number | string = "",
		connection?: PoolConnection
	): Promise<CustomTypes["mysqlTypes"]["mysqlQuery"]> {
		let automaticConnectionRelease = true;
		if (connection) {
			automaticConnectionRelease = false;
		} else {
			connection = await this.pool.getConnection();
		}

		if (this._.isEmpty(table)) {
			connection.release();
			return await this.handleException(LogicException, "Table must not be empty!");
		}

		const tableExists = !!(await this.describeTable(table, connection));
		if (!tableExists) {
			connection.release();
			return await this.handleException(SQLException, `The Table ${table} does not exist in the database!`);
		}

		let whereClause: string[] | string = [];
		let columnName: string = "";
		let foreignKeyReference: {
			name: string;
			table: string;
			class: { table: string } | (new (...args: any[]) => any);
			column: string;
		};
		let constraintTable: string = "";
		let constraintForeignKey: string = "";
		let sql: string = "";
		let reverseTable: string = "";
		let reverseCol: string = "";
		let whereCol: string = "";
		let whereTbl: string = "";
		let reverseName: string = "";
		let primaryKey: string = this.primaryKey;
		let cacheKey: string = "";

		if (this._.isEmpty(primaryKey)) {
			try {
				primaryKey = await this.getTablePrimaryKey(table, connection);
			} catch (error) {
				connection.release();
				return await this.handleException(
					SQLException,
					`Could not retrieve primary key of the table "${table || this.table}"!`,
					error
				);
			}
		}

		if (fetchAll === false && (!this._.isEmpty(params) || !this._.isNil(params))) {
			if (isGet && isRecursiv) {
				const getCacheKey = `sql:"getRecursiveData":${table}`;
				const getCachedResult = await this.redis.getCachedResult(getCacheKey);

				if (getCachedResult) {
					if (automaticConnectionRelease) {
						connection.release();
					}
					await this.redis.quit();
					return getCachedResult;
				}

				const getRecursiveResults = this.deepCamelCaseKeys(
					await this.getRecursiveData(params, table, connection)
				);

				if (getRecursiveResults) {
					await this.redis.cacheResult(
						getCacheKey,
						getRecursiveResults,
						config.configurations().redisCacheExpiry
					);
				}

				await this.redis.quit();
				return getRecursiveResults;
			} else if (isFilter && isRecursiv) {
				const cacheKey = `sql:"filterRecursiveData":${table}`;
				const cachedResult = await this.redis.getCachedResult(cacheKey);

				if (cachedResult) {
					if (automaticConnectionRelease) {
						connection.release();
					}
					await this.redis.quit();
					return cachedResult;
				}

				let filterRecursiveResults = null;

				if (this._.isString(params)) {
					filterRecursiveResults = this.deepCamelCaseKeys(
						await this.filterRecursiveData(connection, params, order, limit, table, false)
					);
				} else if (this._.isObject(params)) {
					for (const key in params) {
						if (Object.hasOwnProperty.call(params, key)) {
							whereClause.push(`${key} = ${params[key]}`);
						}
					}

					if (!this._.isEmpty(whereClause)) {
						whereClause = whereClause.join(" AND ");
					}

					filterRecursiveResults = this.deepCamelCaseKeys(
						await this.filterRecursiveData(connection, whereClause as string, order, limit, table, false)
					);
				} else {
					const allCacheKey = `sql:"allRecursiveData":${table}`;
					const allCachedResult = await this.redis.getCachedResult(allCacheKey);
					if (allCachedResult) {
						if (automaticConnectionRelease) {
							connection.release();
						}
						await this.redis.quit();
						return allCachedResult;
					}

					const allRecursiveResults = this.deepCamelCaseKeys(
						await this.filterRecursiveData(connection, "", order, limit, table, true)
					);

					if (allRecursiveResults) {
						await this.redis.cacheResult(
							allCacheKey,
							allRecursiveResults,
							config.configurations().redisCacheExpiry
						);
					}

					await this.redis.quit();
					return allRecursiveResults;
				}

				if (filterRecursiveResults) {
					await this.redis.cacheResult(
						cacheKey,
						filterRecursiveResults,
						config.configurations().redisCacheExpiry
					);
				}

				await this.redis.quit();
				return filterRecursiveResults;
			}

			const cacheKey = `sql:"filter":${table}`;
			const filterCachedResult = await this.redis.getCachedResult(cacheKey);

			if (filterCachedResult) {
				if (automaticConnectionRelease) {
					connection.release();
				}
				await this.redis.quit();
				return filterCachedResult;
			}

			if (this._.isObject(params)) {
				for (const key in params) {
					if (Object.hasOwnProperty.call(params, key)) {
						whereClause.push(`${key} = ?`);
					}
				}

				if (!this._.isEmpty(whereClause)) {
					whereClause = whereClause.join(" AND ");
					sql = `SELECT * FROM ${table} WHERE ${whereClause} ORDER BY ${primaryKey} ${order}`;
					(params as object) = Object.values(params);
				}
			} else if (this._.isString(params)) {
				sql = `SELECT * FROM ${table} WHERE ${params} ORDER BY ${primaryKey} ${order}`;
			} else if (this._.isNumber(params)) {
				sql = `SELECT * FROM ${table} WHERE ${primaryKey} = ? ORDER BY ${primaryKey} ${order}`;
			}

			if (isGet) {
				sql += ` LIMIT 1;`;
			} else if (isFilter) {
				if (!this._.isEmpty(limit)) {
					sql += ` LIMIT ${limit.toString()};`;
				}
			} else {
				sql += ";";
			}
		} else {
			if (isRecursiv) {
				const allCacheKey = `sql:"allRecursiveData":${table}`;
				const allCachedResult = await this.redis.getCachedResult(allCacheKey);

				if (allCachedResult) {
					if (automaticConnectionRelease) {
						connection.release();
					}
					await this.redis.quit();
					return allCachedResult;
				}

				const allRecursiveResults = this.deepCamelCaseKeys(
					await this.filterRecursiveData(connection, "", order, "", table, true)
				);

				if (allRecursiveResults) {
					await this.redis.cacheResult(
						allCacheKey,
						allRecursiveResults,
						config.configurations().redisCacheExpiry
					);
				}

				await this.redis.quit();
				return allRecursiveResults;
			}

			const cacheKey = `sql:"all":${table}`;
			const allCachedResult = await this.redis.getCachedResult(cacheKey);

			if (allCachedResult) {
				await this.redis.quit();
				return allCachedResult;
			}

			params = "";
			sql = `SELECT * FROM ${table} ORDER BY ${primaryKey} ${order}`;
		}

		let [rows, fields] = await connection.query(sql, [params]);

		rows = this.deepCamelCaseKeys(rows);

		if (!this._.isEmpty(rows)) {
			if (this._.isObject(this.modelColumns) && !this._.isEmpty(this.modelColumns)) {
				for (const key in this.modelColumns) {
					columnName = key;
					foreignKeyReference = (this.modelColumns as any)[columnName]?.references;

					if (this._.isEmpty(foreignKeyReference)) {
						continue;
					}

					if (!("column" in foreignKeyReference)) {
						connection.release();
						await this.redis.quit();
						return await this.handleException(
							LogicException,
							`Property "column" of the referenced column name ${columnName} of the tabel ${table} of the model ${this.model} does not exist!`
						);
					}

					if (!("table" in foreignKeyReference) && !("class" in foreignKeyReference)) {
						connection.release();
						await this.redis.quit();
						return await this.handleException(
							LogicException,
							`One of the properties "table" or "class" of the referenced column name ${columnName} of the tabel ${table} of the model ${this.model} must be defined!`
						);
					}

					if (this._.isString(foreignKeyReference.class)) {
						connection.release();
						await this.redis.quit();
						return await this.handleException(
							LogicException,
							`Property "class" of the referenced column name ${columnName} of the tabel ${table} of the model ${this.model} must be either a model class or an initiated instance of the model class!`
						);
					}

					if (foreignKeyReference.table && this._.isString(foreignKeyReference.table)) {
						constraintTable = foreignKeyReference.table;
					} else if (isConstructor(foreignKeyReference.class)) {
						const classInstance = new (foreignKeyReference.class as new (...args: any[]) => {
							table: string;
						})();
						constraintTable = classInstance.table;
					} else if (isInstance(foreignKeyReference.class)) {
						constraintTable = (foreignKeyReference.class as { table: string }).table;
					}

					if (this._.isEmpty(constraintTable)) {
						connection.release();
						await this.redis.quit();
						return await this.handleException(
							LogicException,
							`Property table of the model ${foreignKeyReference.class} is not defined!`
						);
					}

					constraintForeignKey = foreignKeyReference.column;

					if (!this._.isEmpty(constraintForeignKey)) {
						try {
							const [constraintQuery]: CustomTypes["mysqlTypes"]["mysqlQueryType"] =
								await connection.query(
									`SELECT * 
								FROM ${constraintTable} 
								WHERE ${constraintForeignKey} = ?`,
									[(rows as any)[0][this._.camelCase(columnName)]]
								);

							if (this._.isArray(constraintQuery)) {
								(rows as any)[this._.camelCase(columnName)] = {
									[this._.camelCase(foreignKeyReference.name)]: this.deepCamelCaseKeys(
										constraintQuery[0]
									)
								};
							} else {
								connection.release();
								await this.redis.quit();
								return await this.handleException(
									LogicException,
									`Could not return the query because it is not an array!`
								);
							}
						} catch (error) {
							connection.release();
							await this.redis.quit();
							return await this.handleException(
								SQLException,
								`Column "${constraintForeignKey}" does not exist in table "${constraintTable}"!`,
								error
							);
						}
					} else {
						try {
							primaryKey = await this.getTablePrimaryKey(constraintTable, connection);
						} catch (error) {
							connection.release();
							await this.redis.quit();
							return await this.handleException(
								SQLException,
								`Could not retrieve primary key of the table "${constraintTable}"!`,
								error
							);
						}

						try {
							const [constraintQuery]: CustomTypes["mysqlTypes"]["mysqlQueryType"] =
								await connection.query(
									`SELECT *
								FROM ${constraintTable}
								WHERE ${primaryKey} = ?`,
									[(rows as any)[0][this._.camelCase(columnName)]]
								);
							if (this._.isArray(constraintQuery)) {
								(rows as any)[this._.camelCase(columnName)] = {
									[this._.camelCase(foreignKeyReference.name)]: this.deepCamelCaseKeys(
										constraintQuery[0]
									)
								};
							} else {
								connection.release();
								await this.redis.quit();
								return await this.handleException(
									LogicException,
									`Could not return the query because it is not an array!`
								);
							}
						} catch (error) {
							connection.release();
							await this.redis.quit();
							return await this.handleException(
								SQLException,
								`Query could not be executed for table "${constraintTable}"!`,
								error
							);
						}
					}
				}
			}

			if (this._.isObject(this.reverseReferences) && !this._.isEmpty(this.reverseReferences)) {
				for (const key in this.reverseReferences) {
					if (!("table" in this.reverseReferences[key]) || !("column" in this.reverseReferences[key])) {
						connection.release();
						await this.redis.quit();
						return await this.handleException(
							LogicException,
							`The referenced column property ${this.reverseReferences[key]} 
							must have the properties table and column.`
						);
					}

					if (!this._.isEmpty(this.reverseReferences[key].settings)) {
						if (
							!("whereColumn" in this.reverseReferences[key].settings!) ||
							!("whereTable" in this.reverseReferences[key].settings!)
						) {
							connection.release();
							await this.redis.quit();
							return await this.handleException(
								LogicException,
								`The property "settings" of the object ${this.reverseReferences[key].settings} must have the properties whereColumn and whereTable.`
							);
						}

						whereCol = this.reverseReferences[key]?.settings!.whereColumn;
						whereTbl = this.reverseReferences[key]?.settings!.whereTable;
					}

					reverseTable = this.reverseReferences[key].table;
					reverseCol = this.reverseReferences[key].column;
					reverseName = key;

					if (!this._.isEmpty(whereCol) && !this._.isEmpty(whereTbl)) {
						try {
							primaryKey = await this.getTablePrimaryKey(whereTbl, connection);
						} catch (error) {
							connection.release();
							await this.redis.quit();
							return await this.handleException(
								SQLException,
								`Could not retrieve primary key of the table "${constraintTable}"!`,
								error
							);
						}

						try {
							let sqlStatement =
								"SELECT * FROM " +
								reverseTable +
								" " +
								"WHERE " +
								reverseTable +
								"." +
								reverseCol +
								" IN ( " +
								"SELECT " +
								primaryKey +
								" " +
								"FROM " +
								whereTbl;

							if (!this._.isNil((rows as any)[0][whereCol])) {
								sqlStatement += " " + "WHERE " + whereCol + " = " + "?" + " )";
							} else {
								sqlStatement += " )";
							}

							const [constraintQuery]: CustomTypes["mysqlTypes"]["mysqlQueryType"] =
								await connection.query(sqlStatement);

							if (this._.isArray(constraintQuery)) {
								this._.assign(rows as any, {
									[this._.camelCase(reverseName)]: this.deepCamelCaseKeys(constraintQuery[0]),
									reverseTableName: reverseTable,
									reversedNestedTableName: whereTbl,
									reversedNestedColumnName: whereCol
								});
							} else {
								connection.release();
								await this.redis.quit();
								return await this.handleException(
									LogicException,
									`Could not return the query because it is not an array!`
								);
							}
						} catch (error) {
							connection.release();
							await this.redis.quit();
							return await this.handleException(
								SQLException,
								`Reverse query for the table ${reverseTable} could not be executed!`,
								error
							);
						}
					} else {
						try {
							primaryKey = await this.getTablePrimaryKey(reverseTable, connection);
						} catch (error) {
							connection.release();
							await this.redis.quit();
							return await this.handleException(
								SQLException,
								`Could not retrieve primary key of the table "${reverseTable}"!`,
								error
							);
						}

						try {
							// todo reverseCol that does not match the primary key of the table must be fetched and identified seperatly in order to get the right name from the rows variable to have the value and then to assign the reversed reference name to the results array
							// todo get table meta data and see the reverseCol relationship to which column does it reference then call the column name from meta data and then attach it as index to rows variable to get the right value
							// todo and then attach redis to the rest of the functions in sqlModel
							sql = `SELECT * FROM ${reverseTable} WHERE ${reverseCol} = ?`;
							const [constraintQuery]: CustomTypes["mysqlTypes"]["mysqlQueryType"] =
								await connection.query(sql, [(rows as any)[0][reverseCol]]);

							console.log(sql);
							console.log(reverseTable);
							console.log(reverseCol);
							console.log(rows);
							if (this._.isArray(constraintQuery)) {
								this._.assign(rows as any, {
									[this._.camelCase(reverseName)]: this.deepCamelCaseKeys(constraintQuery[0]),
									reverseTableName: reverseTable
								});
							} else {
								connection.release();
								await this.redis.quit();
								return await this.handleException(
									LogicException,
									`Could not return the query because it is not an array!`
								);
							}
						} catch (error) {
							connection.release();
							await this.redis.quit();
							return await this.handleException(
								SQLException,
								`Query for column ${reverseCol} with the value of ${
									(rows as any)[0][primaryKey]
								} of the table "${reverseTable}" could not be executed!`,
								error
							);
						}
					}
				}
			}
		}

		if (automaticConnectionRelease) {
			connection.release();
		}

		if (rows) {
			await this.redis.cacheResult(cacheKey, rows, config.configurations().redisCacheExpiry);
		}

		await this.redis.quit();
		return Promise.resolve(rows);
	}

	/**
	 * @function fetchTableMetadata
	 * @description fetches the metadata of a table (foreign and primary keys, and relationships)
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {string} table - Name of the table
	 * @returns {Promise<{primaryKey: string; relationships: {foreign_key_column: any;referenced_table: any;referenced_column: any;}}>}
	 */
	protected async fetchTableMetadata(table: string, connection?: PoolConnection): Promise<object | undefined> {
		let automaticConnectionRelease = true;
		if (connection) {
			automaticConnectionRelease = false;
		} else {
			connection = await this.pool.getConnection();
		}

		try {
			table = await this.escapeDatabaseName(table);
			let primaryKey: string = "";
			const metadataQuery = `
				SELECT COLUMN_NAME as primaryKey, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME, COLUMN_NAME as foreignKeyColumn
				FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
				WHERE TABLE_NAME = ?
				AND REFERENCED_TABLE_SCHEMA = DATABASE();`;

			const [result] = await connection.query(metadataQuery, [table]);
			if (this._.isArray(result)) {
				const rows = result as mysql.RowDataPacket[];
				if (!this._.isEmpty(rows[0])) {
					primaryKey = rows[0]["primaryKey"];
				}
				const relationships = result.map((row) => ({
					foreign_key_column: (row as any).foreignKeyColumn,
					referenced_table: (row as any).REFERENCED_TABLE_NAME,
					referenced_column: (row as any).REFERENCED_COLUMN_NAME
				}));

				if (automaticConnectionRelease) {
					connection.release();
				}
				return { primaryKey, relationships };
			}
		} catch (error) {
			connection.release();
			return await this.handleException(
				SQLException,
				`Could not get the metadata of the table "${table}"! \n ${error}`
			);
		}
	}

	/**
	 * @function getRecursiveData
	 * @description get one datarecord from the database and all it's relationships
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {number|object|string|undefined} params - number of id of a table
	 * @param {string} table - name of the table
	 * @returns {Promise<object>}
	 */
	protected async getRecursiveData(
		params: number | object | string | undefined,
		table?: string,
		connection?: PoolConnection
	): Promise<object> {
		let automaticConnectionRelease = true;
		if (connection) {
			automaticConnectionRelease = false;
		} else {
			connection = await this.pool.getConnection();
		}

		try {
			if (this._.isEmpty(table)) {
				table = this.table;
			}

			let primaryKey: string = await this.getTablePrimaryKey(table!, connection);
			if (this._.isEmpty(primaryKey)) {
				connection.release();
				return await this.handleException(
					SQLException,
					`Could not get the primary key for the table "${this.table}"!`
				);
			}

			let whereClause: string[] | string = [];
			let sql = `SELECT * FROM ${table!} WHERE ${primaryKey} = ?`;
			const metadata = await this.fetchTableMetadata(table!, connection);

			if (this._.isObject(params)) {
				for (const key in params) {
					if (Object.hasOwnProperty.call(params, key)) {
						whereClause.push(`${key} = ?`);
					}
				}

				if (!this._.isEmpty(whereClause)) {
					whereClause = whereClause.join(" AND ");
					sql = `SELECT * FROM ${table} WHERE ${whereClause} ORDER BY ${primaryKey} ASC LIMIT 1;`;
					(params as object) = Object.values(params);
				}
			} else if (this._.isString(params)) {
				params = this.mysql.escape(params);
				sql = `SELECT * FROM ${table} WHERE ? ORDER BY ${primaryKey} ASC LIMIT 1;`;
			} else if (this._.isNumber(params)) {
				if (this._.isEmpty((metadata as any).primaryKey) || this._.isEmpty((metadata as any).relationships)) {
					sql = `SELECT * FROM ${table} WHERE ${primaryKey} = ? ORDER BY ${primaryKey} ASC LIMIT 1;`;
					const [result] = await connection.query(sql, [params]);
					if (this._.isArray(result)) {
						if (automaticConnectionRelease) {
							connection.release();
						}
						return result[0];
					}
				}

				sql = `SELECT * FROM ${table!} WHERE ${
					(metadata as any).primaryKey
				} = ? ORDER BY ${primaryKey} ASC LIMIT 1`;
			}

			const [record] = await connection.query(sql, [params]);

			if (!this._.isEmpty((metadata as any).relationships) && !this._.isEmpty(record) && this._.isArray(record)) {
				for (const relationship of (metadata as any).relationships!) {
					try {
						const relatedQuery = `
							SELECT *
							FROM ${relationship.referenced_table}
							WHERE ${relationship.referenced_column} = ?`;
						const [result, fields] = await connection.query(relatedQuery, [
							(record as any)[0][relationship.foreign_key_column]
						]);

						if (
							!this._.isEmpty(result) &&
							this._.isArray(result) &&
							this._.isArray(fields) &&
							!this._.isEmpty(fields)
						) {
							for (const column of fields) {
								if (column.flags === this.MYSQL_PRIMARY_KEY_FLAG) {
									primaryKey = column.name;
								}
							}

							(record as any)[0][relationship.foreign_key_column] = await this.getRecursiveData(
								(result as any)[0][primaryKey],
								relationship.referenced_table,
								connection
							);
						}
					} catch (error) {
						connection.release();
						return await this.handleException(
							SQLException,
							`Could not fetch recursive data for the table "${table!}"! \n ${error}`
						);
					}
				}
			}

			if (this._.isEmpty((metadata as any).primaryKey)) {
				if (automaticConnectionRelease) {
					connection.release();
				}

				return {};
			}

			if (this._.isArray(record)) {
				if (automaticConnectionRelease) {
					connection.release();
				}

				return record[0];
			} else {
				connection.release();
				return await this.handleException(
					LogicException,
					`Could not return the query because it is not an array!`
				);
			}
		} catch (error) {
			connection.release();
			return await this.handleException(
				SQLException,
				`Could not fetch recursive data for the tablesss "${table!}"! \n ${error}`
			);
		}
	}

	/**
	 * @function filterRecursiveData
	 * @description filter multiple datarecords from the database and all it's relationships
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param table - name of the table
	 * @returns {Promise<object>}
	 */
	protected async filterRecursiveData(
		connection: PoolConnection,
		params?:
			| Partial<{
					[key in keyof this["modelColumns"]]: string | number | undefined;
			  }>
			| string,
		order: string = "ASC",
		limit: number | string = "",
		table?: string,
		isAll: boolean = false
	): Promise<object> {
		try {
			if (this._.isEmpty(table)) {
				table = this.table;
			}

			const primaryKey = await this.getTablePrimaryKey(table!, connection);
			if (this._.isEmpty(primaryKey)) {
				connection.release();
				return await this.handleException(
					SQLException,
					`Could not get the primary key for the table "${this.table}"!`
				);
			}

			const metadata = await this.fetchTableMetadata(table!, connection);
			let sql: string = `SELECT * FROM ${table} ORDER BY ${primaryKey} ${order}`;
			const descTable = await this.describeTable(table as string, connection);
			const validFields = (descTable as any).map((field: { Field: string }) => field.Field);

			if (this._.isString(params) && !isAll) {
				const conditions = params.split(/\s+(AND|OR)\s+/i);
				const filteredConditions = conditions
					.map((condition) => {
						const match = condition.match(
							/^\s*(\w+)\s*(=|!=|<>|>|<|>=|<=|LIKE|ILIKE|NOT LIKE|IS NULL|IS NOT NULL|IN|NOT IN|BETWEEN)\s*(.*)$/i
						);

						if (match) {
							const [_, field, operator, value] = match;

							if (validFields.includes(field.trim())) {
								if (operator.toUpperCase().includes("NULL")) {
									return `${field} ${operator}`;
								}

								if (operator.toUpperCase() === "BETWEEN") {
									const betweenValues = value.split(/\s+AND\s+/i);
									if (betweenValues.length === 2) {
										return `${field} ${operator} ${betweenValues[0]} AND ${betweenValues[1]}`;
									} else {
										return "";
									}
								}

								if (operator.toUpperCase() === "IN" || operator.toUpperCase() === "NOT IN") {
									if (value.startsWith("(") && value.endsWith(")")) {
										return `${field} ${operator} ${value}`;
									} else {
										return "";
									}
								}

								return `${field} ${operator} ${value}`;
							}
						}
						return "";
					})
					.filter(Boolean);

				params = filteredConditions.join(" AND ");
				sql = `SELECT * FROM ${table} WHERE ${params} ORDER BY ${primaryKey} ${order}`;
			} else if (this._.isNumber(params) && !isAll) {
				sql = `SELECT * FROM ${table} WHERE ${primaryKey} = ? ORDER BY ${primaryKey} ${order}`;
			}

			if (!this._.isNil(limit) && !this._.isEmpty() && !isAll) {
				sql += ` LIMIT ${limit.toString()};`;
			}

			const [records] = await connection.query(sql, [params]);

			if (this._.isArray(records) && !this._.isEmpty(records)) {
				for (const record of records) {
					if (!this._.isEmpty((metadata as any).relationships) && !this._.isEmpty(record)) {
						for (const relationship of (metadata as any).relationships!) {
							try {
								(record as any)[relationship.referenced_table] = await this.filterRecursiveData(
									connection,
									params,
									order,
									limit,
									relationship.referenced_table,
									isAll
								);
							} catch (error) {
								connection.release();
								return await this.handleException(
									SQLException,
									`Could not fetch recursive data for the table "${table!}"! \n ${error}`
								);
							}
						}
					}
				}
			}

			if (this._.isArray(records)) {
				connection.release();
				return records[0];
			} else {
				connection.release();
				return await this.handleException(
					LogicException,
					`Could not return the query because it is not an array!`
				);
			}
		} catch (error) {
			connection.release();
			return await this.handleException(
				SQLException,
				`Could not fetch recursive data for the table "${table!}"! \n ${error}`
			);
		}
	}

	/**
	 * @function escapeDatabaseName
	 * @description return the table name with the database prefix
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param table - name of the table
	 * @returns {Promise<string>}
	 */
	protected async escapeDatabaseName(table: string): Promise<string> {
		if (this._.isEmpty(table)) {
			return "";
		}
		return this._.replace(table, /^.*\./, "");
	}

	/**
	 * @function deepCamelCaseKeys
	 * @description return object's indexes of an array or object's indexes as camelCased
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param object - the object or array to adjust
	 * @returns {object}
	 */
	protected deepCamelCaseKeys = (object: {} | []): any => {
		if (this._.isArray(object)) {
			return object.map((item) => {
				if (this._.isObject(item)) {
					return this.deepCamelCaseKeys(item);
				}
				return item;
			});
		} else if (this._.isObject(object) && !this._.isDate(object)) {
			return this._.mapKeys(
				this._.mapValues(object, (value) => {
					return this.deepCamelCaseKeys(value);
				}),
				(value, key) => this._.camelCase(key)
			);
		}
		return object;
	};

	/**
	 * @function parseSqlConditionString
	 * @description Parses a SQL-like condition string (e.g., "id = 2 AND title = 'some title'")
	 *              into an object where each key is a column name and each value is the condition.
	 * @param {string} condition - The SQL-like condition string to parse.
	 * @returns {object} - Returns an object with key-value pairs.
	 */
	protected parseSqlConditionString(condition: string): { [key: string]: any } {
		const conditionObject: { [key: string]: any } = {};

		const regex = /([a-zA-Z_]+)\s*(=|>|<|<=|>=|!=|LIKE|IN)\s*(['"]?[\w\s]*['"]?)/g;
		let match: RegExpExecArray | null;

		while ((match = regex.exec(condition)) !== null) {
			const [_, key, operator, value] = match;
			const cleanedValue = value.replace(/['"]/g, "");
			conditionObject[key] = cleanedValue;
		}

		return conditionObject;
	}
}

export default SqlModel;
