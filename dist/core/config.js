"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurations = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var cmd = __importStar(require("./utils/CommandExecuter"));
dotenv_1.default.config();
function configurations() {
    return {
        redisCacheExpiry: 3600,
        dialect: process.env["DEVELOPMENT_DRIVER"],
        logging: false,
        host: process.env["HOST"],
        port: process.env["DB_PORT"] ? +process.env["DB_PORT"] : undefined,
        user: process.env["TEST_USERNAME"] || process.env["PRODUCTION_USERNAME"] || process.env["DEVELOPMENT_USERNAME"],
        password: process.env["TEST_PASSWORD"] || process.env["PRODUCTION_PASSWORD"] || process.env["DEVELOPMENT_PASSWORD"],
        database: process.env["DATABASE"],
        connectionLimit: process.env["CONNECTION_LIMIT"] ? +process.env["CONNECTION_LIMIT"] : undefined,
        socketPath: process.platform !== "win32" ? cmd._mysqlSocket() : "",
        encryptionKey: process.env["ENCRYPTION_KEY"] || "",
        environment: process.env["NODE_ENV"],
        server_port: process.env["PORT"],
        migration: process.env["MIGRATION"],
        isWorkerPoolActive: process.env["WORKER_POOL_ENABLED"] === "0"
            ? process.env["NODE_ENV"] === "production"
                ? (process.env["WORKER_POOL_ENABLED"] = "1")
                : (process.env["WORKER_POOL_ENABLED"] = "0")
            : process.env["WORKER_POOL_ENABLED"],
        os: process.platform === "darwin"
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
        mongoAdminUser: process.env["mongoAdminUser"],
        mongoAdminPassword: process.env["mongoAdminPassword"],
        mongoDbName: process.env["mongoDbName"],
        mongoDbUri: process.env["mongoDbUri"],
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
        mongoReplicaSet: process.env["replicaSet"],
        mongoTlsCAFile: process.env["tlsCAFile"],
        mongoTlsCertificateKeyFile: process.env["tlsCertificateKeyFile"],
        mongoTlsCertificateKeyFilePassword: process.env["tlsCertificateKeyFilePassword"],
        mongoW: process.env["w"],
        mongoWtimeoutMS: process.env["wtimeoutMS"],
        mongoSrvMaxHosts: process.env["srvMaxHosts"],
        mongoSrvServiceName: process.env["srvServiceName"],
        mongoAdminDb: process.env["mongoAdminDb"],
        __systemUser: process.env["__systemUser"],
        __systemUserPassword: process.env["__systemUserPassword"],
        internalUser: process.env["internalUser"],
        internalUserPassword: process.env["internalUserPassword"],
        rootUser: process.env["rootUser"],
        rootUserPassword: process.env["rootUserPassword"],
        readAnyDatabaseUser: process.env["readAnyDatabaseUser"],
        readAnyDatabaseUserPassword: process.env["readAnyDatabaseUserPassword"],
        readWriteAnyDatabaseUser: process.env["readWriteAnyDatabaseUser"],
        readWriteAnyDatabaseUserPassword: process.env["readWriteAnyDatabaseUserPassword"],
        userAdminAnyDatabaseUser: process.env["userAdminAnyDatabaseUser"],
        userAdminAnyDatabaseUserPassword: process.env["userAdminAnyDatabaseUserPassword"],
        dbAdminAnyDatabaseUser: process.env["dbAdminAnyDatabaseUser"],
        dbAdminAnyDatabaseUserPassword: process.env["dbAdminAnyDatabaseUserPassword"],
        readUser: process.env["readUser"],
        readUserPassword: process.env["readUserPassword"],
        readWriteUser: process.env["readWriteUser"],
        readWriteUserPassword: process.env["readWriteUserPassword"],
        dbAdminUser: process.env["dbAdminUser"],
        dbAdminUserPassword: process.env["dbAdminUserPassword"],
        userAdminUser: process.env["userAdminUser"],
        userAdminUserPassword: process.env["userAdminUserPassword"],
        dbOwnerUser: process.env["dbOwnerUser"],
        dbOwnerUserPassword: process.env["dbOwnerUserPassword"],
        enableShardingUser: process.env["enableShardingUser"],
        enableShardingUserPassword: process.env["enableShardingUserPassword"],
        clusterAdminUser: process.env["clusterAdminUser"],
        clusterAdminUserPassword: process.env["clusterAdminUserPassword"],
        clusterManagerUser: process.env["clusterManagerUser"],
        clusterManagerUserPassword: process.env["clusterManagerUserPassword"],
        clusterMonitorUser: process.env["clusterMonitorUser"],
        clusterMonitorUserPassword: process.env["clusterMonitorUserPassword"],
        hostManagerUser: process.env["hostManagerUser"],
        hostManagerUserPassword: process.env["hostManagerUserPassword"],
        backupUser: process.env["backupUser"],
        backupUserPassword: process.env["backupUserPassword"],
        restoreUser: process.env["restoreUser"],
        restoreUserPassword: process.env["restoreUserPassword"],
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
        },
        redisUrl: process.env["redisUrl"],
        redisSocket: {
            redisSocketPort: process.env["redisSocketPort"],
            redisSocketHost: process.env["redisSocketHost"],
            redisSocketFamily: process.env["redisSocketFamily"],
            redisSocketPath: process.env["redisSocketPath"],
            redisSocketConnectTimeout: process.env["redisSocketConnectTimeout"],
            redisNoDelay: process.env["redisNoDelay"],
            redisKeepAlive: process.env["redisKeepAlive"],
            redisReconnectStrategy: function (retries) {
                return Math.min(retries * 50, 2000);
            },
            redisTls: { redisTlsRejectUnauthorized: process.env["redisTlsRejectUnauthorized"] }
        },
        redisUsername: process.env["redisUsername"],
        redisPasword: process.env["redisPasword"],
        redisName: process.env["redisName"],
        redisDatabase: process.env["redisDatabase"],
        redisCommandsQueueMaxLength: process.env["redisCommandsQueueMaxLength"],
        redisDisableOfflineQueue: process.env["redisDisableOfflineQueue"],
        redisReadonly: process.env["redisReadonly"],
        redisLegacyMode: process.env["redisLegacyMode"],
        redisIsolationPoolOptions: { min: 0, max: 0 },
        redisPingInterval: process.env["redisPingInterval"]
    };
}
exports.configurations = configurations;
