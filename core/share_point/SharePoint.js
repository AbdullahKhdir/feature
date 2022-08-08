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
    
    worker_methods;
    constructor() {
        super();
        const worker = new Workerpool();
        this.worker_methods = worker.pool_proxy;
        this.worker_pool    = worker.worker_pool;
    }
}