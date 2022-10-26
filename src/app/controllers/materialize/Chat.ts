//***********************************************************
//* CONTROLLER: Chat.js
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: develop
//***********************************************************

'use strict';

import { NextFunction, Request, Response } from 'express';
import BaseController from "../../../core/controller/BaseController";

export = class Chat extends BaseController{

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
            'chat',
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
     * @function chat
     * @description chat route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    chat = () => this.route('get', '/chat/', this.chatMiddleware(), async (req: Request, res: Response, next: NextFunction) => {
        return this.render(
            res,
            'materialize/pages/chat',
            {
                nav_title: 'Chat',
                path: 'chat',
                root: 'pages'
            }
        );
    });

    //! **************************** !\\
    //* Process protected functions  *\\
    //! **************************** !\\

    //* ************************* *\\
    //* chatMiddleware Middleware *\\
    //? SHOULD BE PROTECTED       ?\\
    //* ************************* *\\
    chatMiddleware() {
        return {
            //? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
            //! IMPORTANT THE ORDER MATTERS !\\
            is_authenticated: (req: Request, res: Response, next: NextFunction) => {next()}, //* FIRST CHECK IF THE USER  IS AUTHENTICATED    *\\
        }
    };
}
