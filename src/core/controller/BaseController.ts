"use strict";

import { NextFunction, Request, Response } from "express";
import { Express } from "express";
import Routes from "../routes/Route";
import { Singleton } from "../Singleton/Singleton";
import { siteNotFound, undefinedHttpRequest } from "../utils/undefined-routes-logic";
import InternalError from "../error/types/InternalError";

/**
 * @class BaseController
 * @constructor
 * @extends Routes
 * @description
 * Class BaseController is used to define the controllers
 * and deploy all the defined routes in the controller's folder
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class BaseController extends Routes {
	protected path;
	protected fileSystem;

	constructor() {
		super();
		this.path = Singleton.getPath();
		this.fileSystem = Singleton.getPromisifyFileSystem();
	}

	/**
	 * @function deployRoutes
	 * @description register all routes in express router
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Application} app
	 * @return {Promise<void>}
	 */
	async deployRoutes(app: Express): Promise<void> {
		const directoryRoutes = this.path.join(__dirname, "..", "..", "app", "controllers");
		await this.processDirectory(directoryRoutes, app);
		this.undefinedRoutes(app);
	}

	/**
	 * @function processDirectory
	 * @description
	 * * Will automatically scan the controllers
	 * * directory and loop each controller file
	 * * and initiate new instance of each controller
	 * * class and loop the methods array for any declared
	 * * routes that will be deployed by the app via express
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {string} directory
	 * @param {Application} app
	 * @return {Promise<void>}
	 */
	private async processDirectory(directory: string, app: Express): Promise<void> {
		try {
			const files = await this.fileSystem.readdir(directory, { withFileTypes: true });

			for (const file of files) {
				const fullPath = this.path.join(directory, file.name);

				if (file.isDirectory()) {
					await this.processDirectory(fullPath, app);
				}

				if (file.isFile() && file.name.endsWith(".js")) {
					const routePath = fullPath.replace(/\\/g, "/");
					const Controller = require(routePath);
					const instanceOf = new Controller();

					if (this._.isArray(instanceOf.methods) && instanceOf.methods.length > 0) {
						instanceOf.methods.forEach((route: string) => {
							if (typeof instanceOf[route] === "function") {
								app.use(instanceOf[route]());
							}
						});
					}
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				throw new InternalError(error.message);
			}
		}
	}

	/**
	 * @function undefinedRoutes
	 * @description
	 * * Handles all incoming requests
	 * * can be used to issue a requests tests
	 * * or parsing or even filtering
	 * * all requests will be checked if
	 * * their path is a valid path
	 * * if not it will render 404 page
	 * * it acceptes all kind of routes with (next())
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @param {Express} app - The Express application instance.
	 * @return {void}
	 */
	undefinedRoutes(app: Express): void {
		const methods = ["get", "post", "put", "patch", "delete"];
		this._.forEach(methods, (method) => {
			app.use(
				this.route(method, "*", {}, async (req: Request, res: Response, next: NextFunction) => {
					try {
						const routeExists = this.routeExists(req, app, method);

						if (!routeExists) {
							if (this._.get(req, "origin") !== this.constants.SITE_DOMAIN_AND_PORT) {
								return next(undefinedHttpRequest(res, "json"));
							}

							return res
								.status(this.constants.HTTPS_STATUS.CLIENT_ERRORS.NOT_FOUND)
								.render("undefined_routes", siteNotFound(res));
						}

						next();
					} catch (error) {
						next(error);
					}
				})
			);
		});
	}

	/**
	 * @function routeExists
	 * @description Checks if a route exists for the current request and method.
	 * @param {Request} request - The current request object.
	 * @param {Express} app - The Express application instance.
	 * @param {string} method - The HTTP method (get, post, put, etc.).
	 * @return {boolean} - Returns true if the route exists, otherwise false.
	 */
	routeExists(request: Request, app: Express, method: string): boolean {
		const routes: any[] = [];

		this._.forEach(app._router.stack, (middleware: any) => {
			if (middleware.route) {
				const middlewareMethod = this._.get(middleware, `route.methods.${method}`);
				if (middlewareMethod) {
					routes.push(middleware.route);
				}
			} else if (middleware.name === "router") {
				this._.forEach(middleware.handle.stack, (handler: any) => {
					const handlerMethod = this._.get(handler, `route.methods.${method}`);
					if (handler.route && handlerMethod) {
						routes.push(handler.route);
					}
				});
			}
		});

		return this._.some(routes, (route) => this.matchRoutePath(route.path, request.path));
	}

	/**
	 * @function matchRoutePath
	 * @description Matches the current request path with the route path, considering dynamic segments.
	 * @param {string} routePath - The route path defined in the Express app.
	 * @param {string} requestPath - The path from the current request.
	 * @return {boolean} - Returns true if the paths match, considering dynamic routes.
	 */
	matchRoutePath(routePath: string, requestPath: string): boolean {
		const formattedRoutePath = this._.trimEnd(this._.toLower(routePath), "/");
		const formattedRequestPath = this._.trimEnd(this._.toLower(requestPath), "/");

		// Handle dynamic route segments, e.g., "/user/:id"
		if (this._.includes(formattedRoutePath, ":")) {
			const baseRoute = this._.trimEnd(this._.split(formattedRoutePath, ":")[0], "/");
			const baseRequest = this._.join(
				this._.slice(this._.split(formattedRequestPath, "/"), 0, this._.split(baseRoute, "/").length),
				"/"
			);
			return baseRoute === baseRequest;
		}

		// Return true if the formatted paths match
		return formattedRoutePath === formattedRequestPath;
	}
};
