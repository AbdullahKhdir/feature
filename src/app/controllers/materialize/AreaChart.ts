//***********************************************************
//* CONTROLLER: AreaChart.js
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: develop
//***********************************************************

"use strict";

import { NextFunction, Request, Response } from "express";
import BaseController from "../../../core/controller/BaseController";

export = class AreaChart extends BaseController {
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
			"areaChart"
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
	 * @function areaChart
	 * @description areaChart route
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Response
	 */
	areaChart = () =>
		this.route("get", "/area-charts/", {}, async (req: Request, res: Response, next: NextFunction) => {
			return this.render(res, "materialize/charts/area", {
				nav_title: "Area Charts",
				path: "area-charts",
				root: "charts"
			});
		});

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
			} //* FIRST CHECK IF THE USER  IS AUTHENTICATED    *\\
		};
	}
};
