// @ts-nocheck
'use strict';

import { NextFunction, Request, Response, Router } from 'express';
// @ts-ignore 
import BaseController from "../../../core/controller/BaseController";

import {
    check
} from "express-validator"; //? EXPRESS VALIDATOR ?\\
import ExampleModel from '../models/example_model/ExampleModel';

export = class NameWillBeInsertedAutomaticall extends BaseController{

    //*****************************************************************\\
    //? CONSTRUCTOR FOR INITIALIZING ALL THE NECESSARY CONFIGURATIONS ?\\
    //*****************************************************************\\
    public methods: any;
    protected exmaple_model: ExampleModel;
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
        // this.constants
        this.exmaple_model = new ExampleModel();
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
    firstMethod = (): Router => this.route('get', '/get_exmaple', {}, async (req: Request, res: Response, next: NextFunction) => {
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
    firstDynMethod = (): Router => this.route('get', '/dynamic/:firstDynamicInput', this.firstDynMethodMiddleware(), async (req: Request, res: Response, next: NextFunction) => {
            const dynamicInput = +req.getDynamicParam('dynamicInput') ?? false;
            this.exmaple_model.filter(dynamicInput)
            // @ts-ignore 
            .then(([rows, fields]) => {
                if (rows) {
                    // @ts-ignore 
                    const rows = rows[0];
                    return this.render(
                        res,
                        'example/index',
                        {
                            nav_title: rows ?? 'Dynamic route',
                            path: '/dynamic/',
                            product: rows
                        }
                    );
                }
            })
            .catch((err: any) => this.onError(res, err));
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
            validate: check('firstDynamicInput')            //* SECOND VALIDATE BODY, PARAM COOKIE OR HEADER *\\
                      .isEmpty()
                      .bail()
                      .withMessage('Dynamic param must not be empty!')
        }
    };
}