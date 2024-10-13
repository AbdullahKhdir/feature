import dotenv from "dotenv";
import * as cmd from "./utils/CommandExecuter";
import { Dialect } from "sequelize";
import { MongoClientOptions } from "mongodb";

dotenv.config();

export function configurations() {
	return {
		redisCacheExpiry: 3600,
		dialect: process.env["DEVELOPMENT_DRIVER"] as Dialect,
		logging: false,
		host: process.env["HOST"],
		port: process.env["DB_PORT"] ? +process.env["DB_PORT"] : undefined,
		user: process.env["TEST_USERNAME"] || process.env["PRODUCTION_USERNAME"] || process.env["DEVELOPMENT_USERNAME"],
		password:
			process.env["TEST_PASSWORD"] || process.env["PRODUCTION_PASSWORD"] || process.env["DEVELOPMENT_PASSWORD"],
		database: process.env["DATABASE"],
		connectionLimit: process.env["CONNECTION_LIMIT"] ? +process.env["CONNECTION_LIMIT"] : undefined,
		socketPath: process.platform !== "win32" ? cmd._mysqlSocket() : "",
		encryptionKey: process.env["ENCRYPTION_KEY"] || "",
		environment: process.env["NODE_ENV"],
		server_port: process.env["PORT"],
		migration: process.env["MIGRATION"],
		isWorkerPoolActive:
			process.env["WORKER_POOL_ENABLED"] === "0"
				? process.env["NODE_ENV"] === "production"
					? (process.env["WORKER_POOL_ENABLED"] = "1")
					: (process.env["WORKER_POOL_ENABLED"] = "0")
				: process.env["WORKER_POOL_ENABLED"],
		os:
			process.platform === "darwin"
				? "MAC"
				: process.platform === "linux"
				? "LINUX"
				: process.platform === "win32"
				? "WINDOWS"
				: process.platform === "freebsd" || process.platform === "openbsd" || process.platform === "sunos"
				? "UNIX"
				: "UNKNOWN",
		executionPoint: process.env["EXECUTION_POINT"] || "",
		domainName: process.env["DOMAIN_NAME"] || "",
		mongoDbRowUri: process.env["mongoDbRowUri"] || "",
		supportTeamEmail: process.env["SUPPORT_TEAM_EMAIL"] || "",
		apiAuthenticationSecret: process.env["API_AUTHENTICATION_SECRET"] || "",
		mongoAdminUser: process.env["mongoAdminUser"] as string,
		mongoAdminPassword: process.env["mongoAdminPassword"] as string,
		mongoDbName: process.env["mongoDbName"] as string,
		mongoDbUri: process.env["mongoDbUri"] as string,
		mongoDbUriAdmin: process.env["mongoDbUri"] + "/" + process.env["mongoDbNameAdmin"] + process.env["replicaSet"],
		mongoLoadBalanced: process.env["loadBalanced"],
		mongoTlsAllowInvalidCertificates: process.env["tlsAllowInvalidCertificates"],
		mongoTlsAllowInvalidHostnames: process.env["tlsAllowInvalidHostnames"],
		mongoAuthMechanismProperties: process.env["authMechanismProperties"],
		mongoAuthSource: process.env["authSource"],
		mongoHeartbeatFrequencyMS: process.env["heartbeatFrequencyMS"],
		mongoJournal: process.env["journal"],
		mongoMaxStalenessSeconds: process.env["maxStalenessSeconds"],
		mongoProxyHost: process.env["proxyHost"],
		mongoProxyPort: process.env["proxyPort"],
		mongoProxyUsername: process.env["proxyUsername"],
		mongoProxyPassword: process.env["proxyPassword"],
		mongoReadConcernLevel: process.env["readConcernLevel"],
		mongoReadPreferenceTags: process.env["readPreferenceTags"],
		mongoReplicaSet: process.env["replicaSet"] as string,
		mongoTlsCAFile: process.env["tlsCAFile"],
		mongoTlsCertificateKeyFile: process.env["tlsCertificateKeyFile"],
		mongoTlsCertificateKeyFilePassword: process.env["tlsCertificateKeyFilePassword"],
		mongoW: process.env["w"],
		mongoWtimeoutMS: process.env["wtimeoutMS"],
		mongoSrvMaxHosts: process.env["srvMaxHosts"],
		mongoSrvServiceName: process.env["srvServiceName"],
		mongoAdminDb: process.env["mongoAdminDb"] as string,
		__systemUser: process.env["__systemUser"] as string,
		__systemUserPassword: process.env["__systemUserPassword"] as string,
		internalUser: process.env["internalUser"] as string,
		internalUserPassword: process.env["internalUserPassword"] as string,
		rootUser: process.env["rootUser"] as string,
		rootUserPassword: process.env["rootUserPassword"] as string,
		readAnyDatabaseUser: process.env["readAnyDatabaseUser"] as string,
		readAnyDatabaseUserPassword: process.env["readAnyDatabaseUserPassword"] as string,
		readWriteAnyDatabaseUser: process.env["readWriteAnyDatabaseUser"] as string,
		readWriteAnyDatabaseUserPassword: process.env["readWriteAnyDatabaseUserPassword"] as string,
		userAdminAnyDatabaseUser: process.env["userAdminAnyDatabaseUser"] as string,
		userAdminAnyDatabaseUserPassword: process.env["userAdminAnyDatabaseUserPassword"] as string,
		dbAdminAnyDatabaseUser: process.env["dbAdminAnyDatabaseUser"] as string,
		dbAdminAnyDatabaseUserPassword: process.env["dbAdminAnyDatabaseUserPassword"] as string,
		readUser: process.env["readUser"] as string,
		readUserPassword: process.env["readUserPassword"] as string,
		readWriteUser: process.env["readWriteUser"] as string,
		readWriteUserPassword: process.env["readWriteUserPassword"] as string,
		dbAdminUser: process.env["dbAdminUser"] as string,
		dbAdminUserPassword: process.env["dbAdminUserPassword"] as string,
		userAdminUser: process.env["userAdminUser"] as string,
		userAdminUserPassword: process.env["userAdminUserPassword"] as string,
		dbOwnerUser: process.env["dbOwnerUser"] as string,
		dbOwnerUserPassword: process.env["dbOwnerUserPassword"] as string,
		enableShardingUser: process.env["enableShardingUser"] as string,
		enableShardingUserPassword: process.env["enableShardingUserPassword"] as string,
		clusterAdminUser: process.env["clusterAdminUser"] as string,
		clusterAdminUserPassword: process.env["clusterAdminUserPassword"] as string,
		clusterManagerUser: process.env["clusterManagerUser"] as string,
		clusterManagerUserPassword: process.env["clusterManagerUserPassword"] as string,
		clusterMonitorUser: process.env["clusterMonitorUser"] as string,
		clusterMonitorUserPassword: process.env["clusterMonitorUserPassword"] as string,
		hostManagerUser: process.env["hostManagerUser"] as string,
		hostManagerUserPassword: process.env["hostManagerUserPassword"] as string,
		backupUser: process.env["backupUser"] as string,
		backupUserPassword: process.env["backupUserPassword"] as string,
		restoreUser: process.env["restoreUser"] as string,
		restoreUserPassword: process.env["restoreUserPassword"] as string,
		mongoDbOptions: {
			appName: process.env["appName"],
			authMechanism: process.env["authMechanism"],
			compressors: process.env["compressors"],
			connectTimeoutMS: process.env["connectTimeoutMS"],
			directConnection: process.env["directConnection"],
			enableUtf8Validation: process.env["enableUtf8Validation"],
			localThresholdMS: process.env["localThresholdMS"],
			maxIdleTimeMS: process.env["maxIdleTimeMS"],
			maxPoolSize: process.env["maxPoolSize"],
			maxConnecting: process.env["maxConnecting"],
			minPoolSize: process.env["minPoolSize"],
			readPreference: process.env["readPreference"],
			retryReads: process.env["retryReads"],
			retryWrites: process.env["retryWrites"],
			serverMonitoringMode: process.env["serverMonitoringMode"],
			serverSelectionTimeoutMS: process.env["serverSelectionTimeoutMS"],
			socketTimeoutMS: process.env["socketTimeoutMS"],
			ssl: process.env["ssl"],
			tls: process.env["tls"],
			tlsInsecure: process.env["tlsInsecure"],
			waitQueueTimeoutMS: process.env["waitQueueTimeoutMS"],
			zlibCompressionLevel: process.env["zlibCompressionLevel"]
		} as MongoClientOptions,
		redisUrl: process.env["redisUrl"] as string,
		redisSocket: {
			redisSocketPort: process.env["redisSocketPort"] as unknown as number,
			redisSocketHost: process.env["redisSocketHost"] as string,
			redisSocketFamily: process.env["redisSocketFamily"] as unknown as number, //? 4 IPv4,
			redisSocketPath: process.env["redisSocketPath"] as string, //? /tmp/redis.sock,
			redisSocketConnectTimeout: process.env["redisSocketConnectTimeout"] as unknown as number, //? 10000,
			redisNoDelay: process.env["redisNoDelay"] as unknown as boolean,
			redisKeepAlive: process.env["redisKeepAlive"] as unknown as number,
			redisReconnectStrategy: (retries: number) =>
				Math.min(retries * 50, 2000) as
					| number
					| false
					| ((retries: number, cause: Error) => false | Error | number)
					| undefined,
			redisTls: { redisTlsRejectUnauthorized: process.env["redisTlsRejectUnauthorized"] as unknown as boolean }
		},
		redisUsername: process.env["redisUsername"] as string,
		redisPasword: process.env["redisPasword"] as string,
		redisName: process.env["redisName"] as string,
		redisDatabase: process.env["redisDatabase"] as unknown as number,
		redisCommandsQueueMaxLength: process.env["redisCommandsQueueMaxLength"] as unknown as number,
		redisDisableOfflineQueue: process.env["redisDisableOfflineQueue"] as unknown as boolean,
		redisReadonly: process.env["redisReadonly"] as unknown as boolean,
		redisLegacyMode: process.env["redisLegacyMode"] as unknown as boolean,
		redisIsolationPoolOptions: { min: 0 as Number, max: 0 as Number },
		redisPingInterval: process.env["redisPingInterval"] as unknown as number
	};
}
