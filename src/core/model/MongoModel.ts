"use strict";

import LogicException from "../exception/types/LogicException";
import { Singleton } from "../Singleton/Singleton";
import {
	DeleteOptions,
	UpdateOptions,
	FindOptions,
	CountDocumentsOptions,
	Filter,
	DistinctOptions,
	AggregationCursor,
	ChangeStream,
	ChangeStreamDocument,
	ChangeStreamOptions,
	BulkWriteOptions,
	AnyBulkWriteOperation,
	InsertOneOptions,
	InsertManyResult,
	BulkWriteResult,
	DeleteResult,
	InsertOneResult,
	UpdateResult,
	ReplaceOptions,
	Int32,
	Double,
	Binary,
	ObjectId,
	MinKey,
	BSONSymbol,
	Code,
	Timestamp,
	Decimal128,
	UUID,
	BSONRegExp,
	FindOneAndUpdateOptions,
	FindOneAndReplaceOptions,
	FindOneAndDeleteOptions,
	MongoClient,
	Db,
	WithId,
	Document,
	Collection,
	CreateCollectionOptions,
	DbOptions,
	AggregateOptions,
	DropDatabaseOptions,
	WithoutId,
	OptionalId,
	RenameOptions,
	RunCommandOptions,
	ClientSession,
	DropCollectionOptions,
	ListSearchIndexesOptions,
	ListIndexesOptions,
	ListCollectionsOptions,
	DbStatsOptions
} from "mongodb";
import MongoException from "../exception/types/MongoException";
import {
	MongoTypeIdAutoIncrement,
	MongoTypeIdBinary,
	MongoTypeIdUUID
} from "./interfaces/mongoDb/column_types/MongoTypes";
import { getClass } from "../utils/helperFunctions";
import * as config from "../config";
import Redis from "../redis/Redis";

