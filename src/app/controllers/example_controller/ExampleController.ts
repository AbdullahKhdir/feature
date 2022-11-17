//***********************************************************
//* CONTROLLER: ExampleController.ts
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: features/Migrate
//***********************************************************

'use strict';

import { NextFunction, Request, Response } from 'express';
import BaseController from "../../../core/controller/BaseController";
import WorkerPool from "../../../core/worker_pool/workerpool";
import ExampleModel from "../../models/example_model/ExampleModel";

import {
    check
} from "express-validator"; //? EXPRESS VALIDATOR ?\\

module.exports = class ExampleController extends BaseController{

    //*****************************************************************\\
    //? CONSTRUCTOR FOR INITIALISING ALL THE NECESSARY CONFIGURATIONS ?\\
    //*****************************************************************\\
    public methods: any;
    protected exmaple_model: ExampleModel;
    protected worker: WorkerPool;
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
            // 'firstMethod',
            // 'secondMethod',
            // 'thirdMethod',
            // 'fourthMethod',
            // 'fifthMethod',
            // 'workerPool',
            // 'workerEmit',
            //******************\\
            //* DYNAMIC Routes *\\
            //******************\\
            // 'firstDynMethod'
        ];

        //**********************\\
        //* INIT EXAMPLE MODEL *\\
        //**********************\\
        this.exmaple_model = new ExampleModel();

        //*********************\\
        //* PROJECT CONSTANTS *\\
        //*********************\\
        // this.constants

        //***************************\\
        //* INITIALISING WORKERPOOL *\\
        //***************************\\
        this.worker = this.express.getWorkerPool();
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
        return this.send(res, '<h1>THIS IS AN EXAMPLE OF A GET REQUEST</h1>');
    });

    /**
     * @function secondMethod
     * @description secondMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    secondMethod = () => this.route('post', '/post_example', {}, async (req: Request, res: Response, next: NextFunction) => {
        this.exmaple_model
            .all()
            // @ts-ignore 
            .then(([rows, fieldData]) => {
                return this.send(res, '<h1>DATA FETCHED FROM EXAMPLE MODEL SUCCESSFULY</h1>');
            })
            .catch((err: any) => this.onError(res, next, err));
    });

    /**
     * @function thirdMethod
     * @description thirdMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    thirdMethod = () => this.route('put', '/put_example', {}, async (req: Request, res: Response, next: NextFunction) => {
        this.exmaple_model
            .all()
            // @ts-ignore 
            .then(([rows, fieldData]) => {
                if (rows) {
                    // @ts-ignore 
                    const rows = rows[0];
                    const id = rows['id'];
                    this.exmaple_model.update(id)
                    // @ts-ignore 
                        .then(() => {
                            console.log('RECORD UPDATED :)');
                        })
                        .catch((err: any) => this.onError(res, next, err));
                }
                return this.redirect(res, '/get_example');
            })
            .catch((err: any) => this.onError(res, next, err));
    });

    /**
     * @function fourthMethod
     * @description fourthMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    fourthMethod = () => this.route('patch', '/patch_example', {}, async (req: Request, res: Response, next: NextFunction) => {
        this.exmaple_model
            .all()
            // @ts-ignore 
            .then(([rows, fieldData]) => {
                if (rows) {
                    // @ts-ignore 
                    const rows = rows[0];
                    const id = rows['id'];
                    this.exmaple_model.update(id)
                        // @ts-ignore 
                        .then(() => {
                            console.log('RECORD UPDATED :)');
                        })
                        .catch((err: any) => this.onError(res, next, err));
                }
                return this.redirect(res, '/get_example');
            })
            .catch((err: any) => this.onError(res, next, err));
    });

    /**
     * @function fifthMethod
     * @description fifthMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    fifthMethod = () => this.route('delete', '/delete_example', {}, async (req: Request, res: Response, next: NextFunction) => {
        this.exmaple_model
            .all()
            // @ts-ignore 
            .then(([rows, fieldData]) => {
                if (rows) {
                    // @ts-ignore 
                    const rows = rows[0];
                    const id = rows['id'];
                    this.exmaple_model.delete(id)
                        // @ts-ignore 
                        .then(() => {
                            console.log('RECORD DELETED :)');
                        })
                        .catch((err: any) => this.onError(res, next, err));
                }
                return this.redirect(res, '/get_example');
            })
            .catch((err: any) => this.onError(res, next, err));
    });

    /**
     * @function workerPool
     * @description workerPool function offloads heavy tasks to be executed by the cpu
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    workerPool = () => this.route('get', '/workerpool/', {}, async (req: Request, res: Response, next: NextFunction) => {
        /*
        * Workerpool example
        */
        this.worker.loadProxy()
            .then(methods => {
                // @ts-ignore 
                return methods.exampleLogger(100);
            })
            .then(result => {
                console.log(result)
                return result;
            })
            .catch(err => this.onError(res, next, err))
            .then((result) => {
                res.status(200).send('<h1>Worker Pool In Progress</h1><br><p>'+result+'</p>');
                res.end();
                console.log('Terminating');
                this.worker.terminate();
                console.log('is terminated ?: ', this.worker.isTerminated());
            })
            .catch(err => this.onError(res, next, err));;
    });
    
    /**
     * @function workerEmit
     * @description 
     * workerEmit function offloads heavy tasks to be executed
     * by the cpu with the usage of status or state
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    workerEmit = () => this.route('get', '/workeremit/', {}, async (req: Request, res: Response, next: NextFunction) => {
        /*
        * workerEmit event Exampel 
        */
        this.worker.loadPool().exec('exampleLoggerWithEvent', [101], {
            on: function (payload) {
                if (payload.status === 'in_progress') {
                    console.log(payload)
                    console.log('In progress...');
                } else if (payload.status === 'complete') {
                    console.log('Done!');
                }
            }
        }).then(result => {
            console.log(result);
            return result
        }).catch(err => this.onError(res, next, err))
        .then(result => {
            res.status(200).send('<h1>Worker Emit In Progress</h1><br><p>'+result+'</p>');
            res.end();
            console.log('Terminating');
            this.worker.terminate();
            console.log('is terminated ?: ', this.worker.isTerminated());
        })
        .catch(err => this.onError(res, next, err));;
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
            // @ts-ignore 
            this.exmaple_model.filter(dynamicInput).then(([rows, fields]) => {
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
            .catch((err: any) => this.onError(res, next, err));
    });

    /**
     * @function secondDynMethod
     * @description secondDynMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    secondDynMethod = () => this.route('get', '/dynamic_two/:secondDynamicInput', this.secondDynMethodMiddleware(), async (req: Request, res: Response, next: NextFunction) => {
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
        .catch((err: any) => this.onError(res, next, err));
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

    protected secondDynMethodMiddleware = () => ({
        //? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
        //! IMPORTANT THE ORDER MATTERS !\\
        is_authenticated: (req: Request, res: Response, next: NextFunction) => {next()}, //* FIRST CHECK IF THE USER IS AUTHENTICATED     *\\
        validate: check('secondDynamicInput')           //* SECOND VALIDATE BODY, PARAM COOKIE OR HEADER *\\
                    .isEmpty()
                    .bail()
                    .withMessage('Dynamic param must not be empty!')
    });
}