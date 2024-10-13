//***********************************************************
//* CONTROLLER: Header.js
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: develop
//***********************************************************

"use strict";

import { NextFunction, Request, Response } from "express";
import BaseController from "../../../core/controller/BaseController";

export = class Header extends BaseController {
	//*****************************************************************\\
	//? CONSTRUCTOR FOR INITIALIZING ALL THE NECESSARY CONFIGURATIONS ?\\
	//*****************************************************************\\
	public methods: any;
	constructor() {
		super();

		//? ************************************************************** ?\\
		//? this.method is used to deploy all the routes to express router ?\\
		//! dynamic routes must be the last index of the methods array     !\\
		//? ************************************************************** ?\\
		this.methods = [
			//**********\\
			//* Routes *\\
			//**********\\
			"tabbed",
			"metrics",
			"search"
			//******************\\
			//* DYNAMIC Routes *\\
			//******************\\
		];

		//***************\\
		//* INIT MODELS *\\
		//***************\\

		//*********************\\
		//* PROJECT CONSTANTS *\\
		//*********************\\
		// this.constants
	}

	//**********\\
	//* Routes *\\
	//**********\\

	/**
	 * @function tabbed
	 * @description tabbed route
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Response
	 */
	tabbed = () =>
		this.route(
			"get",
			"/header-tabbed",
			this.tabbedMiddleware(),
			async (req: Request, res: Response, next: NextFunction) => {
				return this.render(res, "materialize/header/tabbed", {
					nav_title: "Header Tabbed",
					path: "header-tabbed",
					root: "headers"
				});
			}
		);

	/**
	 * @function metrics
	 * @description metrics route
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Response
	 */
	metrics = () =>
		this.route(
			"get",
			"/header-metrics",
			this.metricsMiddleware(),
			async (req: Request, res: Response, next: NextFunction) => {
				return this.render(res, "materialize/header/metrics", {
					nav_title: "Header Metrics",
					path: "header-metrics",
					root: "headers"
				});
			}
		);

	/**
	 * @function search
	 * @description search route
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Response
	 */
	search = () =>
		this.route(
			"get",
			"/header-search/",
			this.searchMiddleware(),
			async (req: Request, res: Response, next: NextFunction) => {
				return this.render(res, "materialize/header/search", {
					nav_title: "Header Search",
					path: "header-search",
					root: "headers"
				});
			}
		);

	//! **************************** !\\
	//* Process protected functions  *\\
	//! **************************** !\\

	//* ************************* *\\
	//* firstDynMethod Middleware *\\
	//? SHOULD BE PROTECTED       ?\\
	//* ************************* *\\
	tabbedMiddleware() {
		return {
			//? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
			//! IMPORTANT THE ORDER MATTERS !\\
			isUserAuthenticated: (req: Request, res: Response, next: NextFunction) => {
				next();
			} //* FIRST CHECK IF THE USER  IS AUTHENTICATED    *\\
		};
	}
	metricsMiddleware() {
		return {
			//? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
			//! IMPORTANT THE ORDER MATTERS !\\
			isUserAuthenticated: (req: Request, res: Response, next: NextFunction) => {
				next();
			} //* FIRST CHECK IF THE USER  IS AUTHENTICATED    *\\
		};
	}
	searchMiddleware() {
		return {
			//? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
			//! IMPORTANT THE ORDER MATTERS !\\
			isUserAuthenticated: (req: Request, res: Response, next: NextFunction) => {
				next();
			} //* FIRST CHECK IF THE USER  IS AUTHENTICATED    *\\
		};
	}
};
