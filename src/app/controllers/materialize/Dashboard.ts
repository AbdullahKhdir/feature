//***********************************************************
//* CONTROLLER: Dashboard.js
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: develop
//***********************************************************

'use strict';

import { NextFunction, Request, Response } from 'express';
import BaseController from "../../../core/controller/BaseController";

export = class Dashboard extends BaseController{

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
            'dashboard',
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
     * @function firstMethod
     * @description firstMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    dashboard = () => this.route('get', '/dashboard/', this.dashboardMiddleware(), async (req: Request, res: Response, next: NextFunction) => {
        return this.render(
            res,
            'materialize/pages/dashboard',
            {
                page_title: 'Dashboard',
                nav_title: 'Home',
                path: 'dashboard',
                root: 'pages'
            }
        );
    });

    //! **************************** !\\
    //* Process protected functions  *\\
    //! **************************** !\\

    //* ************************* *\\
    //* dashboardMiddleware Middleware *\\
    //? SHOULD BE PROTECTED       ?\\
    //* ************************* *\\
    dashboardMiddleware() {
        return {
            //? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
            //! IMPORTANT THE ORDER MATTERS !\\
            
            //* FIRST CHECK IF THE USER  IS AUTHENTICATED    *\\
            is_authenticated: (req: Request, res: Response, next: NextFunction) => {next()},

            //* SECOND VALIDATE BODY, PARAM COOKIE OR HEADER *\\
        }
    };
}
