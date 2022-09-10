'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var workerpool_1 = __importDefault(require("workerpool"));
var Path_1 = __importDefault(require("../node/Path"));
module.exports = /** @class */ (function () {
    function Workerpool(script, options) {
        this.script = Path_1.default.getPathInstance().join(__dirname, '..', '..', 'app', 'worker', './pool_logic.js');
        this.options = {
            minWorkers: 'max',
            workerType: 'auto'
        };
        script = this.script;
        options = this.options;
        this.worker_pool = workerpool_1.default.pool(script, options);
        this.pool_proxy = this.worker_pool.proxy();
    }
    /**
     * @function getWorkerPoolInstance
     * @description Inits or gives back an instance of the class
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Workerpool
    */
    Workerpool.getWorkerPoolInstance = function () {
        if (this.workerpool_instance) {
            return this.workerpool_instance;
        }
        return this.workerpool_instance = new Workerpool();
    };
    /**
     * @function load
     * @description Loads the workerpool proxy
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Promise
    */
    Workerpool.prototype.loadProxy = function () {
        return this.pool_proxy;
    };
    /**
     * @function loadPool
     * @description Loads the workerpool
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Promise
    */
    Workerpool.prototype.loadPool = function () {
        return this.worker_pool;
    };
    /**
     * @function terminate
     * @description
     * If parameter force is false (default), workers will finish the tasks they are working on before terminating themselves.
     * When force is true, all workers are terminated immediately without finishing running tasks.
     * If timeout is provided, worker will be forced to terminat when the timeout expires and the worker has not finished.
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Boolean} force
     * @param {Number} timeout
     * @returns Promise
    */
    Workerpool.prototype.terminate = function (force, timeout) {
        if (force === void 0) { force = false; }
        if (timeout === void 0) { timeout = 0; }
        return this.isInitialized() ? this.worker_pool.terminate(force, timeout) : false;
    };
    /**
     * @function isTerminated
     * @description Checks if the workerpool is terminated
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns boolean
    */
    Workerpool.prototype.isTerminated = function () {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.workers.length === 0 : false;
    };
    /**
     * @function getTotalWorkers
     * @description Gets the number of all workers
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number Stats of the total workers
    */
    Workerpool.prototype.getTotalWorkers = function () {
        return this.isInitialized() ? this.worker_pool.stats().totalWorkers : false;
    };
    /**
     * @function getBusyWorkers
     * @description Gets the number of the busy (currently used) workers
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number Stats of the busy workers
    */
    Workerpool.prototype.getBusyWorkers = function () {
        return this.isInitialized() ? this.worker_pool.stats().busyWorkers : false;
    };
    /**
     * @function getAvailabelWorkers
     * @description Gets the number of the availabel workers
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number Stats of the availabel workers
    */
    Workerpool.prototype.getAvailabelWorkers = function () {
        return this.isInitialized() ? this.worker_pool.stats().idleWorkers : false;
    };
    /**
     * @function getActiveTasks
     * @description Gets the number of the active tasks
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number Stats of the active tasks
    */
    Workerpool.prototype.getActiveTasks = function () {
        return this.isInitialized() ? this.worker_pool.stats().activeTasks : false;
    };
    /**
     * @function getPendingTasks
     * @description Gets the number of the queued tasks
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number Stats of the queued tasks
    */
    Workerpool.prototype.getPendingTasks = function () {
        return this.isInitialized() ? this.worker_pool.stats().pendingTasks : false;
    };
    /**
     * @function getStats
     * @description Gets the status of the workerpool
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Object Stats of the workerpool
    */
    Workerpool.prototype.getStats = function () {
        return this.isInitialized() ? this.worker_pool.stats() : false;
    };
    /**
     * @function getMaxWorkers
     * @description Gets the value of the maxWorkers
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number
    */
    Workerpool.prototype.getMaxWorkers = function () {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.maxWorkers : false;
    };
    /**
     * @function getMinWorkers
     * @description Gets the value of the minWorkers
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number
    */
    Workerpool.prototype.getMinWorkers = function () {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.minWorkers : false;
    };
    /**
     * @function getWorkerType
     * @description Gets the value of the workerType
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns String
    */
    Workerpool.prototype.getWorkerType = function () {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.workerType : false;
    };
    /**
     * @function getDebugPortStart
     * @description Gets the value of the debug port start
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number
    */
    Workerpool.prototype.getDebugPortStart = function () {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.debugPortStart : false;
    };
    /**
     * @function getMaxQueueSize
     * @description Gets the value of the max queue size
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number
    */
    Workerpool.prototype.getMaxQueueSize = function () {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.maxQueueSize : false;
    };
    /**
     * @function getScriptPath
     * @description Gets the path of the script
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns string
    */
    Workerpool.prototype.getScriptPath = function () {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.script : false;
    };
    /**
     * @function onCreateWorker
     * @description
     * A callback that is called whenever a worker is being created. It can be used to allocate resources for each worker for example.
     * The callback is passed as argument an object with the following properties:
     * forkArgs: String[]: the forkArgs option of this pool
     * forkOpts: Object: the forkOpts option of this pool
     * script: string: the script option of this pool Optionally, this callback can return an object containing one or more of the above properties.
     * The provided properties will be used to override the Pool properties for the worker being created.
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Object} callback
     * @returns void
    */
    Workerpool.prototype.onCreateWorker = function (callback) {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.onCreateWorker(callback) : false;
    };
    /**
     * @function onTerminateWorker
     * @description
     * A callback that is called whenever a worker is being terminated.
     * It can be used to release resources that might have been allocated for this specific worker.
     * The callback is passed as argument an object as described for onCreateWorker,
     * with each property sets with the value for the worker being terminated.
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Object} callback
     * @returns void
    */
    Workerpool.prototype.onTerminateWorker = function (callback) {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.onTerminateWorker(callback) : false;
    };
    /**
    * @function isInitialized
    * @description Checks if the workerpool is initialized
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @returns boolean
   */
    Workerpool.prototype.isInitialized = function () {
        return !!Workerpool.getWorkerPoolInstance();
    };
    return Workerpool;
}());
