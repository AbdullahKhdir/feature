'use strict';

import { NextFunction, Request, Response, Router } from 'express';
import BaseController                              from "../../../core/controller/BaseController";
import {check}                                     from "express-validator";
import JsonResponse from '../../../core/response/types/JsonResponse';

export = class Rest extends BaseController {

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
            'getExmaple',
            'postExmaple',
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
        // this.exmaple_model = new ExampleModel();
    }

    //**********\\
    //* Routes *\\
    //**********\\

    /**
     * @function getExmaple
     * @description getExmaple route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    getExmaple = (): Router => this.route('get', '/get_exmaple/', {}, async (req: Request, res: Response, next: NextFunction) => {
        return new JsonResponse(200, 'Success', {success: 'OK'}).sendAsJson(res);
    });

    /**
     * @function postExmaple
     * @description postExmaple route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postExmaple = (): Router => this.route('post', '/get_exmaple/', {}, async (req: Request, res: Response, next: NextFunction) => {
        const token = req.csrfToken(); 
        res.setHeader('x-xsrf-token', token);
        res.setHeader('xsrf-token', token);
        res.setHeader('x-csrf-token', token);
        res.setHeader('csrf-Token', token)
        res.setHeader('X-CSRF-TOKEN', token);
        return new JsonResponse(201, 'Success', {success: 'OK', id: new Date()}).sendAsJson(res);
    });
    
    protected firstDynMethodMiddleware() {
        return {
            //? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
            //! IMPORTANT THE ORDER MATTERS !\\
            is_authenticated: (req: Request, res: Response, next: NextFunction) => {next()}, //* FIRST CHECK IF THE USER  IS AUTHENTICATED    *\\
            validate: check('firstDynamicInput')                                             //* SECOND VALIDATE BODY, PARAM COOKIE OR HEADER *\\
                      .isEmpty()
                      .bail()
                      .withMessage('Dynamic param must not be empty!')
        }
    };
}