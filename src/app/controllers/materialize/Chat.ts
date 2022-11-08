//***********************************************************
//* CONTROLLER: Chat.js
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: develop
//***********************************************************

'use strict';

import { NextFunction, Request, Response } from 'express';
import BaseController from "../../../core/controller/BaseController";
import is_auth from '../../middlewares/is_auth';

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
        // todo usage of socket.io from calling it from singleton to enables it and listen on a port and activate sending responding messages
        // todo Implementation in Singleton and calling it here.
        // todo The same instance will be called more than once from different locations to render the stats of who is online and offline
        // todo On opening a user's chat there will be another call for the instance to retrieve messages from that selected in user's chat.
        
        return this.render(
            res,
            'materialize/pages/chat',
            {
                nav_title: 'Chat',
                path: '/chat/',
                success: res.locals['success'],
                root: 'chat',
                breadcrumbs: [
                    {
                        title: 'Socials',
                        url: '/'
                    },
                    {
                        title: 'Chat',
                        url: '/chat/'
                    }
                ]
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
            is_authenticated: is_auth, //* FIRST CHECK IF THE USER  IS AUTHENTICATED    *\\
        }
    };
}
