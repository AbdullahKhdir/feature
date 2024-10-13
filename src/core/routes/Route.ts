"use strict";

import { ENDPOINTS } from "../api/apis_endpoints/endpoints";
import RuntimeException from "../exception/types/RuntimeException";
import { ExpressResponse } from "../response/ExpressResponse";
import asyncHandler from "../utils/Promise";
import { Request, Router } from "express";

/**
 * @class Routes
 * @constructor
 * @description Class Routes is used to define the routes Object and set the configurations
 * @version 1.0.0
 */
export = class Routes extends ExpressResponse {
	protected router: Router;
	protected corsOptions;

	constructor() {
		super();
		this.router = this.initializeRouter();
		this.corsOptions = this.initializeCorsOptions();
	}

	initializeRouter() {
		const options = {
			caseSensitive: false, // Do not treat "/Foo" and "/foo" as the same.
			mergeParams: true, // Preserve req.params values from the parent router.
			strict: false // Enable strict routing.
		};
		return this.express.getExpress.Router(options);
	}

	initializeCorsOptions() {
		return {
			origin: "https://localhost:8010.com",
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			preflightContinue: false,
			maxAge: 86400,
			allowedHeaders: ["Content-Type", "Authorization"],
			optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
		};
	}

	/**
	 * @function Route
	 * @description  Initiate new route
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {String} method
	 * @param {String} url
	 * @param {Object} middleware
	 * @param {Function} callback
	 * @return {ExpressRoute}
	 */
	route(method: string, url: string, middleware: any, callback: Function, is_api_endpoint: boolean = false): any {
		if (!method || !url || typeof callback !== "function") {
			throw new RuntimeException("Invalid route configuration: Missing method, url, or callback");
		}

		let routeMiddleware = [];
		for (const key in middleware) {
			if (Object.hasOwnProperty.call(middleware, key)) {
				routeMiddleware.push(middleware[key]);
			}
		}

		if (is_api_endpoint) {
			ENDPOINTS.push(url);
		}

		const validMethods = ["get", "post", "put", "patch", "delete"];
		const lowerMethod = method.toLowerCase();

		if (validMethods.includes(lowerMethod)) {
			if (typeof callback !== "function") {
				throw new RuntimeException(`Callback is not a function for route ${url}`);
			}

			return (this.router as any)[lowerMethod](url, routeMiddleware, asyncHandler(callback as any));
		} else {
			throw new RuntimeException(`Invalid HTTP method: ${method}`);
		}
	}

	/**
	 * @function isApiEndpoint
	 * @description Check if the URL matches any string from the API endpoints array
	 * @version 1.0.0
	 * @param {Request} req
	 * @return {boolean}
	 */
	isApiEndpoint(req: Request): boolean {
		const referrer = req.headers.referer || "";
		const url = req.originalUrl || req.url || "";

		return ENDPOINTS.includes(referrer) || ENDPOINTS.includes(url);
	}
};
