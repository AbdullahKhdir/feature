//***********************************************************
//* CONTROLLER: DoughnutChart.js
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: develop
//***********************************************************

'use strict';

import { NextFunction, Request, Response } from 'express';
import {
    check
} from "express-validator"; //? EXPRESS VALIDATOR ?\\
import BaseController from "../../../core/controller/BaseController";
import ExampleModel from '../../models/example_model/ExampleModel';

export = class DoughnutChart extends BaseController{

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
            'doughnutChart',
            //******************\\
            //* DYNAMIC Routes *\\
            //******************\\
        ];

        //***************\\
        //* INIT MODELS *\\
        //***************\\
        this.exmaple_model = new ExampleModel();
        

        //*********************\\
        //* PROJECT CONSTANTS *\\
        //*********************\\
        // this.constants
    }

    //**********\\
    //* Routes *\\
    //**********\\

    /**
     * @function doughnutChart
     * @description doughnutChart route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    doughnutChart = () => this.route('get', '/doughnut-charts/', {}, async (req: Request, res: Response, next: NextFunction) => {
        return this.render(
            res,
            'materialize/charts/doughnut',
            {
                nav_title: 'Doughnut Charts',
                path: 'doughnut-charts',
                root: 'charts'
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
            const dynamicInput = +req.getDynamicParam('dynamicInput') || false;
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
                            nav_title: rows || 'Dynamic route',
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
    firstDynMethodMiddleware() {
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
