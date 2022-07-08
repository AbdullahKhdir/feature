'use strict';

const { Request, Response, NextFunction } = require('express');
 
/**
 * @class AsyncHandler
 * @constructor
 * @description Better Promise Management
    The callback is replaced by Promises and now the Promise chain is replaced by the async/await.
    This greatly enhances the coding experience.
    One problem with this implementation is to write the ugly try/catch block.
    In order to give it sugar, I have created a middleware function asyncHandler.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Promise {
    
    constructor() {
    }

    static asyncFunction = (request = Request, response = Response, next = NextFunction) => new Promise();
    static asyncHandler  = (execution = AsyncHandler.asyncFunction) => (req = Request, res = Response, next = NextFunction) => {
        execution(req, res, next).catch(next);
    };
}