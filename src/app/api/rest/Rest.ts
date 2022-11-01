'use strict';

import { NextFunction, Request, Response, Router } from 'express';
import BaseController                              from "../../../core/controller/BaseController";
import {check}                                     from "express-validator";
import JsonResponse                                from '../../../core/response/types/JsonResponse';
import SQLException from '../../../core/exception/types/SQLException';

/*
 ! The partner system of the api must be registered in the cors configs 
 ! so that partner client reaches the api's endpoints 
*/
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
            'patchExmaple',
            'putExmaple',
            'deleteExmaple',
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
    getExmaple = () => this.route('get', '/get_example/', {}, async (req: Request, res: Response, next: NextFunction) => {
        // return this.onError(res, next, 'declined api endpoint post');
        // return next(new Error('declined api endpoint get'));
        return new JsonResponse(200, 'Success got', {success: 'OK'}).sendAsJson(res);
    });

    /**
     * @function postExmaple
     * @description postExmaple route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postExmaple = () => this.route('post', '/post_example', {}, async (req: Request, res: Response, next: NextFunction) => {
        return new JsonResponse(201, 'Success posted', {success: 'OK', id: new Date()}).sendAsJson(res);
    });

    /**
     * @function patchExmaple
     * @description patchExmaple route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    patchExmaple = () => this.route('patch', '/patch_example/', {}, async (req: Request, res: Response, next: NextFunction) => {
        return new JsonResponse(201, 'Success patched', {success: 'OK', id: new Date()}).sendAsJson(res);
    });

    /**
     * @function putExmaple
     * @description putExmaple route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    putExmaple = () => this.route('put', '/put_example/', {}, async (req: Request, res: Response, next: NextFunction) => {
        return new JsonResponse(201, 'Success put', {success: 'OK', id: new Date()}).sendAsJson(res);
    });

    /**
     * @function deleteExmaple
     * @description deleteExmaple route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    deleteExmaple = () => this.route('delete', '/delete_example/', {}, async (req: Request, res: Response, next: NextFunction) => {
        return new JsonResponse(200, 'Success deleted', {success: 'OK', id: new Date()}).sendAsJson(res);
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