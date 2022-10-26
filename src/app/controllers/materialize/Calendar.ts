//***********************************************************
//* CONTROLLER: Calendar.js
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: develop
//***********************************************************

'use strict';

import { NextFunction, Request, Response } from 'express';
import BaseController from "../../../core/controller/BaseController";

export = class Calendar extends BaseController{

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
            'calendar',
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
     * @function calendar
     * @description calendar route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    calendar = () => this.route('get', '/calendar/', this.calendarMiddleware(), async (req: Request, res: Response, next: NextFunction) => {
        return this.render(
            res,
            'materialize/calendar/calendar',
            {
                nav_title: 'Calendar',
                path: 'calendar',
                root: 'calendar'
            }
        );
    });

    //! **************************** !\\
    //* Process protected functions  *\\
    //! **************************** !\\

    //* ************************* *\\
    //* firstDynMethod Middleware *\\
    //? SHOULD BE PROTECTED       ?\\
    //* ************************* *\\
    calendarMiddleware() {
        return {
            //? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
            //! IMPORTANT THE ORDER MATTERS !\\
            is_authenticated: (req: Request, res: Response, next: NextFunction) => {next()}, //* FIRST CHECK IF THE USER  IS AUTHENTICATED    *\\
        }
    };
}
