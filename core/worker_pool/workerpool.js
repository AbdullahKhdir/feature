'use strict'
const worker_pool = require('workerpool')
const Path        = require('path')

let pool_proxy = null
// FUNCTIONS
const init = async (options) => {
    if (typeof options === 'undefined') {
        options = {
            minWorkers: 'max',
            workerType: 'auto'
        }
    }
    const script = Path.join(__dirname, '..', '..', 'app', 'worker', './pool_logic.js');
    console.log(script);
    const pool = worker_pool.pool(script, options);
    pool_proxy = await pool.proxy();
    console.log(`Worker Threads Enabled - Min Workers: ${pool.minWorkers} - Max Workers: ${pool.maxWorkers} - Worker Type: ${pool.workerType}`);
}

const get = () => {
    return pool_proxy
}

// EXPORTS
exports.init = init
exports.get  = get