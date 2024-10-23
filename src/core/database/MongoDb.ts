"use strict";

import { MongoClient, Db, Collection, DbOptions, RunCommandOptions } from "mongodb";
import * as config from "../config";
import MongoException from "../exception/types/MongoException";
import { Singleton } from "../Singleton/Singleton";

export = class MongoDb {
	protected dbObject!: Db;
	protected client: MongoClient;
	protected connectionObject!: MongoClient;
	protected collectionObject!: Collection<Document>;
	private static instance: MongoDb;
	private static instanceCount: number = 0;
	public static poolStatus: Array<{ count: () => number; cleanUp: () => void }> = [];

	private constructor(
		username: string,
		password: string,
		serverApi: { version?: string; strict?: boolean; deprecationErrors?: boolean },
		dbName: string = config.configurations().mongoDbName,
		authSource: string = config.configurations().mongoDbName
	) {
		this.client = new MongoClient(
			config
				.configurations()
				.mongoDbUri.replace("<username>", username)
				.replace("<password>", encodeURIComponent(password))
				.replace("<database>", dbName)
				.replace("<replicaSet>", config.configurations().mongoReplicaSet)
				.replace("<authSource>", authSource),
			Object.assign(
				{},
				config.configurations().mongoDbOptions,
				serverApi.version && serverApi.strict && serverApi.deprecationErrors ? { serverApi } : {}
			)
		);
	}

	/**
	 * @function getInstance
	 * @description gets the mongoDB instance
	 * @returns {MongoDb}
	 */
	public static getInstance(
		username: keyof {
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
		serverApi: { version?: string; strict?: boolean; deprecationErrors?: boolean } = {
			version: "1",
			strict: true,
			deprecationErrors: true
		}
	): MongoDb {
		const notAdminUsers = [
			"readUser",
			"readWriteUser",
			"dbAdminUser",
			"userAdminUser",
			"dbOwnerUser",
			"enableShardingUser"
		];
		if (!MongoDb.instance) {
			MongoDb.instance = new MongoDb(
				username,
				config.configurations()[`${username}Password`] as string,
				serverApi.version && serverApi.deprecationErrors && serverApi.strict
					? {
							version: serverApi.version,
							deprecationErrors: serverApi.deprecationErrors,
							strict: serverApi.strict
					  }
					: {},
				dbName,
				notAdminUsers.includes(username)
					? config.configurations().mongoDbName
					: config.configurations().mongoAdminDb
			);
			MongoDb.instanceCount++;
		}

		return MongoDb.instance;
	}

	/**
	 * @async
	 * @function pool
	 * @description gets the pool property
	 * @returns {Promise<MongoClient>}
	 */
	public async pool(): Promise<MongoClient> {
		return this.client;
	}

	/**
	 * @async
	 * @function db
	 * @description gets the db property
	 * @returns {Promise<Db>}
	 */
	public async db(): Promise<Db> {
		return this.dbObject;
	}

	/**
	 * @async
	 * @function getConnection
	 * @description getConnection
	 * @returns {Promise<MongoClient>}
	 */
	public async getConnection(): Promise<MongoClient> {
		if (!(await this.isMongoDBConnected())) {
			throw new MongoException(`Connection to MongoDB is not established!`);
		}

		return this.connectionObject;
	}

	/**
	 * @async
	 * @description connects to mongoDB
	 * @param client - placeholder for a client
	 * @returns {Promise<any>}
	 */
	async connect(client: MongoClient = this.client): Promise<any> {
		try {
			if (!(await this.isMongoDBConnected(client, config.configurations().mongoDbName))) {
				this.connectionObject = await client.connect();

				MongoDb.poolStatus.push(await this.connectionPoolStatus(client));
			}
		} catch (error) {
			throw new MongoException(`Could not establish connection for MongoDB! \n Error: ${error}`);
		}
	}

	/**
	 * @async
	 * @function close
	 * @description closes the connection
	 * @returns {Promise<any>}
	 */
	async close(): Promise<any> {
		try {
			await this.client.close();
		} catch (error) {
			throw new MongoException(`Could not close the MongoDB connection! \n Error: ${error}`);
		}
	}

	/**
	 * @async
	 * @function isMongoDBConnected
	 * @param client - placeholder for client
	 * @param dbName - placeholder for database name
	 * @returns {Promise<boolean>}
	 */
	async isMongoDBConnected(
		client: MongoClient = this.client,
		dbName: string = config.configurations().mongoDbName
	): Promise<boolean> {
		try {
			await client.db(dbName).command({ ping: 1 });
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * @function connectionPoolStatus
	 * @param client
	 * @returns {Promise<{count: Function; cleanUp: Function;}>}
	 */
	async connectionPoolStatus(client: MongoClient): Promise<{ count: () => number; cleanUp: () => void }> {
		let checkedOut = 0;

		function onCheckout() {
			checkedOut++;
		}

		function onCheckin() {
			checkedOut--;
		}

		function onClose() {
			client.removeListener("connectionCheckedOut", onCheckout);
			client.removeListener("connectionCheckedIn", onCheckin);

			checkedOut = NaN;
		}

		// Decreases count of connections checked out of the pool when connectionCheckedIn event is triggered
		client.on("connectionCheckedIn", onCheckin);

		// Increases count of connections checked out of the pool when connectionCheckedOut event is triggered
		client.on("connectionCheckedOut", onCheckout);

		// Cleans up event listeners when client is closed
		client.on("close", onClose);

		return {
			count: () => checkedOut,
			cleanUp: onClose
		};
	}

	/**
	 * @function getInstanceCount
	 * @description gets how many times the instance has been initated
	 * @returns {number}
	 */
	public static getInstanceCount(): number {
		return MongoDb.instanceCount;
	}

	/**
	 * @async
	 * @description a function that creates mongoDB and initiate the user roles for read, readWrite, userAdmin and admin
	 * @returns {Promise<any>}
	 */
	public static async intitateMongoDbForApplication(): Promise<any> {
		const constants = Singleton.getConstants();
		try {
			const rowClientConnection = new MongoClient(
				config.configurations().mongoDbRowUri,
				Object.assign({}, config.configurations().mongoDbOptions)
			);
			const rowDbConnection = rowClientConnection.db(config.configurations().mongoDbRowUri, {} as DbOptions);
			const adminDocuments = [
				{
					name: config.configurations().__systemUser,
					password: encodeURIComponent(config.configurations().__systemUserPassword),
					role: constants.MONGO_DB.RBAC.INTERNAL_AND_SPECIAL_ROLES.__system
				},
				{
					name: config.configurations().internalUser,
					password: encodeURIComponent(config.configurations().internalUserPassword),
					role: constants.MONGO_DB.RBAC.INTERNAL_AND_SPECIAL_ROLES.internal
				},
				{
					name: config.configurations().rootUser,
					password: encodeURIComponent(config.configurations().rootUserPassword),
					role: constants.MONGO_DB.RBAC.SUPERUSER_ROLES.root
				},
				{
					name: config.configurations().readAnyDatabaseUser,
					password: encodeURIComponent(config.configurations().readAnyDatabaseUserPassword),
					role: constants.MONGO_DB.RBAC.ALL_DATABASE_ROLES.readAnyDatabase
				},
				{
					name: config.configurations().readWriteAnyDatabaseUser,
					password: encodeURIComponent(config.configurations().readWriteAnyDatabaseUserPassword),
					role: constants.MONGO_DB.RBAC.ALL_DATABASE_ROLES.readWriteAnyDatabase
				},
				{
					name: config.configurations().userAdminAnyDatabaseUser,
					password: encodeURIComponent(config.configurations().userAdminAnyDatabaseUserPassword),
					role: constants.MONGO_DB.RBAC.ALL_DATABASE_ROLES.userAdminAnyDatabase
				},
				{
					name: config.configurations().dbAdminAnyDatabaseUser,
					password: encodeURIComponent(config.configurations().dbAdminAnyDatabaseUserPassword),
					role: constants.MONGO_DB.RBAC.ALL_DATABASE_ROLES.dbAdminAnyDatabase
				},
				{
					name: config.configurations().readUser,
					password: encodeURIComponent(config.configurations().readUserPassword),
					role: constants.MONGO_DB.RBAC.USER_ROLES.read
				},
				{
					name: config.configurations().readWriteUser,
					password: encodeURIComponent(config.configurations().readWriteUserPassword),
					role: constants.MONGO_DB.RBAC.USER_ROLES.readWrite
				},
				{
					name: config.configurations().dbAdminUser,
					password: encodeURIComponent(config.configurations().dbAdminUserPassword),
					role: constants.MONGO_DB.RBAC.USER_ROLES.dbAdmin
				},
				{
					name: config.configurations().userAdminUser,
					password: encodeURIComponent(config.configurations().userAdminUserPassword),
					role: constants.MONGO_DB.RBAC.USER_ROLES.userAdmin
				},
				{
					name: config.configurations().dbOwnerUser,
					password: encodeURIComponent(config.configurations().dbOwnerUserPassword),
					role: constants.MONGO_DB.RBAC.USER_ROLES.dbOwner
				},
				{
					name: config.configurations().enableShardingUser,
					password: encodeURIComponent(config.configurations().enableShardingUserPassword),
					role: constants.MONGO_DB.RBAC.USER_ROLES.enableSharding
				},
				{
					name: config.configurations().clusterAdminUser,
					password: encodeURIComponent(config.configurations().clusterAdminUserPassword),
					role: constants.MONGO_DB.RBAC.CLUSTER_ADMINISTRATION_ROLES.clusterAdmin
				},
				{
					name: config.configurations().clusterManagerUser,
					password: encodeURIComponent(config.configurations().clusterManagerUserPassword),
					role: constants.MONGO_DB.RBAC.CLUSTER_ADMINISTRATION_ROLES.clusterManager
				},
				{
					name: config.configurations().clusterMonitorUser,
					password: encodeURIComponent(config.configurations().clusterMonitorUserPassword),
					role: constants.MONGO_DB.RBAC.CLUSTER_ADMINISTRATION_ROLES.clusterMonitor
				},
				{
					name: config.configurations().hostManagerUser,
					password: encodeURIComponent(config.configurations().hostManagerUserPassword),
					role: constants.MONGO_DB.RBAC.CLUSTER_ADMINISTRATION_ROLES.hostManager
				},
				{
					name: config.configurations().backupUser,
					password: encodeURIComponent(config.configurations().backupUserPassword),
					role: constants.MONGO_DB.RBAC.Backup_And_Restoration_Roles.backup
				},
				{
					name: config.configurations().restoreUser,
					password: encodeURIComponent(config.configurations().restoreUserPassword),
					role: constants.MONGO_DB.RBAC.Backup_And_Restoration_Roles.restore
				}
			];

			for (const user of adminDocuments) {
				await rowDbConnection.command(
					{
						createUser: user.name,
						pwd: user.password,
						roles: [{ role: user.role, db: config.configurations().mongoAdminDb }]
					},
					{} as RunCommandOptions
				);

				console.log(
					constants.COLORS.BgGreen,
					`✔ User ${user.name} with the role ${user.role} for the database ${
						config.configurations().mongoAdminDb
					} created successfully ✔.`
				);
			}

			const mongoDbDocuments = [
				{
					name: config.configurations().readUser,
					password: encodeURIComponent(config.configurations().readUserPassword),
					role: constants.MONGO_DB.RBAC.USER_ROLES.read
				},
				{
					name: config.configurations().readWriteUser,
					password: encodeURIComponent(config.configurations().readWriteUserPassword),
					role: constants.MONGO_DB.RBAC.USER_ROLES.readWrite
				},
				{
					name: config.configurations().dbAdminUser,
					password: encodeURIComponent(config.configurations().dbAdminUserPassword),
					role: constants.MONGO_DB.RBAC.USER_ROLES.dbAdmin
				},
				{
					name: config.configurations().userAdminUser,
					password: encodeURIComponent(config.configurations().userAdminUserPassword),
					role: constants.MONGO_DB.RBAC.USER_ROLES.userAdmin
				},
				{
					name: config.configurations().dbOwnerUser,
					password: encodeURIComponent(config.configurations().dbOwnerUserPassword),
					role: constants.MONGO_DB.RBAC.USER_ROLES.dbOwner
				},
				{
					name: config.configurations().enableShardingUser,
					password: encodeURIComponent(config.configurations().enableShardingUserPassword),
					role: constants.MONGO_DB.RBAC.USER_ROLES.enableSharding
				}
			];

			for (const user of mongoDbDocuments) {
				await rowDbConnection.command(
					{
						createUser: user.name,
						pwd: user.password,
						roles: [{ role: user.role, db: config.configurations().mongoDbName }]
					},
					{} as RunCommandOptions
				);

				console.log(
					constants.COLORS.BgGreen,
					`✔ User ${user.name} with the role ${user.role} for the database ${
						config.configurations().mongoDbName
					} created successfully ✔.`
				);
			}

			console.log(
				"Restart MongoDB with authentication enabled in the configuration file and add replicaSet to enable the transactions."
			);
		} catch (error) {
			console.error(constants.COLORS.BgRed, `×× Error initializing MongoDB ×× \n Error:`, error);
		}
	}
};
