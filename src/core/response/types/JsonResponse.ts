'use strict';

import { Response } from 'express';
import { Singleton } from '../../Singleton/Singleton';
import { ExpressResponse } from '../ExpressResponse';

/**
 * @class JsonResponse
 * @constructor
 * @extends Response
 * @description Class JsonResponse is used to send the response as json object
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export =  class JsonResponse extends ExpressResponse {

    protected data: any;
    protected _message: any;
    constructor(message: any, data: any) {
        const _constants = Singleton.getConstants();
        super(_constants.HTTPS_STATUS.SUCCESS.OK, 'OK', message);
        this._message = message;
        this.data    = data;
    }
 
    /**
     * @function sendAsJson
     * @description Sends json response to the client 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param Response res
     * @returns Response
    */
    sendAsJson(res: Response) {
       return super.renderAsJson(res, Object.assign({status_code: Singleton.getConstants().HTTPS_STATUS.SUCCESS.OK}, {message: this.getMessage()}, {data: this.getData()}));
    }

    /**
     * @function getData
     * @description Gets the json data
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Object
    */
    getData() {
        console.log(this.data)
        return this.data;
    }

    /**
     * @function getMessage
     * @description Gets the message
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Object
    */
    getMessage() {
        return this.message;
    }
 }