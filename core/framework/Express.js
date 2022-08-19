'use strict';


const Workerpool = require("../worker_pool/workerpool");

/**
 * @class Express
 * @constructor
 * @description Class Express to define and initiate the express framework 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Express {
    constructor(framework = require('express')) {
        // return framework;
        this.framework = framework;
        this.cors      = require('cors');
    }

    /**
     * @function getWorkerPool
     * @description Returns an instance of the workerpool
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Workerpool
    */
    getWorkerPool() {
        return new Workerpool();
    }
}