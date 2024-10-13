"use strict";

import mysql2, { ConnectionOptions, FieldPacket } from "mysql2";
import mysql, { PoolConnection, RowDataPacket, OkPacket, ResultSetHeader } from "mysql2/promise";
import * as config from "../config";
import ExpressSequelizeSession from "../framework/ExpressSequelizeSession";
import { Singleton } from "../Singleton/Singleton";
import { Sequelize } from "sequelize";
import readline from "readline";
import session from "express-session";

/**
 * @class Database
 * @description Class Db is used to prepare a suitable environment to execute queries
 * @author Abdullah Khdir <abdullahkhder77@gmail.com>
 */
export = class Database extends ExpressSequelizeSession {
	private mysql2: typeof mysql;
	private static instance: Database;
	protected readonly _;
	private mysqlStore!: session.Store;
	protected readonly constants;
	private static instanceCount = 0; // Static counter to track instances
	private poolObject: mysql.Pool;
	protected connection!: PoolConnection;

	private constructor() {
		super();
		this.constants = Singleton.getConstants();
		this._ = Singleton.getLodash();
		this.mysql2 = mysql;
		this.poolObject = this.mysql2.createPool(
			this._.pickBy({
				host: config.configurations().host,
				port: config.configurations().port,
				user: config.configurations().user,
				password: config.configurations().password,
				database: config.configurations().database,
				connectionLimit: config.configurations().connectionLimit,
				socketPath: config.configurations().os !== "WINDOWS" ? "/tmp/mysql.sock" : ""
			}) as ConnectionOptions
		);
		Database.instanceCount++; // Increment the count when an instance is created
	}

	/**
	 * @description initilizes and returns connection object
	 * @return {Promise<PoolConnection>}
	 */
	get pool(): mysql.Pool {
		return this.poolObject;
	}

	/**
	 * @description Returns an instance of the initiated database object
	 * @return {typeof mysql2}
	 */
	get getMysqlInstance(): typeof mysql {
		return this.mysql2;
	}

	/**
	 * @function getInstanceCount
	 * @description Returns how many instances are currently initiated.
	 * @returns {number}
	 */
	static getInstanceCount(): number {
		return Database.instanceCount;
	}

	/**
	 * @function getDbInstance
	 * @description Inits or returns the Db instance
	 * @returns {Database}
	 */
	static getDbInstance(): Database {
		if (this.instance) {
			return this.instance;
		}

		return (this.instance = new Database());
	}

	/**
	 * @function getMysqlStore
	 * @description Returns MySQL store for session management
	 * @returns {session.Store}
	 */
	get getMysqlStore(): session.Store {
		return this.mysqlStore;
	}

	/**
	 * @function establishConnectionWithoutDb
	 * @description Establishes a connection without selecting any specific database, allowing us to check if the database exists first.
	 * @returns {mysql.Pool}
	 */
	private establishConnectionWithoutDb(): mysql.Pool {
		const pool = this.mysql2.createPool(
			this._.pickBy({
				host: config.configurations().host,
				port: config.configurations().port,
				user: config.configurations().user,
				password: config.configurations().password,
				connectionLimit: config.configurations().connectionLimit,
				socketPath: config.configurations().os !== "WINDOWS" ? "/tmp/mysql.sock" : ""
			}) as ConnectionOptions
		);

		return pool;
	}

	/**
	 * @function initiateSession
	 * @description Initiates the database store object for caching sessions
	 * @returns {session.Store}
	 */
	initiateSession(): session.Store {
		this.mysqlStore = new this.mysqlSession({
			db: new Sequelize(
				config.configurations().database!,
				config.configurations().user!,
				config.configurations().password!,
				{
					host: config.configurations().host,
					dialect: config.configurations().dialect,
					logging: config.configurations().logging,
					dialectModule: mysql2 // For Sequelize
				}
			),
			...{
				clearExpired: Singleton.getConstants().SESSION.DB_CONNECTION_SESSION_CLEAR_EXPIRED,
				checkExpirationInterval: Singleton.getConstants().SESSION.DB_CONNECTION_SESSION_EXPIRATION_INTERVAL,
				expiration: Singleton.getConstants().SESSION.DB_CONNECTION_SESSION_TIME_OUT,
				createDatabaseTable: Singleton.getConstants().SESSION.DB_CONNECTION_CREATE_SESSION_TABLE_IF_NOT_EXISTS,
				connectionLimit: Singleton.getConstants().SESSION.DB_SESSION_MAX_CONNECTIONS,
				endConnectionOnClose: Singleton.getConstants().SESSION.DB_SESSION_END_CONNECTION_ON_CLOSE,
				charset: Singleton.getConstants().SESSION.DB_CONNECTION_SESSION_CHARSET,
				schema: {
					tableName: Singleton.getConstants().SESSION.DB_SESSION_TABLE,
					columnNames: {
						session_id: Singleton.getConstants().SESSION.DB_CONNECTION_SESSION_ID,
						expires: Singleton.getConstants().SESSION.DB_CONNECTION_SESSION_EXPIRATION,
						data: Singleton.getConstants().SESSION.DB_CONNECTION_SESSION_DATA
					}
				}
			}
		});
		(this.mysqlStore as any).sync();
		return this.mysqlStore;
	}

	/**
	 * @async
	 * @function query
	 * @description Executes an SQL query with parameters
	 * @param {string} sql - SQL query string
	 * @param {any[]} arr - Array of parameters
	 * @returns {Promise<[T, FieldPacket[]]>}
	 */
	async query(sql: string, arr: any = []): Promise<[RowDataPacket[] | OkPacket | ResultSetHeader, FieldPacket[]]> {
		//? Execute the query
		const connection = await this.pool.getConnection();
		try {
			const [result, fields] = await connection.query(sql, arr);

			if (this._.isArray(result) && this._.isArray(result[0])) {
				//? Return the first result set if it's a multi-result query
				return [result[0], fields];
			} else {
				return [result as RowDataPacket[] | OkPacket | ResultSetHeader, fields];
			}
		} catch (error) {
			throw SQLException(`SQLException: ${error}`);
		} finally {
			connection.release();
		}
	}

	/**
	 * @async
	 * @function readMigrations
	 * @description Reads all generated migrations and writes them to the database
	 * @returns {Promise<any>}
	 */
	async readMigrations(): Promise<any> {
		let path = Singleton.getPath();
		let fileSystem = Singleton.getFileSystem();
		let directoryRoutes = path.join(__dirname, "..", "..", "..", "dist", "core", "database", "migrations", "sql");

		const dbName = config.configurations().database;
		const migrationTable = config.configurations().migration;

		const sqlCheckDatabase = `SHOW DATABASES LIKE '${dbName}';`;
		const createDatabaseSql = `CREATE DATABASE IF NOT EXISTS ${dbName};`;
		const checkMigrationsTableSql = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${migrationTable}' AND TABLE_SCHEMA = '${dbName}';`;

		const colorLog = (colorCode: number, message: string) => {
			console.log(`\u001b[${colorCode}m${message}\u001b[0m`);
		};

		const handleError = (message: string, error: any) => {
			colorLog(31, `${message}`);
			colorLog(31, `Error: ${error}`);
			process.exit(1); // Exit with an error code
		};

		//? Prompt the user to create the database
		const promptUserForDatabaseCreation = async (connection: PoolConnection): Promise<void> => {
			const promptUser = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			});

			const question = `\u001b[33mWould you like to create the database "${dbName}"? (Y / N)  \u001b[0m`;
			return new Promise<void>((resolve, reject) => {
				promptUser.question(question, async (answer: string) => {
					if (this._.includes(["Y", "y"], answer.trim())) {
						colorLog(21, `Creating database "${dbName}", please wait!`);
						try {
							await connection.query(createDatabaseSql);
							colorLog(92, `Database "${dbName}" successfully created!`);
							promptUser.close();
							resolve();
						} catch (error) {
							handleError(`Database "${dbName}" could not be created!`, error);
							promptUser.close();
							reject(error);
						}
					} else {
						promptUser.close();
						resolve();
					}
				});
			});
		};

		const processMigrations = async (connection: PoolConnection, directory: string, fs: any) => {
			const files = fs.readdirSync(directory, { withFileTypes: true });
			for (const file of files) {
				if (file.isFile()) {
					const migrationName = file.name.replace(".sql", "");
					const sqlMigrationPath = path.join(directory, file.name);
					const sqlContent = fs.readFileSync(sqlMigrationPath).toString();

					try {
						const [rows] = await connection.query<RowDataPacket[]>(
							`SELECT migrations_file_name FROM ${dbName}.${migrationTable} WHERE migrations_file_name=? LIMIT 1;`,
							[migrationName]
						);

						if (this._.isEmpty(rows)) {
							await connection.query(sqlContent);
							const insertMigrationSql = `
								INSERT INTO ${dbName}.${migrationTable} 
								(migrations_file_name, migrations_sql) 
								VALUES (?, ?);
							`;
							await connection.query(insertMigrationSql, [migrationName, sqlContent]);
							colorLog(92, `SQL-File ${file.name} successfully written to the database`);
							colorLog(93, `✔✔ Migration: "${file.name}" read successfully`);
						} else {
							colorLog(95, `×× Migration file: ${file.name} already inserted ××`);
						}
					} catch (error) {
						handleError(`Error processing migration: ${migrationName}`, error);
					}
				}
			}
		};

		try {
			//? Step 1: Establish connection to the server (without selecting a database)
			const pool = this.establishConnectionWithoutDb();
			const connection: PoolConnection = await pool.getConnection();

			try {
				//? Step 2: Check if the database exists
				const [rows] = await connection.query<RowDataPacket[]>(sqlCheckDatabase);
				if (this._.isEmpty(rows)) {
					colorLog(31, `Database: "${dbName}" does not exist!`);
					await promptUserForDatabaseCreation(connection);
				}

				//? Step 3: Reconnect to the specific database after it's created
				const dbPool = this.pool; // Establish connection with the specific DB
				const dbConnection: PoolConnection = await dbPool.getConnection();

				try {
					//? Step 4: Check if the migration table exists
					const [migrationRows] = await dbConnection.query<RowDataPacket[]>(checkMigrationsTableSql);
					if (this._.isEmpty(migrationRows)) {
						colorLog(31, `Table Migration: "${migrationTable}" does not exist!`);
						const createMigrationTable = `
							CREATE TABLE IF NOT EXISTS ${dbName}.${migrationTable} (
								id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
								migrations_file_name VARCHAR(255) NOT NULL,
								migrations_sql LONGTEXT NOT NULL,
								created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
							) ENGINE=InnoDB DEFAULT CHARSET=utf8;
						`;
						await dbConnection.query(createMigrationTable);
						colorLog(92, `Table "${migrationTable}" successfully created!`);
					} else {
						colorLog(94, `Table Migration: "${migrationTable}" already exists.`);
					}

					//? Step 5: Process the migration files
					await processMigrations(dbConnection, directoryRoutes, fileSystem);
				} finally {
					dbConnection.release();
				}
			} finally {
				connection.release();
			}

			//? Step 6: Exit the process after successful migration
			colorLog(92, "✔✔ All migrations processed successfully!");
			process.exit(0); //? Successful exit
		} catch (error) {
			handleError(`Error while executing migration process`, error);
		}
	}
};
