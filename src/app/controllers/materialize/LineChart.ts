//***********************************************************
//* CONTROLLER: LinecChart.js
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: develop
//***********************************************************

'use strict';

import { NextFunction, Request, Response } from 'express';
import BaseController from "../../../core/controller/BaseController";

export = class LineChart extends BaseController{

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
            'line',
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
     * @function line
     * @description line route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    line = () => this.route('get', '/line-charts/', this.lineMiddleware(), async (req: Request, res: Response, next: NextFunction) => {
        return this.render(
            res,
            'materialize/charts/line',
            {
                nav_title: 'Line Charts',
                path: 'line-charts',
                root: 'charts'
            }
        );
    });

    //! **************************** !\\
    //* Process protected functions  *\\
    //! **************************** !\\

    //* ************************* *\\
    //* lineMiddleware Middleware *\\
    //? SHOULD BE PROTECTED       ?\\
    //* ************************* *\\
    lineMiddleware() {
        return {
            //? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
            //! IMPORTANT THE ORDER MATTERS !\\
            is_authenticated: (req: Request, res: Response, next: NextFunction) => {next()}, //* FIRST CHECK IF THE USER  IS AUTHENTICATED    *\\
        }
    };
}
