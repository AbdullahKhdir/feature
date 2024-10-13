//***********************************************************
//* CONTROLLER: BarChart.js
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: develop
//***********************************************************

"use strict";

import { NextFunction, Request, Response } from "express";
import { check } from "express-validator"; //? EXPRESS VALIDATOR ?\\
import BaseController from "../../../core/controller/BaseController";

export = class BarChart extends BaseController {
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
			"barChart"
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
	 * @function barChart
	 * @description barChart route
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Response
	 */
	barChart = () =>
		this.route("get", "/bar-charts/", {}, async (req: Request, res: Response, next: NextFunction) => {
			return this.render(res, "materialize/charts/bar", {
				nav_title: "Bar Charts",
				path: "bar-charts",
				root: "charts"
			});
		});

	//******************\\
	//* DYNAMIC Routes *\\
	//******************\\

	//! **************************** !\\
	//* Process protected functions  *\\
	//! **************************** !\\

	//* ************************* *\\
	//* firstDynMethod Middleware *\\
	//? SHOULD BE PROTECTED       ?\\
	//* ************************* *\\
	firstDynMethodMiddleware() {
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
