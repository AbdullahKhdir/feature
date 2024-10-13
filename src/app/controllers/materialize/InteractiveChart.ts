//***********************************************************
//* CONTROLLER: InteractiveChart.js
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: develop
//***********************************************************

"use strict";

import { NextFunction, Request, Response } from "express";
import BaseController from "../../../core/controller/BaseController";

export = class InteractiveChart extends BaseController {
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
			"interactiveChart"
			//******************\\
			//* DYNAMIC Routes *\\
			//******************\\
		];
		//*********************\\
		//* PROJECT CONSTANTS *\\
		//*********************\\
		// this.constants
	}

	//**********\\
	//* Routes *\\
	//**********\\

	/**
	 * @function interactiveChart
	 * @description interactiveChart route
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Response
	 */
	interactiveChart = () =>
		this.route(
			"get",
			"/interactive-charts/",
			this.interactiveChartMiddleware(),
			async (req: Request, res: Response, next: NextFunction) => {
				return this.render(res, "materialize/charts/interactive", {
					nav_title: "Interactive Charts",
					path: "interactive-charts",
					root: "charts"
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
	interactiveChartMiddleware() {
		return {
			//? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
			//! IMPORTANT THE ORDER MATTERS !\\
			isUserAuthenticated: (req: Request, res: Response, next: NextFunction) => {
				next();
			} //* FIRST CHECK IF THE USER  IS AUTHENTICATED    *\\
		};
	}
};
