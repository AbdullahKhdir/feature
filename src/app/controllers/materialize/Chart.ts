//***********************************************************
//* CONTROLLER: Chart.js
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: develop
//***********************************************************

"use strict";

import { NextFunction, Request, Response } from "express";
import { check } from "express-validator"; //? EXPRESS VALIDATOR ?\\
import BaseController from "../../../core/controller/BaseController";

export = class Chart extends BaseController {
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
			"fixedCharts"
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
	 * @function fixedCharts
	 * @description fixedCharts route
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Response
	 */
	fixedCharts = () =>
		this.route(
			"get",
			"/fixed-chart/",
			this.fixedChartsMiddleware(),
			async (req: Request, res: Response, next: NextFunction) => {
				return this.render(res, "materialize/pages/fixed-chart", {
					nav_title: "Fixed Chart",
					path: "fixed-chart",
					root: "pages"
				});
			}
		);

	//******************\\
	//* DYNAMIC Routes *\\
	//******************\\

	//! **************************** !\\
	//* Process protected functions  *\\
	//! **************************** !\\

	//* *************************        *\\
	//* fixedChartsMiddleware Middleware *\\
	//? SHOULD BE PROTECTED              ?\\
	//* *************************        *\\
	fixedChartsMiddleware() {
		return {
			//? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
			//! IMPORTANT THE ORDER MATTERS !\\
			isUserAuthenticated: (req: Request, res: Response, next: NextFunction) => {
				next();
			}, //* FIRST CHECK IF THE USER  IS AUTHENTICATED    *\\
			validate: check("firstDynamicInput") //* SECOND VALIDATE BODY, PARAM COOKIE OR HEADER *\\
				.isEmpty()
				.bail()
				.withMessage("Dynamic param must not be empty!")
		};
	}
};
