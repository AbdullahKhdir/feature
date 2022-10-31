//***********************************************************
//* CONTROLLER: LeageOfLegends.js
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: develop
//***********************************************************

'use strict';

import EventEmitter from 'events';
import { NextFunction, Request, Response, Router } from 'express';
import {
    body
} from "express-validator"; //? EXPRESS VALIDATOR ?\\
import fs from 'fs';
import https from 'https';
import { authenticate, createHttp1Request, createWebSocketConnection } from 'league-connect';
import path from 'path';
import { WebSocketServer } from 'ws';
import BaseController from "../../../core/controller/BaseController";
import JsonResponse from "../../../core/response/types/JsonResponse";
// @ts-ignore 
const fetch = (...args: any) => import('node-fetch')
                            .then(({ default: fetch }) => fetch.apply(null, args));
const event = new EventEmitter();

export = class LeageOfLegends extends BaseController{

    //*****************************************************************\\
    //? CONSTRUCTOR FOR INITIALIZING ALL THE NECESSARY CONFIGURATIONS ?\\
    //*****************************************************************\\

    protected BASE_URI: string   ="https://127.0.0.1:2999";
    protected LIVE_EVENT: string ="/liveclientdata/eventdata";
    protected get_options: any   = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type':'application/json'
        },
        agent: new https.Agent({
            ca: fs.readFileSync(path.join(__dirname, '..', '..', '..', 'certificates', 'LOL', 'riotgames.pem'), 'utf-8')
        })
    };
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
            'getSummonerInfos',
            'leagueLoginIn',
            'leagueOnConnect',
            'corsTest',
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

    corsTest = () => this.route('get', '/cors/', {}, async (req: Request, res: Response, next: NextFunction) => {
        return new JsonResponse(200, 'Success', {status: 'checked'}).sendAsJson(res);
    });

    /**
     * @function getSummonerInfos
     * @description getSummonerInfos route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns JsonResponse
    */
    getSummonerInfos = () => this.route('get', '/bySummonerName/:summonerName/', this.getSummonerInfosMiddleware(), async (req: Request, res: Response, next: NextFunction) => {
        const summoner_name = req.getDynamicParam('summonerName');
        const response = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner_name}`, {
            method: 'get',
            headers: {"X-Riot-Token": "RGAPI-40cea3f7-477d-4a5e-a801-af6a601addfc"}
        });
        const data = await response.json();
        return new JsonResponse(200, 'Fetched successfully', data).sendAsJson(res);
    });

    leagueLoginIn = () => this.route('get', '/league-connect/', {}, async (req: Request, res: Response, next: NextFunction) => {
        return this.render(
            res,
            'LOL/login',
            {
                nav_title: 'Live In Game Events',
                path: 'league-connect',
                root: 'league'
            }
        );
    });

    leagueOnConnect = () => this.route('POST', '/league-connect/', this.getSummonerInfosMiddleware(), async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }

        let credentials: any = null;
        let game_Started = false;
        event.on('onStart', () => {
            console.log('Getting Live Events!')
            const wss = new WebSocketServer({port: 9290});
            let interval: any;
            wss.on('close', function close(ws: any) {
                console.log('ws closing!')
                clearInterval(interval);
            });
            wss.on('connection', (ws) => {
                interval = setInterval(() => {
                    let _credentials: any = authenticate({
                        awaitConnection: true,
                        pollInterval: 5000,
                    })
                    .then(result => {
                        const in_game: any = createHttp1Request({
                            method: 'GET',
                            url: '/lol-gameflow/v1/gameflow-phase'
                        }, result)
                        .then(result => {
                            // @ts-ignore 
                            if (result.__raw !== '"None"') {
                                game_Started = true;
                                const data = this.get(this.LIVE_EVENT);
                                data.then(result => {
                                    ws.send(JSON.stringify(result));
                                })
                                .catch(err => err);
                            }
                        })
                        .catch(err => err)
                    })
                    .catch(err => err);
                }, 2000)
            });
        });

        credentials = authenticate({
            awaitConnection: true,
            pollInterval: 5000,
        }).then(result => {
            (async () => {
                event.emit('onStart');
                // @ts-ignore 
                const ws = await createWebSocketConnection(result)
                ws.on('open', (ws: any) => {
                    console.log('ws started...')
                    // Subscribe to any websocket event
                    // console.log(message)
                    // ws.on('connection', (stream) => {
                    //     console.log('someone connected!');
                    //     console.log(stream)
                    // });
                }); 
            })();
        })
        .catch(err => this.onError(res, next, err));
    });


    //! **************************** !\\
    //* Process protected functions  *\\
    //! **************************** !\\

    protected get = (endpoint: any, options = this.get_options) => {
        return (async () => {
            const response = await fetch(`${this.BASE_URI}${endpoint}`, options)
            return await response.json();
        })();
    }

    //* ************************* *\\
    //* firstDynMethod Middleware *\\
    //? SHOULD BE PROTECTED       ?\\
    //* ************************* *\\
    getSummonerInfosMiddleware() {
        return {
            //? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
            //! IMPORTANT THE ORDER MATTERS !\\
            validate_username: body('username').isString().withMessage('Username and password must not be empty!').bail(),
            validate_password: body('password').isString().withMessage('Username and password must not be empty!').bail()
        }
    };
}
