import WebSockets from "socket.io";
import multer from "multer";
import Application from "../../app/Application";
import PDFDocument from "../../app/plugins/PDFDocument";
import Uploader from "../../app/plugins/Uploader";
import Constants from "../../app/utils/Constants";
import Lodash from "../../app/utils/Lodash";
import { uploader_config_options, uploader_options } from "../../core/utils/data_typs";
import Api from "../api/Api";
import Db from "../database/Database";
import { Express } from "../framework/Express";
import BodyParser from "../node/Bodyparser";
import FileSystem from "../node/FileSystem";
import Path from "../node/Path";
import Pagination from "../utils/Pagination";
import Workerpool from "../worker_pool/workerpool";
import I18next from "../../app/plugins/I18next";
import { promises as fsPromises } from "fs";
import ExpressSession from "../framework/ExpressSession";
import mysql from "mysql2/promise";
import MongoDb from "../database/MongoDb";
import * as config from "../config";
import Redis from "../redis/Redis";
import { RedisClientOptions } from "redis";

/**
 * @class Singleton
 * @constructor
 * @description
 * Class Singleton is used to get instances of all singleton classes and plugins
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export class Singleton {
	private static instance: Singleton;
	private static io_instance: any;
	private static apis: Api;
	private constructor() {}

	//*******************************\\
	//* Pagination getter functions *\\
	//*******************************\\
	public static getPagination(): Pagination {
		return Pagination.getPagination();
	}

	//*****************************\\
	//* Database getter functions *\\
	//*****************************\\
	public static getDb(): Db {
		return Db.getDbInstance();
	}

	public static getDbSession(): typeof import("mysql2/promise") {
		return Db.getDbInstance().getMysqlInstance;
	}

	//**************************************************\\
	//* API getter function *\\
	//**************************************************\\
	public static getApis() {
		if (this.apis) {
			return this.apis;
		}
		return (this.apis = new Api());
	}

	public static getRedisInstance(
		options: RedisClientOptions = {
			url: config.configurations().redisUrl,
			socket: {
				port: config.configurations().redisSocket.redisSocketPort,
				host: config.configurations().redisSocket.redisSocketHost,
				keepAlive: config.configurations().redisSocket.redisKeepAlive,
				noDelay: config.configurations().redisSocket.redisNoDelay,
				reconnectStrategy: (retries) => Math.min(retries * 50, 2000)
			},
			database: config.configurations().redisDatabase,
			disableOfflineQueue: config.configurations().redisDisableOfflineQueue
		}
	) {
		return Redis.getRedisInstance(options);
	}

	//**************************************************\\
	//* Database and Express Sessions getter functions *\\
	//**************************************************\\
	public static getExpressSession() {
		if (!ExpressSession.expressSession) {
			new ExpressSession();
		}

		return ExpressSession.expressSession;
	}

	public static getMysqlStore() {
		return this.getDb().getMysqlStore;
	}

	/**
	 * @function getTransaction
	 * @version 1.0.0
	 * @description initializes the connection object to have connection object
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns {Promise<PoolConnection>}
	 */
	public static get pool(): mysql.Pool {
		return Singleton.getDb().pool;
	}

	//****************************\\
	//* Express getter functions *\\
	//****************************\\
	public static getExpress(): Express {
		return Express.getExpressInstance();
	}

	public static getWorkerPool(): Workerpool {
		return Express.getExpressInstance().getWorkerPool();
	}

	//*******************************\\
	//* Application getter function *\\
	//*******************************\\
	public static getApplication(): Application {
		return Application.getAppInstance;
	}

	public static getExpressApp() {
		return Application.getAppInstance.getActiveExpress;
	}

	//**************************\\
	//* Lodash getter function *\\
	//**************************\\
	public static getLodash(): typeof import("lodash") {
		return Lodash.getLodashInstance();
	}

	//***************************\\
	//* I18next getter function *\\
	//***************************\\
	public static getI18n(): typeof import("i18n") {
		return I18next.getI18nextInstance();
	}

	//*****************************\\
	//* Constants getter function *\\
	//*****************************\\
	public static getConstants() {
		return Constants.getConstantsInstance();
	}

	public static getConstantsInstance() {
		return Constants.instance();
	}

	public static getMongoDbInstance(
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
	) {
		return MongoDb.getInstance(username, dbName, serverApi);
	}

	//************************\\
	//* Path getter function *\\
	//************************\\
	public static getPath(): typeof import("path") {
		return Path.getPathInstance();
	}

	//************************\\
	//* Path getter function *\\
	//************************\\
	public static getUploader(): typeof multer {
		return Uploader.getUploaderInstance().getMulter;
	}

	public static configUploader(
		options: uploader_config_options,
		instance: typeof import("multer") = Singleton.getUploader()
	): multer.Multer | undefined {
		return Uploader.getUploaderInstance().configureUploader(options, instance);
	}

	public static buildUploader(options: uploader_options) {
		return Uploader.getUploaderInstance()._buildUploader(options);
	}

	public static asyncUploader(req: Request, res: Response, uploader: any) {
		return Uploader.getUploaderInstance().asyncUpload(req, res, uploader);
	}

	//******************************\\
	//* FileSystem getter function *\\
	//******************************\\
	public static getPromisifyFileSystem(): typeof fsPromises {
		return FileSystem.getPromisifyFileSystemInstance();
	}

	public static getFileSystem(): typeof import("fs") {
		return FileSystem.getFileSystemInstance();
	}

	//******************************\\
	//* BodyParser getter function *\\
	//******************************\\
	public static getBodyParser(): typeof import("body-parser") {
		return BodyParser.getBodyParserInstance();
	}

	//******************************\\
	//* Singleton getter function *\\
	//******************************\\
	static get getSingletonInstance(): Singleton {
		if (this.instance) {
			return this.instance;
		}
		return (this.instance = new Singleton());
	}

	//******************************\\
	//* Model getter function      *\\
	//******************************\\
	static getModel(model_name: string) {
		if (model_name) {
			var Model = null;
			if (model_name === "ExampleModel") {
				Model = require("../../app/models/example_model/" + model_name);
			} else {
				Model = require("../../app/models/shop/" + model_name);
			}
			if (Model) {
				return new Model();
			}
		}
		return;
	}

	//*******************************\\
	//* Server getter function      *\\
	//*******************************\\
	static setSocket(server: any) {
		if (this.io_instance) {
			return this.io_instance;
		}
		return (this.io_instance = new WebSockets.Server(server));
	}

	//*******************************\\
	//* PDFDocument getter function *\\
	//*******************************\\
	static getPdfMaker() {
		return PDFDocument.getPDFDocumentInstance().getPdfKit;
	}
}
