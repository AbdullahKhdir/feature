//***********************************************************
//* CONTROLLER: Chat.ts
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: features/Migrate
//***********************************************************

'use strict';

import { NextFunction, Request, Response } from 'express';
import BaseController from "../../../core/controller/BaseController";
import is_auth from '../../middlewares/is_auth';
import _Chat from '../../models/chat/Chat';
import Websockets from '../../../core/socket/Websockets';

export = class Chat extends BaseController {

    //*****************************************************************\\
    //? CONSTRUCTOR FOR INITIALIZING ALL THE NECESSARY CONFIGURATIONS ?\\
    //*****************************************************************\\
    public    methods: any;
    public    chat: _Chat;
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
            '_chat',
            //******************\\
            //* DYNAMIC Routes *\\
            //******************\\
        ];

        //***************\\
        //* INIT MODELS *\\
        //***************\\
        this.chat = new _Chat();        

        //*********************\\
        //* PROJECT CONSTANTS *\\
        //*********************\\
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
    _chat = () => this.route('get','/chat/', this.chatMiddleware(), async (req: Request, res: Response, next: NextFunction) => {
        // todo dive deep in the protocol of web socket        
        //**************************\\
        //* OPEN SOCKET FOR CLIENT *\\
        //**************************\\
        Websockets.run(req);

        //******************************\\
        //* RENDER TEMPLATE FOR CLIENT *\\
        //******************************\\
        return res.render(
            'materialize/pages/chat',
            {
                nav_title: 'Chat',
                path: '/chat/',
                success: res.locals['success'],
                root: 'chat',
                breadcrumbs: [
                    {
                        title: 'Home',
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
