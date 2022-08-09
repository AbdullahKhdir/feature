'use strict';

const ApiResponse               = require("../response/ApiResponse");
const Workerpool = require("../worker_pool/workerpool");

/**
 * @class SharePoint
 * @constructor
 * @description Class SharePoint is used to share all required classes between the express framework 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class SharePoint extends ApiResponse {
    
    constructor() {
        super();
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