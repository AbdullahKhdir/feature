import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import LogicException from "./exception/types/LogicException";
import SQLException from "./exception/types/SQLException";
import expressSession from "express-session";
import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";

export interface CustomTypes {
	mysqlTypes: {
		dbColumn: string | null[];
		mysqlQueryResultType: RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader;
		mysqlQueryType: [
			RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader,
			FieldPacket[] | []
		];
		mysqlQuery:
			| RowDataPacket[]
			| RowDataPacket[][]
			| OkPacket
			| OkPacket[]
			| ResultSetHeader
			| SQLException
			| LogicException
			| { [key: string]: any };
	};

	mysqlFunctions: {
		delete: { id: string | number | { [key: string]: string | number | undefined } };
		fetch: {
			returnType:
				| LogicException
				| SQLException
				| [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]];
			get: {
				params: Partial<
					{ [key in keyof CustomTypes["SqlModelTypes"]["columns"]]: string | number | null } | number
				>;
			};
			filter: {
				params: Partial<
					{ [key in keyof CustomTypes["SqlModelTypes"]["columns"]]: string | number | null } | string
				>;
			};
			mixed: {
				params: Partial<
					{ [key in keyof CustomTypes["SqlModelTypes"]["columns"]]: string | number | null } | string | number
				>;
			};
			query: {
				rows: (
					| RowDataPacket[]
					| RowDataPacket[][]
					| OkPacket
					| OkPacket[]
					| (ResultSetHeader & { reverse_table_name?: string })
				) & { reverse_table_name?: string };
			};
		};
		create: mysql.RowDataPacket[] | mysql.OkPacket | mysql.ResultSetHeader;
		update: mysql.RowDataPacket[] | mysql.OkPacket | mysql.ResultSetHeader;
	};

	SqlModelTypes: {
		reverseReferences: {
			[key: string]: {
				name: string;
				table: string;
				class: (new (...args: any[]) => any) | object;
				column: string;
				settings?: {
					whereColumn: string;
					whereTable: string;
				};
			};
		};
		primaryKey: string;
		table: string;
		canCreate: boolean;
		canDelete: boolean;
		canUpdate: boolean;
		columns: {
			[key: string]: {
				label: string;
				required?: boolean;
				type?: // Numeric Types
				| "TINYINT"
					| "SMALLINT"
					| "MEDIUMINT"
					| "INT"
					| "INTEGER"
					| "BIGINT"
					| "FLOAT"
					| "DOUBLE"
					| "NUMERIC"
					| "DECIMAL"
					// Date and Time Types
					| "DATE"
					| "TIME"
					| "DATETIME"
					| "TIMESTAMP"
					| "YEAR"
					// String Types
					| "CHAR"
					| "VARCHAR"
					| "TINYTEXT"
					| "TEXT"
					| "MEDIUMTEXT"
					| "LONGTEXT"
					// Binary Data Types
					| "BINARY"
					| "VARBINARY"
					| "TINYBLOB"
					| "BLOB"
					| "MEDIUMBLOB"
					| "LONGBLOB"
					// JSON Data Type
					| "JSON"
					// Spatial Data Types
					| "GEOMETRY"
					| "POINT"
					| "LINESTRING"
					| "POLYGON"
					// Boolean Types
					| "BOOLEAN"
					| "BOOL"
					// Special Types
					| "ENUM"
					| "SET"
					| "BIT"
					| "AUTO_INCREMENT"
					| "SERIAL"; //? A shorthand for BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE
				references?: {
					name: string;
					table: string;
					class: (new (...args: any[]) => any) | object;
					column: string;
				};
			};
		};
		genericReferences: object;
	};
}

export interface SequelizeStoreConstructor extends expressSession.Store {
	new (options: { db: Sequelize; tableName?: string }): expressSession.Store;
}
