'use strict';

import Workerpool from "../worker_pool/workerpool";

import cors from "cors";
import express from "express";

/**
 * @class Express
 * @constructor
 * @description Class Express to define and initiate the express framework 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export class Express {

    private static express_instance: Express;
    private framework;
    public  express_cors;
    private constructor() {
        this.framework = express;
        this.express_cors = cors;
    }

    static getExpressInstance() : Express{
        if (this.express_instance) {
            return this.express_instance
        }
        return this.express_instance = new Express()
    }

    get getExpress() {
        return this.framework;
    }

    /**
     * @function getWorkerPool
     * @description Returns an instance of the workerpool
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Workerpool
    */
    getWorkerPool() : Workerpool {
        return Workerpool.getWorkerPoolInstance();
    }
}