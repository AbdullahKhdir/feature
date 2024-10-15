"use strict";

//***********************************************************
//* CONTROLLER: Application.ts
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: features/Migrate
//***********************************************************

/*
 * Npm and Node Modules
 */
import Compression from "compression";
import ConnectFlash from "connect-flash";
import CookieParser from "cookie-parser";
import Crypto from "crypto";
import { Express, NextFunction, Request, Response } from "express";
import Helmet from "helmet";
import BaseController from "../core/controller/BaseController";
import { Singleton } from "../core/Singleton/Singleton";
import Locals from "../core/utils/AppLocals.js";
import { reqUtil } from "../core/middlewares/sub_middlewares/requestUtilities";
import cache_control from "../core/middlewares/sub_middlewares/cacheControl";
import { toast } from "../core/middlewares/sub_middlewares/toast";
import morgan_logger from "../core/middlewares/sub_middlewares/morganLogger";
import { ENDPOINTS } from "../core/api/apis_endpoints/endpoints";
import * as config from "../core/config";
import { csrf } from "../core/utils/undefined-routes-logic";
import FileSystem from "../core/node/FileSystem";

/**
 * @class Application
 * @constructor
 * @extends BaseController
 * @description Class Application is used to configure the application and set the main rules of the express server
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
// Todo Install and activate the i18n functionality
export = class Application extends BaseController {
	private static applicationInstance: Application;
	private bodyParser;
	private session;
	protected app;
	private constructor() {
		super();

		/*
		 * Init The Application
		 */
		this.app = this.express.getExpress();
		this.bodyParser = Singleton.getBodyParser();
		this.path = Singleton.getPath();
		this.session = Singleton.getExpressSession();

		this.app.use((req: Request, res: Response, next: NextFunction) => {
			const origin = req.headers.origin || `${req.protocol}://${req.get("host")}`;
			req.origin = origin;
			next();
		});

		/*
            * Sets the following policies
            ? contentSecurityPolicy
            ? crossOriginEmbedderPolicy
            ? crossOriginOpenerPolicy
            ? crossOriginResourcePolicy
            ? dnsPrefetchControl
            ? expectCt
            ? frameguard
            ? hidePoweredBy
            ? hsts
            ? ieNoOpen 
            ? noSniff
            ? originAgentCluster 
            ? permittedCrossDomainPolicies
            ? referrerPolicy
            ? xssFilter
        */
		this.app.use(Helmet.contentSecurityPolicy(this.constants.CONTENT_SECURITY_POLICY));
		this.app.use(Helmet.crossOriginEmbedderPolicy());
		this.app.use(Helmet.crossOriginOpenerPolicy());
		this.app.use(Helmet.crossOriginResourcePolicy());
		this.app.use(Helmet.dnsPrefetchControl());
		this.app.use(Helmet.expectCt());
		this.app.use(Helmet.frameguard(this.constants.FRAME_GUARD));
		this.app.use(Helmet.hidePoweredBy());
		this.app.use(Helmet.hsts());
		this.app.use(Helmet.ieNoOpen());
		this.app.use(Helmet.noSniff());
		this.app.use(Helmet.originAgentCluster());
		this.app.use(Helmet.permittedCrossDomainPolicies());
		this.app.use(Helmet.referrerPolicy());
		this.app.use(Helmet.xssFilter());

		/*
		 * To allow preflight requests on all http(s) methods*\
		 */
		this.app.options("*", this.express.expressCors());

		/*
		 * CORS Configurations
		 */
		this.app.use(this.express.expressCors(this.constants.CORS.CORS_OPTIONS));

		/*
		 * REGISTER COOKIE PARSER
		 */
		this.app.use(CookieParser());

		/*
		 * Middleware To Initiate Mysql Session
		 */
		const secret = Crypto.randomBytes(48).toString("base64");
		this.app.use(
			this.session(
				Object.assign(this.constants.EXPRESS.SESSION_OPTIONS, {
					secret: secret,
					store: Singleton.getDb().initiateSession()
				})
			)
		);

		/*
		 * AUTO ESCAPE JSON
		 * And parse JSON-BODY (API) or ANY DATA TYPE Requests
		 */
		this.app.set("json escape", true);
		this.app.use(this.bodyParser.json());
		this.app.use(this.bodyParser.urlencoded({ extended: true }));

		/*
		 * CSRF Enabled
		 */
		//? Deploying API's endpoints and bypass csrf on requesting these endpoints ?\\
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			if (ENDPOINTS.length > 0) {
				if (
					ENDPOINTS.includes(req.headers.referer || "") ||
					ENDPOINTS.includes(req.originalUrl || "") ||
					ENDPOINTS.includes(req.url || "")
				) {
					return next();
				}
			}

			const isExcluded = FileSystem.getAllSubfolders(this.path.join(__dirname, "..", "app", "public")).some(
				(path) => req.url.startsWith(path)
			);

			if (isExcluded) {
				return next();
			}

			if (!this.constants.CSRF.methods.includes(req.method)) {
				const csrf = Crypto.randomBytes(24).toString("hex");
				req.session["x-csrf-token"] = csrf;
				res.cookie(this.constants.CSRF.cookieHeaderName, csrf, {
					httpOnly: true,
					secure: config.configurations().environment === "production",
					sameSite: "lax"
				});
				res.header(this.constants.CSRF.cookieHeaderName, csrf);
				res.locals["csrf"] = csrf;
				this.app.locals["csrf"] = csrf;
			}
			next();
		});

		/*
		 * Send csrf token on every request along with the authentication status
		 */
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			res.locals["isUserAuthenticated"] = req.session.isUserAuthenticated;
			this.app.locals["isUserAuthenticated"] = req.session.isUserAuthenticated;
			next();
		});

		this.app.use((req: Request, res: Response, next: NextFunction) => {
			if (this.constants.CSRF.methods.includes(req.method)) {
				if (
					ENDPOINTS.length > 0 &&
					(ENDPOINTS.includes(req.headers.referer || "") ||
						ENDPOINTS.includes(req.originalUrl || "") ||
						ENDPOINTS.includes(req.url || ""))
				) {
					return next();
				}

				const requestBodyCsrf = req.body ? req.body["x-csrf-token"] : undefined;
				const requestHeaderCsrf = req.get ? req.get("x-csrf-token") : undefined;
				const requestCsrfFromSession = req.session ? req.session["x-csrf-token"] : undefined;
				const tokenFromClient = requestBodyCsrf || requestHeaderCsrf;

				if (!tokenFromClient || tokenFromClient !== requestCsrfFromSession) {
					return res
						.status(this.constants.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN)
						.render("undefined_routes", csrf(res));
				}
			}

			next();
		});

		/*
		 * Using package compressor
		 */
		this.app.use(Compression());

		/*
		 * Setting Cache-Control Header
		 */
		this.app.use(cache_control);

		/*
		 * Enable Logger
		 */
		this.app.use(morgan_logger);

		/*
		 * Registering Flash
		 */
		this.app.use(ConnectFlash());

		/*
		 * Registering error, warning and success toaster to every template
		 */
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			toast(req, res, next, this.app);
		});

		/*
		 * Middleware for editing and wrapping
		 * query params,
		 * post data and
		 * getting data to templates after getting or posting
		 */
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			reqUtil(req, res, next);
		});

		/*
		 * Middleware To Set Static Public Folder
		 */
		this.app.use(
			this.express.getExpress.static(
				this.path.join(__dirname, "..", "app", "public"),
				this.constants.EXPRESS.STATIC_OPTIONS
			)
		);

		/*
		 * USE EJS TEMPLATE ENGINE (NODE SUPPORTS TWIG)
		 * And specify the templates folder of the view property in express
		 */
		this.app.set("view engine", "ejs");
		this.app.set("views", this.path.join(__dirname, "views"));

		/*
		 * Routes
		 */
		this.app.set("case sensitive routing", false);
		this.app.set("strict routing", false);
		this.deployRoutes(this.app);

		/*
		 * Deploying api's endpoints
		 */
		Singleton.getApis().deployApi(this.app);

		/*
		 * Middleware for saving cookie in the request
		 */
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			const key = Crypto.randomBytes(48).toString("base64");
			req.user_cookie = key;
			next();
		});

		/*
		 * Middleware populating file or files attribute on file upload's request
		 */
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			if (req.isPost()) {
				var upload_object = req.getFormPostedData("upload_object");
				var upload_id = req.getFormPostedData("upload-input-name");
				if (!this._.isEmpty(upload_object) && !this._.isEmpty(upload_id)) {
					upload_object = upload_object.replaceAll("'", '"');
					if (upload_id.includes(",")) {
						upload_id = upload_id.split(",")[1];
					}
					if (upload_object.startsWith("[")) {
						upload_object = `{ "${upload_id}" : ${upload_object}`;
						upload_object = `${upload_object} }`;
						req.files = JSON.parse(upload_object);
					} else {
						req.file = JSON.parse(upload_object);
					}
				}
			}
			next();
		});

		Singleton.getI18n().configure(this.constants.I18N.CONFIGURATION_OPTIONS);

		/*
        * Passing default and helpful properties to all templates
        ? lasts for the life cycle of the application
        */

		this.app.locals = Object.assign(this.app.locals, Locals);
	}

	/**
	 * @function getApp
	 * @description  Getter that gets an instance of the application class
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @return Application Object
	 */
	static get getAppInstance(): Application {
		if (this.applicationInstance) {
			return this.applicationInstance;
		}
		return (this.applicationInstance = new Application());
	}

	get getActiveExpress(): Express {
		return this.app;
	}
};
