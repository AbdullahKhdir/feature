'use strict';

const Path = require('../node/Path');

/**
 * @class Workerpool
 * @constructor
 * @description Class Workerpool is used to offload heavy tasks and handle it in an async way 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Workerpool {
    
    pool_proxy;
    constructor(worker_pool = require('workerpool')) {
        let path = new Path().path;
        let options = {
            minWorkers: 'max',
            workerType: 'auto'
        }

        const script = path.join(__dirname, '..', '..', 'app', 'worker', './pool_logic.js');
        
        const pool = worker_pool.pool(script, options);
        this.pool_proxy = pool.proxy();
        // console.log(`Worker Threads Enabled - Min Workers: ${pool.minWorkers} - Max Workers: ${pool.maxWorkers} - Worker Type: ${pool.workerType}`);
    }
}