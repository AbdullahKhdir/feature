'use strict';

import { NextFunction, Request, Response, Router } from 'express';
import BaseController from "../../../core/controller/BaseController";

export = class NameWillBeInsertedAutomatically extends BaseController{

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
            'firstMethod',
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
    firstMethod = () => this.route('get', '/get_exmaple', {}, async (req: Request, res: Response, next: NextFunction) => {
        return this.render(
            res,
            'shop/orders',
            {
                nav_title: 'My Orders',
                path : '/orders/',
                orders : []
            }
        );
    });

    //******************\\
    //* DYNAMIC Routes *\\
    //******************\\

    /**
     * @function firstDynMethod
     * @description firstDynMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    firstDynMethod = () => this.route('get', '/dynamic/:firstDynamicInput', this.firstDynMethodMiddleware(), async (req: Request, res: Response, next: NextFunction) => {
    });

    //! **************************** !\\
    //* Process protected functions  *\\
    //! **************************** !\\

    //* ************************* *\\
    //* firstDynMethod Middleware *\\
    //? SHOULD BE PROTECTED       ?\\
    //* ************************* *\\
    protected firstDynMethodMiddleware() {
        return {
            //? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
            //! IMPORTANT THE ORDER MATTERS !\\
            is_authenticated: (req: Request, res: Response, next: NextFunction) => {next()}, //* FIRST CHECK IF THE USER  IS AUTHENTICATED    *\\
        }
    };
}