/**
 * @class MongoModel
 * @constructor
 * @description Class MongoModel is used to prepare suitable environment to build queries for the models
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
abstract class MongoModel {
	/**
	 * @description Determines whether INSERT can be executed
	 * @var {boolean} canCreate
	 */
	protected abstract canCreate: boolean;

	/**
	 * determines whether UPDATE can be executed
	 * @var {boolean} canUpdate
	 */
	protected abstract canUpdate: boolean;

	/**
	 * determines whether DELETE can be executed
	 * @var {boolean} canDelete
	 */
	protected abstract canDelete: boolean;

	/**
	 * @description Primary key of the collection
	 * Binary format
	 * random UUID in RFC 4122 v4 format
	 * auto increment number
	 * @var {object} primaryKey
	 */
	protected abstract primaryKey: { _id: MongoTypeIdUUID | MongoTypeIdBinary | MongoTypeIdAutoIncrement };

	/**
	 * @description collection property
	 * @var {string} collection
	 */
	protected abstract collection: string;

	/**
	 * @description collection columns properties
	 * @var {object} columns
	 */
	public abstract modelColumns: {
		[key: string]:
			| string
			| Int32
			| Double
			| boolean
			| null
			| Array<any>
			| Object
			| undefined
			| Date
			| Binary
			| ObjectId
			| undefined
			| MinKey
			| BSONSymbol
			| BSONRegExp
			| Code
			| Timestamp
			| UUID
			| Decimal128;
	};
	protected abstract columns(): {
		[key: string]:
			| string
			| Int32
			| Double
			| boolean
			| null
			| Array<any>
			| Object
			| undefined
			| Date
			| Binary
			| ObjectId
			| undefined
			| MinKey
			| BSONSymbol
			| BSONRegExp
			| Code
			| Timestamp
			| UUID
			| Decimal128;
	};

	/**
	 * @description Flag to track if initializeModel() was called
	 * @var {boolean} isInitialized
	 */
	protected isInitialized: boolean = false;
	protected _columnsValidationExcuted: boolean = false;
	protected model: string;
	protected db!: Db;
	protected constants;
	protected _: typeof import("lodash");
	protected connection!: { client: MongoClient; mongoDb: Db; isFromSession: boolean };
	protected redis: Redis;

	constructor() {
		this.model = getClass(this);
		this.constants = Singleton.getConstants();
		this._ = Singleton.getLodash();
		this.redis = Singleton.getRedisInstance();
		setTimeout(() => {
			if (!this.isInitialized) {
				throw new MongoException(`initializeModel() was not called in the derived class (${this.model}).`);
			}
		}, 0);
	}

	/**
	 * @function initializeModel
	 * @description Initializes the model required functionalities and set a flag to true
	 * @returns {Promise<void>}
	 */
	public initializeModel(): void {
		this.modelColumns = this.columns();
		this.isInitialized = true;
	}

	/**
	 * @function handleException
	 * @description Handles SQL exceptions by rejecting with an error message.
	 * @param {new (message: string) => MongoException | LogicException} type - The type of the error
	 * @param {string} message - The error message.
	 * @param {unknown} error - Optional additional error details.
	 * @returns {Promise<never>}
	 */
	protected async handleException(
		type: new (message: string) => MongoException | LogicException,
		message: string,
		error?: unknown
	): Promise<never> {
		return Promise.reject(new type(`${message} \n ${error || ""}`));
	}

	/**
	 * @async
	 * @function validateColumns
	 * @description Validates the columns of the model with the corresponding collection
	 * @returns {Promise<MongoException | boolean>}
	 */
	protected async validateColumns(): Promise<MongoException | void> {
		if (this._columnsValidationExcuted) {
			return;
		}
		this._columnsValidationExcuted = true;
		const validationSchema = await this.createValidatedCollection(
			this.collection,
			{},
			config.configurations().mongoDbName,
			{},
			{},
			"rootUser"
		);

		let collectionColumns: string[] = [];

		if (!this._.isEmpty(validationSchema)) {
			collectionColumns = await this.getCollectionFieldNames(
				this.collection,
				{},
				config.configurations().mongoDbName,
				{},
				"rootUser"
			);
			if (this._.isEmpty(collectionColumns)) {
				return await this.handleException(
					MongoException,
					`Could not retrieve column name of the collection ${this.collection} of the database ${this.db.databaseName}`
				);
			}
		}

		let modelColumnsKeys = Object.keys(this.modelColumns);
		modelColumnsKeys = modelColumnsKeys.filter((key) => key !== "_id");
		collectionColumns = collectionColumns.filter((key) => key !== "_id");
		const missingColumns = modelColumnsKeys.filter((key) => !collectionColumns.includes(key));

		if (missingColumns.length) {
			return await this.handleException(
				MongoException,
				`The following column(s) "${missingColumns.join(", ")}" from "${
					this.model
				}" do(es) not exist in the collection "${this.collection}"`
			);
		}

		return;
	}

	/**
	 * @async
	 * @function escapeDatabaseName
	 * @description Return the collection name with the database prefix
	 * @param {string} collection - name of the collection
	 * @returns {Promise<string>}
	 */
	protected async escapeDatabaseName(collection: string = this.collection): Promise<string> {
		if (this._.isEmpty(collection)) {
			return "";
		}

		return this._.replace(collection, /^.*\./, "");
	}

	/**
	 * @function deepCamelCaseKeys
	 * @description Return object's indexes of an array or object's indexes as camelCased
	 * @param {object | Array<any>} object - the object or array to adjust
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
	 * @async
	 * @function validateMongoTypes
	 * @description Return object's indexes of an array or object's indexes as camelCased
	 * @param {any} filter
	 * @param {boolean} isFilter
	 * @throws {MongoException}
	 * @returns {Promise<void>}
	 */
	protected async validateMongoTypes(filter: any, isFilter: boolean = false): Promise<void> {
		const validateBSONType = async (
			value: any,
			expectedType:
				| string
				| Int32
				| Double
				| Boolean
				| null
				| Array<any>
				| Object
				| undefined
				| Date
				| Binary
				| ObjectId
				| MinKey
				| BSONSymbol
				| BSONRegExp
				| Code
				| Timestamp
				| UUID
				| Decimal128,
			key: string,
			isFilter: boolean
		) => {
			if (isFilter && typeof value === "object" && !Array.isArray(value) && value !== null) {
				return; // Skip validation for complex operators like $in, $or, etc.
			}

			if (expectedType === null && value !== null) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected null but ${value} given`
				);
			}
			if (expectedType === undefined && value !== undefined) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected undefined but ${value} given`
				);
			}
			if (expectedType === Array && !Array.isArray(value)) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected Array but ${value} given`
				);
			}
			if (expectedType === Boolean && typeof value !== "boolean") {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected Boolean but ${value} given`
				);
			}
			if (expectedType === String && typeof value !== "string") {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected String but ${value} given`
				);
			}
			if (expectedType === Date && !(value instanceof Date)) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected Date but ${value} given`
				);
			}
			if (expectedType === Binary && !(value instanceof Binary)) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected Binary but ${value} given`
				);
			}
			if (expectedType === ObjectId && !(value instanceof ObjectId)) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected ObjectId but ${value} given`
				);
			}
			if (expectedType === Decimal128 && !(value instanceof Decimal128)) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected Decimal128 but ${value} given`
				);
			}
			if (expectedType === Int32 && !(value instanceof Int32)) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected Int32 but ${value} given`
				);
			}
			if (expectedType === Double && !(value instanceof Double)) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected Double but ${value} given`
				);
			}
			if (expectedType === MinKey && !(value instanceof MinKey)) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected MinKey but ${value} given`
				);
			}
			if (expectedType === BSONSymbol && !(value instanceof BSONSymbol)) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected BSONSymbol but ${value} given`
				);
			}
			if (expectedType === BSONRegExp && !(value instanceof BSONRegExp || value instanceof RegExp)) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected BSONRegExp but ${value} given`
				);
			}
			if (expectedType === Code && !(value instanceof Code)) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected Code but ${value} given`
				);
			}
			if (expectedType === Timestamp && !(value instanceof Timestamp)) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected Timestamp but ${value} given`
				);
			}
			if (expectedType === UUID && !(value instanceof UUID)) {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected UUID but ${value} given`
				);
			}
			if (expectedType === Object && typeof value !== "object") {
				return await this.handleException(
					MongoException,
					`Invalid type for ${key}, expected Object but ${value} given`
				);
			}
		};

		for (const key of Object.keys(filter)) {
			await validateBSONType(filter[key], this.modelColumns[key], key, isFilter);
		}

		return;
	}

	/**
	 * @async
	 * @function getConnection
	 * @description Gets a connection from mongo database
	 * @param {keyof {
	 *    __systemUser: string;
	 *    internalUser: string;
	 *    rootUser: string;
	 *    readAnyDatabaseUser: string;
	 *    readWriteAnyDatabaseUser: string;
	 *    userAdminAnyDatabaseUser: string;
	 *    dbAdminAnyDatabaseUser: string;
	 *    readUser: string;
	 *    readWriteUser: string;
	 *    dbAdminUser: string;
	 *    userAdminUser: string;
	 *    dbOwnerUser: string;
	 *    enableShardingUser: string;
	 *    clusterAdminUser: string;
	 *    clusterManagerUser: string;
	 *    clusterMonitorUser: string;
	 *    hostManagerUser: string;
	 *    backupUser: string;
	 *    restoreUser: string;
	 * }} userRole - user role to get the connection for
	 * @param {string} dbName - placeholder for db name
	 * @param {DbOptions} dbConnectionOptions - placeholder for db connection options
	 * @param {MongoClient | undefined} client - placeholder for client
	 * @throws {MongoException}
	 * @returns {Promise<void>}
	 */
	async getConnection(
		userRole: keyof {
			__systemUser: string;
			internalUser: string;
			rootUser: string;
			readAnyDatabaseUser: string;
			readWriteAnyDatabaseUser: string;
			userAdminAnyDatabaseUser: string;
			dbAdminAnyDatabaseUser: string;
			readUser: string;
			readWriteUser: string;
			dbAdminUser: string;
			userAdminUser: string;
			dbOwnerUser: string;
			enableShardingUser: string;
			clusterAdminUser: string;
			clusterManagerUser: string;
			clusterMonitorUser: string;
			hostManagerUser: string;
			backupUser: string;
			restoreUser: string;
		},
		dbName: string = config.configurations().mongoDbName,
		dbConnectionOptions: DbOptions = {},
		client: MongoClient | undefined = undefined,
		serverApi: { version: string; strict: boolean; deprecationErrors: boolean } | {} = {
			version: "1",
			strict: true,
			deprecationErrors: true
		}
	): Promise<{ client: MongoClient; mongoDb: Db; isFromSession: boolean }> {
		if (!this._columnsValidationExcuted) {
			//? the function is implemented here due to initializeModel function as synchronous function
			//* before initating a connection to mongoDB the model columns will be checked
			await this.validateColumns();
		}

		let isFromSession = false;
		let createClient = undefined;
		try {
			const mongoDb = Singleton.getMongoDbInstance(userRole, dbName, serverApi);

			if (client) {
				createClient = client;
				isFromSession = true;
			} else {
				createClient = await mongoDb.pool();
			}

			await mongoDb.connect(createClient);

			if (!this.db || this.db.databaseName !== dbName || dbName !== config.configurations().mongoDbName) {
				this.db = createClient.db(dbName, dbConnectionOptions);
			}

			this.connection = { client: createClient, mongoDb: this.db, isFromSession: isFromSession };
			return this.connection;
		} catch (error) {
			return await this.handleException(MongoException, `Failed to get MongoDB connection: ${error}`);
		}
	}

	//*****************************************************************************\\
	//*******************************READ-OPERATIONS*******************************\\
	/**
	 * @function describeCollection
	 * @description Describes a Collection in the database
	 * @param {string} collection - Collection name
	 * @param {string} dbName - Database name
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {keyof {
	 *    __systemUser: string;
	 *    internalUser: string;
	 *    rootUser: string;
	 *    readAnyDatabaseUser: string;
	 *    readWriteAnyDatabaseUser: string;
	 *    userAdminAnyDatabaseUser: string;
	 *    dbAdminAnyDatabaseUser: string;
	 *    readUser: string;
	 *    readWriteUser: string;
	 *    dbAdminUser: string;
	 *    userAdminUser: string;
	 *    dbOwnerUser: string;
	 *    enableShardingUser: string;
	 *    clusterAdminUser: string;
	 *    clusterManagerUser: string;
	 *    clusterMonitorUser: string;
	 *    hostManagerUser: string;
	 *    backupUser: string;
	 *    restoreUser: string;
	 * }} userRole - user role to get the connection for - default is readWriteAnyDatabaseUser
	 * @returns {Promise<Document>}
	 */
	async describeCollection(
		collection: string = this.collection,
		options: RunCommandOptions = {},
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		userRole: keyof {
			__systemUser: string;
			internalUser: string;
			rootUser: string;
			readAnyDatabaseUser: string;
			readWriteAnyDatabaseUser: string;
			userAdminAnyDatabaseUser: string;
			dbAdminAnyDatabaseUser: string;
			readUser: string;
			readWriteUser: string;
			dbAdminUser: string;
			userAdminUser: string;
			dbOwnerUser: string;
			enableShardingUser: string;
			clusterAdminUser: string;
			clusterManagerUser: string;
			clusterMonitorUser: string;
			hostManagerUser: string;
			backupUser: string;
			restoreUser: string;
		} = "readWriteAnyDatabaseUser"
	): Promise<Document> {
		if (!collection) {
			return await this.handleException(
				MongoException,
				`Collection name is required to describe the collection.`
			);
		}

		try {
			const cacheKey = `mongo:describeCollection:${collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const command = { collStats: collection };
			const result = await this.runCommand(command, options, clientOptions, dbName, dbOptions, userRole);

			if (result) {
				await this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry);
			}

			return result;
		} catch (error) {
			return await this.handleException(MongoException, `Error describing collection '${collection}': ${error}`);
		} finally {
			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function stats
	 * @description Get all the db statistics.
	 * @param {DbStatsOptions} options - placeholder for stats options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} dbName - placeholder for mongo database name
	 * @param {DbOptions} dbOptions - placeholder for mongo database option
	 * @throws {MongoException}
	 * @returns {Promise<Document>}
	 */
	async stats(
		options: DbStatsOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<Document> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const cacheKey = `mongo:stats:${this.collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const statsOptions = {
				...options,
				session: clientOptions?.session
			} as DbStatsOptions;
			const result = await mongoDb.stats(statsOptions);

			if (result) {
				await this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry);
			}

			return result;
		} catch (error) {
			return await this.handleException(
				MongoException,
				`Could not get the stats for the db ${dbName}! \n Error: ${error}`
			);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function getCollectionNames
	 * @description List all collections of this database with optional filter.
	 * @param {Document} filter - placeholder for filtering collections
	 * @param {ListCollectionsOptions} options - placeholder for list collections option
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - placeholder for client options
	 * @param {string} dbName - placeholder for mongo database name
	 * @param {DbOptions} dbOptions - placeholder for mongo database options
	 * @throws {MongoException}
	 * @returns {Promise<string[]>}
	 */
	async getCollectionNames(
		filter?: Document,
		options: ListCollectionsOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<string[]> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const cacheKey = `mongo:getCollectionNames:${this.collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const getCollectionNamesOptions = {
				...options,
				session: clientOptions?.session
			} as ListCollectionsOptions;
			const collections = (await mongoDb.listCollections(filter, getCollectionNamesOptions).toArray()) ?? [];
			const collectionNames = collections.map((collection) => collection.name);

			if (collectionNames) {
				await this.redis.cacheResult(cacheKey, collectionNames, config.configurations().redisCacheExpiry);
			}

			return collectionNames;
		} catch (error) {
			return await this.handleException(MongoException, `Error retrieving collection names! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function countDocuments
	 * @description Gets the number of documents matching the filter. For a fast count of the total documents in a collection see Collection#estimatedDocumentCount estimatedDocumentCount. Note: When migrating from Collection#count count to Collection#countDocuments countDocuments the following query operators must be replaced:
	 * | Operator | Replacement |
	 * | -------- | ----------- |
	 * | `$where` | [`$expr`][1] |
	 * | `$near`  | [`$geoWithin`][2] with [`$center`][3] |
	 * | `$nearSphere` | [`$geoWithin`][2] with [`$centerSphere`][4] |
	 * @param {Partial<this["modelColumns"]>} query - placeholder for mongoDB query
	 * @param {CountDocumentsOptions} options - placeholder for query options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined } clientOptions - placeholder for client options
	 * @param {string} collection - placeholder for collection name
	 * @param {string} dbName - placeholder for mongo database name
	 * @param {DbOptions} connectionOptions - placeholder for connection options
	 * @throws {MongoException}
	 * @returns {Promise<number>}
	 */
	async countDocuments(
		query?: Partial<this["modelColumns"]>,
		options: CountDocumentsOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		connectionOptions: DbOptions = {}
	): Promise<number> {
		await this.validateMongoTypes(query, true);

		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readUser",
			dbName,
			connectionOptions,
			clientOptions?.clientFromSession
		);

		try {
			const cacheKey = `mongo:countDocuments:${collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const countDocumentsOptions = {
				...options,
				session: clientOptions?.session
			} as CountDocumentsOptions;
			const result = await mongoDb.collection(collection).countDocuments(query, countDocumentsOptions);

			if (result) {
				await this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry);
			}

			return result;
		} catch (error) {
			return await this.handleException(MongoException, `Error counting documents! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @description Get the list of all indexes information for the collection.
	 * @function listCollections
	 * @param {Document} filter - placeholder for filter
	 * @param {ListCollectionsOptions} options - placeholder for query options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - placeholder for client options
	 * @param {string} dbName - placeholder for mongo database name
	 * @param {DbOptions} dbOptions - placeholder for connection options
	 * @throws {MongoException}
	 * @returns {Promise<Document[]>}
	 */
	async listCollections(
		filter?: Document,
		options: ListCollectionsOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<Document[]> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const cacheKey = `mongo:listCollections:${this.collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const listCollectionsOptions = {
				...options,
				session: clientOptions?.session
			} as ListCollectionsOptions;

			const result = await mongoDb.listCollections(filter, listCollectionsOptions).toArray();

			if (result) {
				await this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry);
			}

			return result;
		} catch (error) {
			return await this.handleException(MongoException, `Could not list collections! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function listIndexes
	 * @description lists all indexes from mongo db
	 * @param {ListIndexesOptions} options - placeholder
	 * @param {string} collection - placeholder
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - placeholder
	 * @param {string} dbName - placeholder
	 * @param {DbOptions} dbOptions - placeholder
	 * @throws {MongoException}
	 * @returns {Promise<Document[]>}
	 */
	async listIndexes(
		options: ListIndexesOptions = {},
		collection: string = this.collection,
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<Document[]> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const cacheKey = `mongo:listIndexes:${collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const listIndexesOptions = {
				...options,
				session: clientOptions?.session
			} as ListIndexesOptions;
			const result = await mongoDb.collection(collection).listIndexes(listIndexesOptions).toArray();

			if (result) {
				await this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry);
			}

			return result;
		} catch (error) {
			return await this.handleException(MongoException, `Could not list indexes! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function listSearchIndexes
	 * @description Returns all search indexes for the current collection.
	 * @param {ListSearchIndexesOptions} options
	 * @param {string} collection
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<Document[]>}
	 */
	async listSearchIndexes(
		options: ListSearchIndexesOptions = {},
		collection: string = this.collection,
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<Document[]> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const cacheKey = `mongo:listSearchIndexes:${collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const listSearchIndexesOptions = {
				...options,
				session: clientOptions?.session
			} as ListSearchIndexesOptions;

			const result = await mongoDb.collection(collection).listSearchIndexes(listSearchIndexesOptions).toArray();

			if (result) {
				await this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry);
			}

			return result;
		} catch (error) {
			return await this.handleException(MongoException, `Could not list search indexes! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function dbAggregate
	 * @description Execute an aggregation framework pipeline against the database, needs MongoDB >= 3.6
	 * @param {Document[]} pipeline
	 * @param {AggregateOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<this["modelColumns"][]>}
	 */
	async dbAggregate(
		pipeline?: Document[],
		options: AggregateOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<this["modelColumns"][]> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const cacheKey = `mongo:dbAggregate:${this.collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const dbAggregateOptions = {
				...options,
				session: clientOptions?.session
			} as AggregateOptions;
			const cursor: AggregationCursor<this["modelColumns"]> = mongoDb.aggregate(pipeline, dbAggregateOptions);
			const results: this["modelColumns"][] = await cursor.toArray();

			if (results) {
				await this.redis.cacheResult(cacheKey, results, config.configurations().redisCacheExpiry);
			}

			return results;
		} catch (error) {
			return await this.handleException(MongoException, `Could not perform aggregation! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function aggregate
	 * @description Execute an aggregation framework pipeline against the collection, needs MongoDB >= 2.2
	 * @param {Document[]} pipeline
	 * @param {AggregateOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<this["modelColumns"][]>}
	 */
	async aggregate(
		pipeline?: Document[],
		options: AggregateOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<this["modelColumns"][]> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);
		try {
			const cacheKey = `mongo:aggregate:${collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const aggregateOptions = {
				...options,
				session: clientOptions?.session
			} as AggregateOptions;
			const cursor: AggregationCursor<this["modelColumns"]> = mongoDb
				.collection(collection)
				.aggregate(pipeline, aggregateOptions);
			const results: this["modelColumns"][] = await cursor.toArray();

			if (results) {
				await this.redis.cacheResult(cacheKey, results, config.configurations().redisCacheExpiry);
			}

			return results;
		} catch (error) {
			return await this.handleException(MongoException, `Error performing aggregation! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function findOne
	 * @description Fetches the first document that matches the filter
	 * @param {Partial<this["modelColumns"]>} criteria - placeholder
	 * @param {FindOptions} options - placeholder
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - placeholder
	 * @param {string} collection - placeholder
	 * @param {string} dbName - placeholder
	 * @param {DbOptions} dbOptions - placeholder
	 * @throws {MongoException}
	 * @returns {Promise<this["modelColumns"] | null>}
	 */
	async findOne(
		criteria: Partial<this["modelColumns"]>,
		options: FindOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<this["modelColumns"] | null> {
		await this.validateMongoTypes(criteria, true);
		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const cacheKey = `mongo:findOne:${collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const findOneOptions = {
				...options,
				session: clientOptions?.session
			} as FindOptions;

			const result = await mongoDb.collection(collection).findOne(criteria, findOneOptions);

			if (result) {
				await this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry);
			}

			return result;
		} catch (error) {
			return await this.handleException(MongoException, `Error finding document! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @description Creates a cursor for a filter that can be used to iterate over results from MongoDB
	 * @param {Partial<this["modelColumns"]>} criteria
	 * @param {FindOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<Filter<this["modelColumns"]>[]>}
	 */
	async find(
		criteria: Partial<this["modelColumns"]>,
		options: FindOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<Filter<this["modelColumns"]>[]> {
		await this.validateMongoTypes(criteria, true);

		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const cacheKey = `mongo:find:${collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const findOptions = {
				...options,
				session: clientOptions?.session
			} as FindOptions;

			const result = await mongoDb.collection(collection).find(criteria, findOptions).toArray();

			if (result) {
				await this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry);
			}

			return result;
		} catch (error) {
			return await this.handleException(MongoException, `Error finding documents! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function distinct
	 * @description The distinct command returns a list of distinct values for the given key across a collection.
	 * @param {K} key
	 * @param {Partial<this["modelColumns"]>} criteria
	 * @param {DistinctOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<void[]>}
	 */
	async distinct<K extends keyof this["modelColumns"]>(
		key: K,
		criteria: Partial<this["modelColumns"]>,
		options: DistinctOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<void[]> {
		await this.validateMongoTypes(criteria);

		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const cacheKey = `mongo:distinct:${collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const distinctOptions = {
				...options,
				session: clientOptions?.session
			} as DistinctOptions;

			const result = await mongoDb.collection(collection).distinct(key as string, criteria, distinctOptions);

			if (result) {
				await this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry);
			}

			return result;
		} catch (error) {
			return await this.handleException(MongoException, `Error retrieving distinct values! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function watch
	 * @description Create a new Change Stream, watching for new changes (insertions, updates, replacements, deletions, and invalidations) in this collection.
	 * @param {Document[]} pipeline
	 * @param {ChangeStreamOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @throws {MongoException}
	 * @param {DbOptions} dbOptions
	 * @returns {Promise<ChangeStream<ChangeStreamDocument<Partial<this["modelColumns"]>>>>}
	 */
	async watch(
		pipeline?: Document[],
		options: ChangeStreamOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<ChangeStream<ChangeStreamDocument<Partial<this["modelColumns"]>>>> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const watchOptions = {
				...options,
				session: clientOptions?.session
			} as ChangeStreamOptions;
			return mongoDb.collection(collection).watch(pipeline, watchOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Error opening change stream! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}
		}
	}

	/**
	 * @async
	 * @function getUsers
	 * @description gets all users from admin database
	 * @param {RunCommandOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @param {keyof {
	 *    __systemUser: string;
	 *    internalUser: string;
	 *    rootUser: string;
	 *    readAnyDatabaseUser: string;
	 *    readWriteAnyDatabaseUser: string;
	 *    userAdminAnyDatabaseUser: string;
	 *    dbAdminAnyDatabaseUser: string;
	 *    readUser: string;
	 *    readWriteUser: string;
	 *    dbAdminUser: string;
	 *    userAdminUser: string;
	 *    dbOwnerUser: string;
	 *    enableShardingUser: string;
	 *    clusterAdminUser: string;
	 *    clusterManagerUser: string;
	 *    clusterMonitorUser: string;
	 *    hostManagerUser: string;
	 *    backupUser: string;
	 *    restoreUser: string;
	 * }} userRole - user role to get the connection for - default is userAdminUser
	 * @throws {MongoException}
	 * @returns {Promise<Document>}
	 */
	async getUsers(
		options: RunCommandOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoAdminDb,
		dbOptions: DbOptions = {},
		userRole: keyof {
			__systemUser: string;
			internalUser: string;
			rootUser: string;
			readAnyDatabaseUser: string;
			readWriteAnyDatabaseUser: string;
			userAdminAnyDatabaseUser: string;
			dbAdminAnyDatabaseUser: string;
			readUser: string;
			readWriteUser: string;
			dbAdminUser: string;
			userAdminUser: string;
			dbOwnerUser: string;
			enableShardingUser: string;
			clusterAdminUser: string;
			clusterManagerUser: string;
			clusterMonitorUser: string;
			hostManagerUser: string;
			backupUser: string;
			restoreUser: string;
		} = "userAdminUser"
	): Promise<Document> {
		try {
			const cacheKey = `mongo:getUsers:${this.collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const result = await this.runCommand({ usersInfo: 1 }, options, clientOptions, dbName, dbOptions, userRole);

			if (result) {
				await this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry);
			}

			return result;
		} catch (error) {
			return await this.handleException(MongoException, `Could not create User! \n Error: ${error}`);
		} finally {
			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function getRoles
	 * @description Gets roles from admin database
	 * @param {RunCommandOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @param {keyof {
	 *    __systemUser: string;
	 *    internalUser: string;
	 *    rootUser: string;
	 *    readAnyDatabaseUser: string;
	 *    readWriteAnyDatabaseUser: string;
	 *    userAdminAnyDatabaseUser: string;
	 *    dbAdminAnyDatabaseUser: string;
	 *    readUser: string;
	 *    readWriteUser: string;
	 *    dbAdminUser: string;
	 *    userAdminUser: string;
	 *    dbOwnerUser: string;
	 *    enableShardingUser: string;
	 *    clusterAdminUser: string;
	 *    clusterManagerUser: string;
	 *    clusterMonitorUser: string;
	 *    hostManagerUser: string;
	 *    backupUser: string;
	 *    restoreUser: string;
	 * }} userRole - user role to get the connection for - default is userAdminUser
	 * @throws {MongoException}
	 * @returns {Promise<Document>}
	 */
	async getRoles(
		options: RunCommandOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoAdminDb,
		dbOptions: DbOptions = {},
		userRole: keyof {
			__systemUser: string;
			internalUser: string;
			rootUser: string;
			readAnyDatabaseUser: string;
			readWriteAnyDatabaseUser: string;
			userAdminAnyDatabaseUser: string;
			dbAdminAnyDatabaseUser: string;
			readUser: string;
			readWriteUser: string;
			dbAdminUser: string;
			userAdminUser: string;
			dbOwnerUser: string;
			enableShardingUser: string;
			clusterAdminUser: string;
			clusterManagerUser: string;
			clusterMonitorUser: string;
			hostManagerUser: string;
			backupUser: string;
			restoreUser: string;
		} = "userAdminUser"
	): Promise<Document> {
		try {
			const cacheKey = `mongo:getRoles:${this.collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const result = await this.runCommand({ rolesInfo: 1 }, options, clientOptions, dbName, dbOptions, userRole);

			if (result) {
				await this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry);
			}

			return result;
		} catch (error) {
			return await this.handleException(
				MongoException,
				`Error fetching roles for the database ${dbName}! \n Error: ${error}`
			);
		} finally {
			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function getSiblingDB
	 * @description Get a reference to another database in the same MongoDB instance.
	 * @param {string} siblingDbName - The name of the sibling database to connect to.
	 * @param {DbOptions} dbOptions - Optional database connection options.
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - Client session options.
	 * @param {string} currentDbName - The current database name, defaults to the application's database name.
	 * @param {keyof {
	 *    __systemUser: string;
	 *    internalUser: string;
	 *    rootUser: string;
	 *    readAnyDatabaseUser: string;
	 *    readWriteAnyDatabaseUser: string;
	 *    userAdminAnyDatabaseUser: string;
	 *    dbAdminAnyDatabaseUser: string;
	 *    readUser: string;
	 *    readWriteUser: string;
	 *    dbAdminUser: string;
	 *    userAdminUser: string;
	 *    dbOwnerUser: string;
	 *    enableShardingUser: string;
	 *    clusterAdminUser: string;
	 *    clusterManagerUser: string;
	 *    clusterMonitorUser: string;
	 *    hostManagerUser: string;
	 *    backupUser: string;
	 *    restoreUser: string;
	 * }} userRole - The user role to use for the operation. Defaults to 'dbAdminUser'.
	 * @throws {MongoException} - Throws an exception if the connection fails.
	 * @returns {Promise<Db>} - Returns a promise that resolves to the sibling database connection.
	 */
	async getSiblingDB(
		siblingDbName: string,
		dbOptions: DbOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		currentDbName: string = config.configurations().mongoDbName,
		userRole: keyof {
			__systemUser: string;
			internalUser: string;
			rootUser: string;
			readAnyDatabaseUser: string;
			readWriteAnyDatabaseUser: string;
			userAdminAnyDatabaseUser: string;
			dbAdminAnyDatabaseUser: string;
			readUser: string;
			readWriteUser: string;
			dbAdminUser: string;
			userAdminUser: string;
			dbOwnerUser: string;
			enableShardingUser: string;
			clusterAdminUser: string;
			clusterManagerUser: string;
			clusterMonitorUser: string;
			hostManagerUser: string;
			backupUser: string;
			restoreUser: string;
		} = "dbAdminUser"
	): Promise<Db> {
		const { client, isFromSession } = await this.getConnection(
			userRole,
			currentDbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const cacheKey = `mongo:getSiblingDB:${this.collection}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const result = client.db(siblingDbName, dbOptions);

			if (result) {
				await this.redis.cacheResult(cacheKey, result, config.configurations().redisCacheExpiry);
			}

			return result;
		} catch (error) {
			return await this.handleException(
				MongoException,
				`Could not get sibling DB: ${siblingDbName}! \n Error: ${error}`
			);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function currentOp
	 * @description Get a snapshot of the currently running operations on the MongoDB instance.
	 * @param {Document} commandOptions - Options to pass to the currentOp command (e.g., filtering on operations).
	 * @param {RunCommandOptions} options - Optional additional options for the runCommand method.
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - Client session options.
	 * @param {string} dbName - Name of the database to run the command against, defaults to 'admin'.
	 * @param {DbOptions} dbOptions - Optional database connection options.
	 * @param {keyof {
	 *    __systemUser: string;
	 *    internalUser: string;
	 *    rootUser: string;
	 *    readAnyDatabaseUser: string;
	 *    readWriteAnyDatabaseUser: string;
	 *    userAdminAnyDatabaseUser: string;
	 *    dbAdminAnyDatabaseUser: string;
	 *    readUser: string;
	 *    readWriteUser: string;
	 *    dbAdminUser: string;
	 *    userAdminUser: string;
	 *    dbOwnerUser: string;
	 *    enableShardingUser: string;
	 *    clusterAdminUser: string;
	 *    clusterManagerUser: string;
	 *    clusterMonitorUser: string;
	 *    hostManagerUser: string;
	 *    backupUser: string;
	 *    restoreUser: string;
	 * }} userRole - The user role to use for the operation. Defaults to 'clusterMonitorUser'.
	 * @throws {MongoException} - Throws an exception if the command fails.
	 * @returns {Promise<Document>} - Returns a promise that resolves to the current operations snapshot.
	 */
	async currentOp(
		commandOptions: Document = {},
		options: RunCommandOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoAdminDb,
		dbOptions: DbOptions = {},
		userRole: keyof {
			__systemUser: string;
			internalUser: string;
			rootUser: string;
			readAnyDatabaseUser: string;
			readWriteAnyDatabaseUser: string;
			userAdminAnyDatabaseUser: string;
			dbAdminAnyDatabaseUser: string;
			readUser: string;
			readWriteUser: string;
			dbAdminUser: string;
			userAdminUser: string;
			dbOwnerUser: string;
			enableShardingUser: string;
			clusterAdminUser: string;
			clusterManagerUser: string;
			clusterMonitorUser: string;
			hostManagerUser: string;
			backupUser: string;
			restoreUser: string;
		} = "clusterMonitorUser"
	): Promise<Document> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			userRole,
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const runCommandOptions = {
				...options,
				session: clientOptions?.session
			} as RunCommandOptions;

			const command = { currentOp: 1, ...commandOptions };
			return await mongoDb.command(command, runCommandOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Error running currentOp command! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}
		}
	}

	/**
	 * @async
	 * @function getCollectionFieldNames
	 * @description Get a snapshot of the currently running operations on the MongoDB instance.
	 * @param {string} collectionName - name of the collection
	 * @param {RunCommandOptions} options - Optional additional options for the runCommand method.
	 * @param {string} dbName - Name of the database to run the command against, defaults to 'admin'.
	 * @param {DbOptions} dbOptions - Optional database connection options.
	 * @param {keyof {
	 *    __systemUser: string;
	 *    internalUser: string;
	 *    rootUser: string;
	 *    readAnyDatabaseUser: string;
	 *    readWriteAnyDatabaseUser: string;
	 *    userAdminAnyDatabaseUser: string;
	 *    dbAdminAnyDatabaseUser: string;
	 *    readUser: string;
	 *    readWriteUser: string;
	 *    dbAdminUser: string;
	 *    userAdminUser: string;
	 *    dbOwnerUser: string;
	 *    enableShardingUser: string;
	 *    clusterAdminUser: string;
	 *    clusterManagerUser: string;
	 *    clusterMonitorUser: string;
	 *    hostManagerUser: string;
	 *    backupUser: string;
	 *    restoreUser: string;
	 * }} userRole - The user role to use for the operation. Defaults to 'rootUser'.
	 * @throws {MongoException} - Throws an exception if the command fails.
	 * @returns {Promise<Document>} - Returns an array of strings or an empty array of the fields names
	 */
	async getCollectionFieldNames(
		collectionName: string = this.collection,
		options: RunCommandOptions = {},
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {},
		userRole: keyof {
			__systemUser: string;
			internalUser: string;
			rootUser: string;
			readAnyDatabaseUser: string;
			readWriteAnyDatabaseUser: string;
			userAdminAnyDatabaseUser: string;
			dbAdminAnyDatabaseUser: string;
			readUser: string;
			readWriteUser: string;
			dbAdminUser: string;
			userAdminUser: string;
			dbOwnerUser: string;
			enableShardingUser: string;
			clusterAdminUser: string;
			clusterManagerUser: string;
			clusterMonitorUser: string;
			hostManagerUser: string;
			backupUser: string;
			restoreUser: string;
		} = "rootUser"
	): Promise<string[] | []> {
		const { client } = await this.getConnection(userRole, dbName, dbOptions, undefined, undefined);

		try {
			const cacheKey = `mongo:getCollectionFieldNames:${collectionName}`;
			const cachedResult = await this.redis.getCachedResult(cacheKey);

			if (cachedResult) {
				return cachedResult;
			}

			const collectionInfo = await this.runCommand(
				{ listCollections: 1, filter: { name: collectionName } },
				options,
				{ clientFromSession: client },
				dbName,
				dbOptions,
				userRole
			);

			if (collectionInfo?.["cursor"]?.firstBatch?.length) {
				const collectionDetails = collectionInfo["cursor"].firstBatch[0];
				const validator = collectionDetails?.options?.validator;

				if (validator) {
					const fieldNames = Object.keys(validator.properties || {});

					if (fieldNames) {
						await this.redis.cacheResult(cacheKey, fieldNames, config.configurations().redisCacheExpiry);
					}

					return fieldNames;
				} else {
					return [];
				}
			} else {
				return await this.handleException(MongoException, `Collection "${collectionName}" does not exist.`);
			}
		} catch (error) {
			return await this.handleException(MongoException, `Error retrieving collection field names: ${error}`);
		} finally {
			await this.redis.quit();
		}
	}

	//*****************************************************************************\\
	//******************************WRITE-OPERATIONS*******************************\\
	/**
	 * @async
	 * @function createValidatedCollection
	 * @description Creates a new collection with schema validation.
	 * @param {string} collectionName - Name of the collection.
	 * @param {CreateCollectionOptions} options - Additional create collection options.
	 * @param {keyof {
	 *    __systemUser: string;
	 *    internalUser: string;
	 *    rootUser: string;
	 *    readAnyDatabaseUser: string;
	 *    readWriteAnyDatabaseUser: string;
	 *    userAdminAnyDatabaseUser: string;
	 *    dbAdminAnyDatabaseUser: string;
	 *    readUser: string;
	 *    readWriteUser: string;
	 *    dbAdminUser: string;
	 *    userAdminUser: string;
	 *    dbOwnerUser: string;
	 *    enableShardingUser: string;
	 *    clusterAdminUser: string;
	 *    clusterManagerUser: string;
	 *    clusterMonitorUser: string;
	 *    hostManagerUser: string;
	 *    backupUser: string;
	 *    restoreUser: string;
	 * }} userRole - The user role to use for the operation. Defaults to 'rootUser'.
	 * @throws {MongoException}
	 * @returns {Promise<Collection<Document>>}
	 */
	async createValidatedCollection(
		collectionName: string = this.collection,
		options: CreateCollectionOptions = {},
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {},
		RunCommandOptions: RunCommandOptions = {},
		userRole: keyof {
			__systemUser: string;
			internalUser: string;
			rootUser: string;
			readAnyDatabaseUser: string;
			readWriteAnyDatabaseUser: string;
			userAdminAnyDatabaseUser: string;
			dbAdminAnyDatabaseUser: string;
			readUser: string;
			readWriteUser: string;
			dbAdminUser: string;
			userAdminUser: string;
			dbOwnerUser: string;
			enableShardingUser: string;
			clusterAdminUser: string;
			clusterManagerUser: string;
			clusterMonitorUser: string;
			hostManagerUser: string;
			backupUser: string;
			restoreUser: string;
		} = "rootUser"
	): Promise<Collection<Document>> {
		const { mongoDb, client } = await this.getConnection(
			userRole,
			config.configurations().mongoDbName,
			undefined,
			undefined
		);

		try {
			await this.redis.invalidateCacheForCollection("mongo", collectionName);

			const collectionInfo = await this.runCommand(
				{ listCollections: 1, filter: { name: collectionName } },
				RunCommandOptions,
				{ clientFromSession: client },
				dbName,
				dbOptions,
				userRole
			);

			const validationSchema: {
				bsonType: string;
				required: string[];
				properties: Record<string, { bsonType: string; description: string }>;
			} = {
				bsonType: "object",
				required: [...Object.keys(this.modelColumns)],
				properties: {}
			};

			if (collectionInfo?.["cursor"]?.firstBatch?.length) {
				const collectionDetails = collectionInfo["cursor"].firstBatch[0];

				if (collectionDetails.options?.validator) {
					return mongoDb.collection(collectionName);
				} else {
					for (const [columnName, columnType] of Object.entries(this.modelColumns)) {
						let bsonType = "string";
						let description = `Field ${columnName} is required`;

						if (columnType === String) bsonType = "string";
						else if (columnType === Int32) bsonType = "int";
						else if (columnType === Double) bsonType = "double";
						else if (columnType === Boolean) bsonType = "bool";
						else if (columnType === null) bsonType = "null";
						else if (Array.isArray(columnType)) bsonType = "array";
						else if (columnType === Object) bsonType = "object";
						else if (columnType === undefined) bsonType = "undefined";
						else if (columnType === Date) bsonType = "date";
						else if (columnType === Binary) bsonType = "binData";
						else if (columnType === ObjectId) bsonType = "objectId";
						else if (columnType === MinKey) bsonType = "minKey";
						else if (columnType === BSONSymbol) bsonType = "symbol";
						else if (columnType === BSONRegExp) bsonType = "regex";
						else if (columnType === Code) bsonType = "javascript";
						else if (columnType === Timestamp) bsonType = "timestamp";
						else if (columnType === Decimal128) bsonType = "decimal";
						else if (columnType === UUID) bsonType = "binData";

						validationSchema.properties[columnName] = {
							bsonType: bsonType,
							description: description
						};
					}

					await this.runCommand(
						{
							collMod: collectionName,
							validator: validationSchema
						},
						RunCommandOptions,
						{ clientFromSession: client },
						dbName,
						dbOptions,
						userRole
					);

					return mongoDb.collection(collectionName);
				}
			}

			for (const [columnName, columnType] of Object.entries(this.modelColumns)) {
				let bsonType = "string";
				let description = `Field ${columnName} is required`;

				if (columnType === String) bsonType = "string";
				else if (columnType === Int32) bsonType = "int";
				else if (columnType === Double) bsonType = "double";
				else if (columnType === Boolean) bsonType = "bool";
				else if (columnType === null) bsonType = "null";
				else if (Array.isArray(columnType)) bsonType = "array";
				else if (columnType === Object) bsonType = "object";
				else if (columnType === undefined) bsonType = "undefined";
				else if (columnType === Date) bsonType = "date";
				else if (columnType === Binary) bsonType = "binData";
				else if (columnType === ObjectId) bsonType = "objectId";
				else if (columnType === MinKey) bsonType = "minKey";
				else if (columnType === BSONSymbol) bsonType = "symbol";
				else if (columnType === BSONRegExp) bsonType = "regex";
				else if (columnType === Code) bsonType = "javascript";
				else if (columnType === Timestamp) bsonType = "timestamp";
				else if (columnType === Decimal128) bsonType = "decimal";
				else if (columnType === UUID) bsonType = "binData";

				validationSchema.properties[columnName] = {
					bsonType: bsonType,
					description: description
				};
			}

			const collectionOptions = {
				...options,
				validator: validationSchema
			} as CreateCollectionOptions;

			return await mongoDb.createCollection(collectionName, collectionOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Error creating validated collection: ${error}`);
		} finally {
			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function repairDatabase
	 * @description Repairs the specified database by using the MongoDB `repairDatabase` command.
	 * @param {RunCommandOptions} options - Optional additional options for the runCommand method.
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - Client session options.
	 * @param {string} dbName - Name of the database to repair, defaults to 'admin'.
	 * @param {DbOptions} dbOptions - Optional database connection options.
	 * @param {keyof {
	 *    __systemUser: string;
	 *    internalUser: string;
	 *    rootUser: string;
	 *    readAnyDatabaseUser: string;
	 *    readWriteAnyDatabaseUser: string;
	 *    userAdminAnyDatabaseUser: string;
	 *    dbAdminAnyDatabaseUser: string;
	 *    readUser: string;
	 *    readWriteUser: string;
	 *    dbAdminUser: string;
	 *    userAdminUser: string;
	 *    dbOwnerUser: string;
	 *    enableShardingUser: string;
	 *    clusterAdminUser: string;
	 *    clusterManagerUser: string;
	 *    clusterMonitorUser: string;
	 *    hostManagerUser: string;
	 *    backupUser: string;
	 *    restoreUser: string;
	 * }} userRole - The user role to use for the operation. Defaults to 'dbAdminUser'.
	 * @throws {MongoException} - Throws an exception if the command fails.
	 * @returns {Promise<Document>} - Returns a promise that resolves to the result of the repairDatabase command.
	 */
	async repairDatabase(
		options: RunCommandOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoAdminDb,
		dbOptions: DbOptions = {},
		userRole: keyof {
			__systemUser: string;
			internalUser: string;
			rootUser: string;
			readAnyDatabaseUser: string;
			readWriteAnyDatabaseUser: string;
			userAdminAnyDatabaseUser: string;
			dbAdminAnyDatabaseUser: string;
			readUser: string;
			readWriteUser: string;
			dbAdminUser: string;
			userAdminUser: string;
			dbOwnerUser: string;
			enableShardingUser: string;
			clusterAdminUser: string;
			clusterManagerUser: string;
			clusterMonitorUser: string;
			hostManagerUser: string;
			backupUser: string;
			restoreUser: string;
		} = "dbAdminUser"
	): Promise<Document> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			userRole,
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			await this.redis.invalidateCacheForCollection("mongo", this.collection);

			const runCommandOptions = {
				...options,
				session: clientOptions?.session
			} as RunCommandOptions;

			const command = { repairDatabase: 1 };
			return await mongoDb.command(command, runCommandOptions);
		} catch (error) {
			return await this.handleException(
				MongoException,
				`Error running repairDatabase command! \n Error: ${error}`
			);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function killOp
	 * @description Terminate a running operation on the MongoDB server.
	 * @param {number} operationId - The ID of the operation to terminate.
	 * @param {RunCommandOptions} options - Optional additional options for the runCommand method.
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - Client session options.
	 * @param {string} dbName - Name of the database to run the command against, defaults to 'admin'.
	 * @param {DbOptions} dbOptions - Optional database connection options.
	 * @param {keyof {
	 *    __systemUser: string;
	 *    internalUser: string;
	 *    rootUser: string;
	 *    readAnyDatabaseUser: string;
	 *    readWriteAnyDatabaseUser: string;
	 *    userAdminAnyDatabaseUser: string;
	 *    dbAdminAnyDatabaseUser: string;
	 *    readUser: string;
	 *    readWriteUser: string;
	 *    dbAdminUser: string;
	 *    userAdminUser: string;
	 *    dbOwnerUser: string;
	 *    enableShardingUser: string;
	 *    clusterAdminUser: string;
	 *    clusterManagerUser: string;
	 *    clusterMonitorUser: string;
	 *    hostManagerUser: string;
	 *    backupUser: string;
	 *    restoreUser: string;
	 * }} userRole - The user role to use for the operation. Defaults to 'clusterManagerUser'.
	 * @throws {MongoException} - Throws an exception if the command fails.
	 * @returns {Promise<Document>} - Returns a promise that resolves to the result of the killOp command.
	 */
	async killOp(
		operationId: number,
		options: RunCommandOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoAdminDb,
		dbOptions: DbOptions = {},
		userRole: keyof {
			__systemUser: string;
			internalUser: string;
			rootUser: string;
			readAnyDatabaseUser: string;
			readWriteAnyDatabaseUser: string;
			userAdminAnyDatabaseUser: string;
			dbAdminAnyDatabaseUser: string;
			readUser: string;
			readWriteUser: string;
			dbAdminUser: string;
			userAdminUser: string;
			dbOwnerUser: string;
			enableShardingUser: string;
			clusterAdminUser: string;
			clusterManagerUser: string;
			clusterMonitorUser: string;
			hostManagerUser: string;
			backupUser: string;
			restoreUser: string;
		} = "clusterManagerUser"
	): Promise<Document> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			userRole,
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const runCommandOptions = {
				...options,
				session: clientOptions?.session
			} as RunCommandOptions;

			const command = { killOp: 1, op: operationId };
			return await mongoDb.command(command, runCommandOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Error running killOp command! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}
		}
	}

	/**
	 * @async
	 * @function createView
	 * @description Creates a view in the MongoDB database.
	 * @param {string} viewName - The name of the view to create.
	 * @param {string} sourceCollection - The name of the source collection the view is based on.
	 * @param {Array<Document>} pipeline - An array of aggregation pipeline stages that defines the view.
	 * @param {RunCommandOptions} options - Optional command options.
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - Client session options.
	 * @param {string} dbName - The database name, defaults to the application's database name.
	 * @param {DbOptions} dbOptions - Optional database connection options.
	 * @param {keyof {
	 *    __systemUser: string;
	 *    internalUser: string;
	 *    rootUser: string;
	 *    readAnyDatabaseUser: string;
	 *    readWriteAnyDatabaseUser: string;
	 *    userAdminAnyDatabaseUser: string;
	 *    dbAdminAnyDatabaseUser: string;
	 *    readUser: string;
	 *    readWriteUser: string;
	 *    dbAdminUser: string;
	 *    userAdminUser: string;
	 *    dbOwnerUser: string;
	 *    enableShardingUser: string;
	 *    clusterAdminUser: string;
	 *    clusterManagerUser: string;
	 *    clusterMonitorUser: string;
	 *    hostManagerUser: string;
	 *    backupUser: string;
	 *    restoreUser: string;
	 * }} userRole - The user role to use for the operation. Defaults to 'dbAdminUser'.
	 * @throws {MongoException} - Throws an exception if the view cannot be created.
	 * @returns {Promise<Document>} - Returns a promise that resolves to the result of the create view operation.
	 */
	async createView(
		viewName: string,
		sourceCollection: string,
		pipeline: Array<Document>,
		options: RunCommandOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {},
		userRole: keyof {
			__systemUser: string;
			internalUser: string;
			rootUser: string;
			readAnyDatabaseUser: string;
			readWriteAnyDatabaseUser: string;
			userAdminAnyDatabaseUser: string;
			dbAdminAnyDatabaseUser: string;
			readUser: string;
			readWriteUser: string;
			dbAdminUser: string;
			userAdminUser: string;
			dbOwnerUser: string;
			enableShardingUser: string;
			clusterAdminUser: string;
			clusterManagerUser: string;
			clusterMonitorUser: string;
			hostManagerUser: string;
			backupUser: string;
			restoreUser: string;
		} = "dbAdminUser"
	): Promise<Document> {
		const command = {
			create: viewName,
			viewOn: sourceCollection,
			pipeline: pipeline
		};

		try {
			await this.redis.invalidateCacheForCollection("mongo", this.collection);
			return await this.runCommand(command, options, clientOptions, dbName, dbOptions, userRole);
		} catch (error) {
			return await this.handleException(MongoException, `Could not drop role! \n Error: ${error}`);
		} finally {
			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function dropRole
	 * @description Drops a role from the MongoDB database.
	 * @param {string} roleName - The name of the role to drop.
	 * @param {RunCommandOptions} options - Optional command options.
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions - Client session options.
	 * @param {string} dbName - The database name, defaults to 'admin' for global roles.
	 * @param {DbOptions} dbOptions - Optional database connection options.
	 * @param {keyof {
	 *    __systemUser: string;
	 *    internalUser: string;
	 *    rootUser: string;
	 *    readAnyDatabaseUser: string;
	 *    readWriteAnyDatabaseUser: string;
	 *    userAdminAnyDatabaseUser: string;
	 *    dbAdminAnyDatabaseUser: string;
	 *    readUser: string;
	 *    readWriteUser: string;
	 *    dbAdminUser: string;
	 *    userAdminUser: string;
	 *    dbOwnerUser: string;
	 *    enableShardingUser: string;
	 *    clusterAdminUser: string;
	 *    clusterManagerUser: string;
	 *    clusterMonitorUser: string;
	 *    hostManagerUser: string;
	 *    backupUser: string;
	 *    restoreUser: string;
	 * }} userRole - The user role to use for the operation. Defaults to 'userAdminUser'.
	 * @throws {MongoException} - Throws an exception if the role cannot be dropped.
	 * @returns {Promise<Document>} - Returns a promise that resolves to the result of the drop role operation.
	 */
	async dropRole(
		roleName: string,
		options: RunCommandOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoAdminDb,
		dbOptions: DbOptions = {},
		userRole: keyof {
			__systemUser: string;
			internalUser: string;
			rootUser: string;
			readAnyDatabaseUser: string;
			readWriteAnyDatabaseUser: string;
			userAdminAnyDatabaseUser: string;
			dbAdminAnyDatabaseUser: string;
			readUser: string;
			readWriteUser: string;
			dbAdminUser: string;
			userAdminUser: string;
			dbOwnerUser: string;
			enableShardingUser: string;
			clusterAdminUser: string;
			clusterManagerUser: string;
			clusterMonitorUser: string;
			hostManagerUser: string;
			backupUser: string;
			restoreUser: string;
		} = "userAdminUser"
	): Promise<Document> {
		try {
			const command = { dropRole: roleName };
			return await this.runCommand(command, options, clientOptions, dbName, dbOptions, userRole);
		} catch (error) {
			return await this.handleException(MongoException, `Could not drop role! \n Error: ${error}`);
		}
	}

	/**
	 * @async
	 * @function dropCollection
	 * @description Drop a collection from the database, removing it permanently. New accesses will create a new collection.
	 * @param {string} collectionName
	 * @param {DropCollectionOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<boolean>}
	 */
	async dropCollection(
		collectionName: string,
		options: DropCollectionOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<boolean> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			"dbAdminUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			await this.redis.invalidateCacheForCollection("mongo", this.collection);
			const dropCollectionOptions = {
				...options,
				session: clientOptions?.session
			} as DropCollectionOptions;

			return await mongoDb.dropCollection(collectionName, dropCollectionOptions);
		} catch (error) {
			return await this.handleException(
				MongoException,
				`Error dropping collection '${collectionName}'! \n ${error}`
			);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function createUser
	 * @description creates a user
	 * @param {{user: string; pwd: string; roles: Array<{ role: "read" | "readWrite" | "dbAdmin" | "userAdmin" | "clusterAdmin" }>}} user
	 * @param {RunCommandOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<Document>}
	 */
	async createUser(
		user: {
			user: string;
			pwd: string;
			roles: Array<{ role: "read" | "readWrite" | "dbAdmin" | "userAdmin" | "clusterAdmin" }>;
		},
		options: RunCommandOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<Document> {
		try {
			const result = await this.runCommand(
				{
					createUser: user.user,
					pwd: user.pwd,
					roles: user.roles.map((role) => Object.assign({}, role, { db: dbName }))
				},
				options,
				clientOptions,
				dbName,
				dbOptions,
				"userAdminUser"
			);

			return result;
		} catch (error) {
			return await this.handleException(MongoException, `Could not create User! \n Error: ${error}`);
		}
	}

	/**
	 * @async
	 * @function dropUser
	 * @description drops a user from a database
	 * @param {{ username: string }} user
	 * @param {RunCommandOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<Document>}
	 */
	async dropUser(
		user: { username: string },
		options: RunCommandOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<Document> {
		try {
			const result = await this.runCommand(
				{ dropUser: user.username },
				options,
				clientOptions,
				dbName,
				dbOptions,
				"userAdminUser"
			);

			return result;
		} catch (error) {
			return await this.handleException(MongoException, `Failed to drop user!. \n Error: ${error}`);
		}
	}

	/**
	 * @async
	 * @function runCommand
	 * @description Execute a command as userAdminUser.
	 * @param {Document} command
	 * @param {RunCommandOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @param {keyof {
	 *    __systemUser: string;
	 *    internalUser: string;
	 *    rootUser: string;
	 *    readAnyDatabaseUser: string;
	 *    readWriteAnyDatabaseUser: string;
	 *    userAdminAnyDatabaseUser: string;
	 *    dbAdminAnyDatabaseUser: string;
	 *    readUser: string;
	 *    readWriteUser: string;
	 *    dbAdminUser: string;
	 *    userAdminUser: string;
	 *    dbOwnerUser: string;
	 *    enableShardingUser: string;
	 *    clusterAdminUser: string;
	 *    clusterManagerUser: string;
	 *    clusterMonitorUser: string;
	 *    hostManagerUser: string;
	 *    backupUser: string;
	 *    restoreUser: string;
	 * }} userRole - The user role to use for the operation. Defaults to 'userAdminUser'.
	 * @throws {MongoException}
	 * @returns {Promise<Document>}
	 */
	async runCommand(
		command: Document,
		options: RunCommandOptions = {},
		clientOptions: { clientFromSession?: MongoClient; session?: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {},
		userRole: keyof {
			__systemUser: string;
			internalUser: string;
			rootUser: string;
			readAnyDatabaseUser: string;
			readWriteAnyDatabaseUser: string;
			userAdminAnyDatabaseUser: string;
			dbAdminAnyDatabaseUser: string;
			readUser: string;
			readWriteUser: string;
			dbAdminUser: string;
			userAdminUser: string;
			dbOwnerUser: string;
			enableShardingUser: string;
			clusterAdminUser: string;
			clusterManagerUser: string;
			clusterMonitorUser: string;
			hostManagerUser: string;
			backupUser: string;
			restoreUser: string;
		} = "userAdminUser"
	): Promise<Document> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			userRole,
			dbName,
			dbOptions,
			clientOptions?.clientFromSession,
			{
				deprecationErrors: true,
				strict: false,
				version: "1"
			}
		);

		try {
			const runCommandOptions = {
				...options,
				session: clientOptions?.session
			} as RunCommandOptions;

			return await mongoDb.command(command, runCommandOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Error running command! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}
		}
	}

	/**
	 * @async
	 * @function renameCollection
	 * @description Rename a collection.
	 * @param {string} oldName
	 * @param {string} newName
	 * @param {RenameOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<Document>}
	 */
	async renameCollection(
		oldName: string,
		newName: string,
		options: RenameOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<Collection<Document>> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			"dbAdminUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			await this.redis.invalidateCacheForCollection("mongo", this.collection);
			const renameCollectionOptions = {
				...options,
				session: clientOptions?.session
			} as RenameOptions;
			return await mongoDb.renameCollection(oldName, newName, renameCollectionOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Error renaming collection!. \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function createCollection
	 * @description Create a new collection on a server with the specified options. Use this to create capped collections. More information about command options available at https://www.mongodb.com/docs/manual/reference/command/create/
	 * @param {string} collectionName
	 * @param {CreateCollectionOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<Collection<Document>>}
	 */
	async createCollection(
		collectionName: string,
		options: CreateCollectionOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<Collection<Document>> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			"dbAdminUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const createCollectionOptions = {
				...options,
				session: clientOptions?.session
			} as CreateCollectionOptions;

			return await mongoDb.createCollection(collectionName, createCollectionOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Error creating collection! \n Error:${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}
		}
	}

	/**
	 * @async
	 * @function dropDatabase
	 * @description Drop a database, removing it permanently from the server.
	 * @param {DropDatabaseOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<boolean>}
	 */
	async dropDatabase(
		options: DropDatabaseOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<boolean> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			"dbAdminUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);
		try {
			await this.redis.invalidateCacheForCollection("mongo", this.collection);
			const dropDatabaseOptions = {
				...options,
				session: clientOptions?.session
			} as DropDatabaseOptions;
			return await mongoDb.dropDatabase(dropDatabaseOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Error dropping database: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function findAndModify
	 * @description Find a document and update it in one atomic operation. Requires a write lock for the duration of the operation.
	 * @param {Partial<this["modelColumns"]>} filter
	 * @param {Partial<this["modelColumns"]>} update
	 * @param {FindOneAndUpdateOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<WithId<Document> | null>}
	 */
	async findAndModify(
		filter: Partial<this["modelColumns"]>,
		update: Partial<this["modelColumns"]>,
		options: FindOneAndUpdateOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<WithId<Document> | null> {
		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readWriteUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			await this.redis.invalidateCacheForCollection("mongo", this.collection);

			const findAndModifyOptions = {
				...options,
				session: clientOptions?.session
			} as FindOneAndUpdateOptions;

			return await mongoDb.collection(collection).findOneAndUpdate(filter, update, findAndModifyOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Error performing find and modify! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function findOneAndDelete
	 * @description Find a document and delete it in one atomic operation. Requires a write lock for the duration of the operation.
	 * @param {Partial<this["modelColumns"]>} filter
	 * @param {FindOneAndDeleteOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<WithId<Document> | null>}
	 */
	async findOneAndDelete(
		filter: Partial<this["modelColumns"]>,
		options: FindOneAndDeleteOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<WithId<Document> | null> {
		await this.validateMongoTypes(filter, true);

		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readWriteUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			await this.redis.invalidateCacheForCollection("mongo", this.collection);
			const findOneAndDeleteOptions = {
				...options,
				session: clientOptions?.session
			} as FindOneAndDeleteOptions;

			return await mongoDb.collection(collection).findOneAndDelete(filter, findOneAndDeleteOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Error performing find and delete! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function findOneAndUpdate
	 * @description Find a document and update it in one atomic operation. Requires a write lock for the duration of the operation.
	 * @param {Partial<this["modelColumns"]>} filter
	 * @param {Partial<this["modelColumns"]>} update
	 * @param {FindOneAndUpdateOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<WithId<Document> | null>}
	 */
	async findOneAndUpdate(
		filter: Partial<this["modelColumns"]>,
		update: Partial<this["modelColumns"]>,
		options: FindOneAndUpdateOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<WithId<Document> | null> {
		await this.validateMongoTypes(filter, true);
		await this.validateMongoTypes(update);

		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readWriteUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			await this.redis.invalidateCacheForCollection("mongo", this.collection);
			const findOneAndUpdateOptions = {
				...options,
				session: clientOptions?.session
			} as FindOneAndUpdateOptions;

			return await mongoDb
				.collection(collection)
				.findOneAndUpdate(filter, { $set: update }, findOneAndUpdateOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Error performing find and update! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function findOneAndReplace
	 * @description Find a document and replace it in one atomic operation. Requires a write lock for the duration of the operation.
	 * @param {Partial<this["modelColumns"]>} filter
	 * @param {WithoutId<Partial<this["modelColumns"]>>} replacement
	 * @param {FindOneAndReplaceOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<WithId<Document> | null>}
	 */
	async findOneAndReplace(
		filter: Partial<this["modelColumns"]>,
		replacement: WithoutId<Partial<this["modelColumns"]>>,
		options: FindOneAndReplaceOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<WithId<Document> | null> {
		await this.validateMongoTypes(filter, true);
		await this.validateMongoTypes(replacement);

		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readWriteUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			await this.redis.invalidateCacheForCollection("mongo", this.collection);
			const findOneAndReplaceOptions = {
				...options,
				session: clientOptions?.session
			} as FindOneAndReplaceOptions;
			return await mongoDb
				.collection(collection)
				.findOneAndReplace(filter, replacement, findOneAndReplaceOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Error performing find and replace! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function insertOne
	 * @description Inserts a single document into MongoDB. If documents passed in do not contain the _id field, one will be added to each of the documents missing it by the driver, mutating the document. This behavior can be overridden by setting the forceServerObjectId flag.
	 * @param {OptionalId<Partial<this["modelColumns"]>>} document
	 * @param {InsertOneOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<InsertOneResult<Document>>}
	 */
	async insertOne(
		document: OptionalId<Partial<this["modelColumns"]>>,
		options: InsertOneOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<InsertOneResult<Document>> {
		await this.validateMongoTypes(document);

		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readWriteUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			await this.redis.invalidateCacheForCollection("mongo", this.collection);
			const insertOptions = {
				...options,
				session: clientOptions?.session
			} as InsertOneOptions;

			return await mongoDb.collection(collection).insertOne(document, insertOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Could not insert the document! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function insertMany
	 * @description Inserts an array of documents into MongoDB. If documents passed in do not contain the _id field, one will be added to each of the documents missing it by the driver, mutating the document. This behavior can be overridden by setting the forceServerObjectId flag.
	 * @param {OptionalId<Partial<this["modelColumns"]>>[]} documents
	 * @param {BulkWriteOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<InsertManyResult<Filter<this["modelColumns"]>>>}
	 */
	async insertMany(
		documents: readonly OptionalId<Partial<this["modelColumns"]>>[],
		options: BulkWriteOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<InsertManyResult<Filter<this["modelColumns"]>>> {
		for (const document of documents) {
			await this.validateMongoTypes(document);
		}

		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readWriteUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			await this.redis.invalidateCacheForCollection("mongo", this.collection);
			const insertManyOptions = {
				...options,
				session: clientOptions?.session
			} as BulkWriteOptions;

			return await mongoDb.collection(collection).insertMany(documents, insertManyOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Could not insert the documents! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function bulkWrite
	 * @description Perform a bulkWrite operation without a fluent API
	 * @param {AnyBulkWriteOperation<this["modelColumns"]>[]} operations
	 * @param {BulkWriteOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<BulkWriteResult>}
	 */
	async bulkWrite(
		operations: readonly AnyBulkWriteOperation<this["modelColumns"]>[],
		options: BulkWriteOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<BulkWriteResult> {
		for (const operation of operations) {
			if ("insertOne" in operation) {
				await this.validateMongoTypes(operation.insertOne.document); // Strict validation for insertOne
			}

			if ("updateOne" in operation) {
				const updateOp = operation.updateOne;
				await this.validateMongoTypes(updateOp.filter, true);
				if (updateOp.update && "$set" in updateOp.update) {
					await this.validateMongoTypes(updateOp.update.$set);
				}
			}

			if ("updateMany" in operation) {
				const updateOp = operation.updateMany;
				await this.validateMongoTypes(updateOp.filter, true);
				if (updateOp.update && "$set" in updateOp.update) {
					await this.validateMongoTypes(updateOp.update.$set);
				}
			}

			if ("deleteOne" in operation) {
				const deleteOp = operation.deleteOne;
				await this.validateMongoTypes(deleteOp.filter, true);
			}

			if ("deleteMany" in operation) {
				const deleteOp = operation.deleteMany;
				await this.validateMongoTypes(deleteOp.filter, true);
			}
		}

		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readWriteUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			await this.redis.invalidateCacheForCollection("mongo", this.collection);
			const bulkWriteOptions = {
				...options,
				session: clientOptions?.session
			} as BulkWriteOptions;
			return await mongoDb.collection(collection).bulkWrite(operations, bulkWriteOptions);
		} catch (error) {
			return await this.handleException(
				MongoException,
				`Could not perform the bulk write operation! \n Error: ${error}`
			);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function deleteOne
	 * @description Delete a document from a collection
	 * @param {Partial<this["modelColumns"]> | undefined} filter
	 * @param {DeleteOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<DeleteResult>}
	 */
	async deleteOne(
		filter?: Partial<this["modelColumns"]> | undefined,
		options: DeleteOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<DeleteResult> {
		await this.validateMongoTypes(filter, true);

		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readWriteUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			await this.redis.invalidateCacheForCollection("mongo", this.collection);
			const deleteOneOptions = {
				...options,
				session: clientOptions?.session
			} as DeleteOptions;
			return await mongoDb.collection(collection).deleteOne(filter, deleteOneOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Could not delete the document! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function deleteMany
	 * @description Delete multiple documents from a collection
	 * @param {Partial<this["modelColumns"]> | undefined} filter
	 * @param {DeleteOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<DeleteResult>}
	 */
	async deleteMany(
		filter?: Partial<this["modelColumns"]> | undefined,
		options: DeleteOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<DeleteResult> {
		await this.validateMongoTypes(filter, true);

		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readWriteUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			await this.redis.invalidateCacheForCollection("mongo", this.collection);
			const deleteManyOptions = {
				...options,
				session: clientOptions?.session
			} as DeleteOptions;

			return await mongoDb.collection(collection).deleteMany(filter, deleteManyOptions);
		} catch (error) {
			return await this.handleException(MongoException, `Could not delete the documents! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function updateOne
	 * @description Update a single document in a collection
	 * @param {Partial<this["modelColumns"]>} filter
	 * @param {Partial<this["modelColumns"]> | Partial<this["modelColumns"]>[]} update
	 * @param {UpdateOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<UpdateResult<Document>>}
	 */
	async updateOne(
		filter: Partial<this["modelColumns"]>,
		update: Partial<this["modelColumns"]> | Partial<this["modelColumns"]>[],
		options: UpdateOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<UpdateResult<Document>> {
		await this.validateMongoTypes(filter, true);
		await this.validateMongoTypes(update);

		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readWriteUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const cacheKey = `mongo:updateOne:${collection}`;
			await this.redis.invalidateCacheForCollection("mongo", this.collection);

			const updateOneOptions = {
				...options,
				session: clientOptions?.session
			} as UpdateOptions;

			const result = await mongoDb.collection(collection).updateOne(filter, { $set: update }, updateOneOptions);

			if (result) {
				await this.redis.cacheResult(cacheKey, result);
			}

			return result;
		} catch (error) {
			return await this.handleException(MongoException, `Could not update the document! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function updateMany
	 * @description Update multiple documents in a collection
	 * @param {Partial<this["modelColumns"]>} filter
	 * @param {Partial<this["modelColumns"]> | Partial<this["modelColumns"]>[]} update
	 * @param {UpdateOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<UpdateResult<Document>>}
	 */
	async updateMany(
		filter: Partial<this["modelColumns"]>,
		update: Partial<this["modelColumns"]> | Partial<this["modelColumns"]>[],
		options: UpdateOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<UpdateResult<Document>> {
		await this.validateMongoTypes(filter, true);
		await this.validateMongoTypes(update);

		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readWriteUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const cacheKey = `mongo:updateMany:${collection}`;

			await this.redis.invalidateCacheForCollection("mongo", this.collection);

			const updateManyOptions = {
				...options,
				session: clientOptions?.session
			} as UpdateOptions;

			const result = await mongoDb.collection(collection).updateMany(filter, { $set: update }, updateManyOptions);

			if (result) {
				await this.redis.cacheResult(cacheKey, result);
			}

			return result;
		} catch (error) {
			return await this.handleException(MongoException, `Could not update the documents! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function replaceOne
	 * @description Replace a document in a collection with another document
	 * @param {Partial<this["modelColumns"]>} filter
	 * @param {WithoutId<Partial<this["modelColumns"]>>} replacement
	 * @param {ReplaceOptions} options
	 * @param {{ clientFromSession: MongoClient; session: ClientSession } | undefined} clientOptions
	 * @param {string} collection
	 * @param {string} dbName
	 * @param {DbOptions} dbOptions
	 * @throws {MongoException}
	 * @returns {Promise<Document | UpdateResult<Document>>}
	 */
	async replaceOne(
		filter: Partial<this["modelColumns"]>,
		replacement: WithoutId<Partial<this["modelColumns"]>>,
		options: ReplaceOptions = {},
		clientOptions: { clientFromSession: MongoClient; session: ClientSession } | undefined = undefined,
		collection: string = this.collection,
		dbName: string = config.configurations().mongoDbName,
		dbOptions: DbOptions = {}
	): Promise<Document | UpdateResult<Document>> {
		await this.validateMongoTypes(filter, true);
		await this.validateMongoTypes(replacement);

		const { mongoDb, client, isFromSession } = await this.getConnection(
			"readWriteUser",
			dbName,
			dbOptions,
			clientOptions?.clientFromSession
		);

		try {
			const cacheKey = `mongo:replaceOne:${collection}`;
			await this.redis.invalidateCacheForCollection("mongo", this.collection);

			const replaceOneOptions = {
				...options,
				session: clientOptions?.session
			} as ReplaceOptions;

			const result = (await mongoDb.collection(collection).replaceOne(filter, replacement, replaceOneOptions)) as
				| Document
				| UpdateResult<Document>;

			if (result) {
				await this.redis.cacheResult(cacheKey, result);
			}

			return result;
		} catch (error) {
			return await this.handleException(MongoException, `Could not replace the document! \n Error: ${error}`);
		} finally {
			if (!isFromSession) {
				await client.close();
			}

			await this.redis.quit();
		}
	}
}

export default MongoModel;
