'use strict';

import workerpool from "workerpool";
import Path from "../node/Path";

/**
 * @class Workerpool
 * @constructor
 * @description Class Workerpool is used to offload heavy tasks and handle it in an async way 
 * The API of workerpool consists of two parts: a function workerpool.pool to create a worker pool, and a function workerpool.worker to create a worker.
    pool
    A workerpool can be created using the function workerpool.pool:

    workerpool.pool([script: string] [, options: Object]) : Pool

    When a script argument is provided, the provided script will be started as a dedicated worker. When no script argument is provided, a default worker is started which can be used to offload functions dynamically via Pool.exec. Note that on node.js, script must be an absolute file path like __dirname + '/myWorker.js'. In a browser environment, script can also be a data URL like 'data:application/javascript;base64,...'. This allows embedding the bundled code of a worker in your main application. See examples/embeddedWorker for a demo.

    The following options are available:

    minWorkers: number | 'max'. The minimum number of workers that must be initialized and kept available. Setting this to 'max' will create maxWorkers default workers (see below).
    maxWorkers: number. The default number of maxWorkers is the number of CPU's minus one. When the number of CPU's could not be determined (for example in older browsers), maxWorkers is set to 3.
    maxQueueSize: number. The maximum number of tasks allowed to be queued. Can be used to prevent running out of memory. If the maximum is exceeded, adding a new task will throw an error. The default value is Infinity.
    workerType: 'auto' | 'web' | 'process' | 'thread'.
    In case of 'auto' (default), workerpool will automatically pick a suitable type of worker: when in a browser environment, 'web' will be used. When in a node.js environment, worker_threads will be used if available (Node.js >= 11.7.0), else child_process will be used.
    In case of 'web', a Web Worker will be used. Only available in a browser environment.
    In case of 'process', child_process will be used. Only available in a node.js environment.
    In case of 'thread', worker_threads will be used. If worker_threads are not available, an error is thrown. Only available in a node.js environment.
    forkArgs: String[]. For process worker type. An array passed as args to child_process.fork
    forkOpts: Object. For process worker type. An object passed as options to child_process.fork. See nodejs documentation for available options.
    onCreateWorker: Function. A callback that is called whenever a worker is being created. It can be used to allocate resources for each worker for example. The callback is passed as argument an object with the following properties:
    forkArgs: String[]: the forkArgs option of this pool
    forkOpts: Object: the forkOpts option of this pool
    script: string: the script option of this pool Optionally, this callback can return an object containing one or more of the above properties. The provided properties will be used to override the Pool properties for the worker being created.
    onTerminateWorker: Function. A callback that is called whenever a worker is being terminated. It can be used to release resources that might have been allocated for this specific worker. The callback is passed as argument an object as described for onCreateWorker, with each property sets with the value for the worker being terminated.
    Important note on 'workerType': when sending and receiving primitive data types (plain JSON) from and to a worker, the different worker types ('web', 'process', 'thread') can be used interchangeably. However, when using more advanced data types like buffers, the API and returned results can vary. In these cases, it is best not to use the 'auto' setting but have a fixed 'workerType' and good unit testing in place.

    A worker pool contains the following functions:

    Pool.exec(method: Function | string, params: Array | null [, options: Object]) : Promise.<*, Error>
    Execute a function on a worker with given arguments.

    When method is a string, a method with this name must exist at the worker and must be registered to make it accessible via the pool. The function will be executed on the worker with given parameters.
    When method is a function, the provided function fn will be stringified, send to the worker, and executed there with the provided parameters. The provided function must be static, it must not depend on variables in a surrounding scope.
    The following options are available:
    on: (payload: any) => void. An event listener, to handle events sent by the worker for this execution. See Events for more details.
    Pool.proxy() : Promise.<Object, Error>
    Create a proxy for the worker pool. The proxy contains a proxy for all methods available on the worker. All methods return promises resolving the methods result.

    Pool.stats() : Object
    Retrieve statistics on workers, and active and pending tasks.

    Returns an object containing the following properties:

    {
    totalWorkers: 0,
    busyWorkers: 0,
    idleWorkers: 0,
    pendingTasks: 0,
    activeTasks: 0
    }
    Pool.terminate([force: boolean [, timeout: number]])

    If parameter force is false (default), workers will finish the tasks they are working on before terminating themselves. Any pending tasks will be rejected with an error 'Pool terminated'. When force is true, all workers are terminated immediately without finishing running tasks. If timeout is provided, worker will be forced to terminate when the timeout expires and the worker has not finished.

    The function Pool.exec and the proxy functions all return a Promise. The promise has the following functions available:

    Promise.then(fn: Function.<result: *>)
    Get the result of the promise once resolve.
    Promise.catch(fn: Function.<error: Error>)
    Get the error of the promise when rejected.
    Promise.cancel()
    A running task can be cancelled. The worker executing the task is enforced to terminate immediately. The promise will be rejected with a Promise.CancellationError.
    Promise.timeout(delay: number)
    Cancel a running task when it is not resolved or rejected within given delay in milliseconds. The timer will start when the task is actually started, not when the task is created and queued. The worker executing the task is enforced to terminate immediately. The promise will be rejected with a Promise.TimeoutError.
    Example usage:

    const workerpool = require('workerpool');

    function add(a, b) {
    return a + b;
    }

    const pool1 = workerpool.pool();

    // offload a function to a worker
    pool1.exec(add, [2, 4])
        .then(function (result) {
        console.log(result); // will output 6
        })
        .catch(function (err) {
        console.error(err);
        });

    // create a dedicated worker
    const pool2 = workerpool.pool(__dirname + '/myWorker.js');

    // supposed myWorker.js contains a function 'fibonacci'
    pool2.exec('fibonacci', [10])
        .then(function (result) {
        console.log(result); // will output 55
        })
        .catch(function (err) {
        console.error(err);
        });

    // create a proxy to myWorker.js
    pool2.proxy()
        .then(function (myWorker) {
        return myWorker.fibonacci(10)
        })
        .then(function (result) {
        console.log(result); // will output 55
        })
        .catch(function (err) {
        console.error(err);
        });

    // create a pool with a specified maximum number of workers
    const pool3 = workerpool.pool({maxWorkers: 7});
    worker
    A worker is constructed as:

    workerpool.worker([methods: Object.<String, Function>])

    Argument methods is optional can can be an object with functions available in the worker. Registered functions will be available via the worker pool.

    Example usage:

    // file myWorker.js
    const workerpool = require('workerpool');

    function add(a, b) {
    return a + b;
    }

    function multiply(a, b) {
    return a * b;
    }

    // create a worker and register functions
    workerpool.worker({
    add: add,
    multiply: multiply
    });
    Asynchronous results can be handled by returning a Promise from a function in the worker:

    // file myWorker.js
    const workerpool = require('workerpool');

    function timeout(delay) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, delay)
    });
    }

    // create a worker and register functions
    workerpool.worker({
    timeout: timeout
    });
    Events
    You can send data back from workers to the pool while the task is being executed using the workerEmit function:

    workerEmit(payload: any)

    This function only works inside a worker and during a task.

    Example:

    // file myWorker.js
    const workerpool = require('workerpool');

    function eventExample(delay) {
    workerpool.workerEmit({
        status: 'in_progress'
    });

    workerpool.workerEmit({
        status: 'complete'
    });
    
    return true;
    }

    // create a worker and register functions
    workerpool.worker({
    eventExample: eventExample
    });
    To receive those events, you can use the on option of the pool exec method:

    pool.exec('eventExample', [], {
    on: function (payload) {
        if (payload.status === 'in_progress') {
        console.log('In progress...');
        } else if (payload.status === 'complete') {
        console.log('Done!');
        }
    }
    })
    Utilities
    Following properties are available for convenience:

    platform: The Javascript platform. Either node or browser
    isMainThread: Whether the code is running in main thread or not (Workers)
    cpus: The number of CPUs/cores available
 * @version 1.0.0
 * @see https://github.com/josdejong/workerpool/tree/master/examples
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Workerpool {
    
    private static workerpool_instance : Workerpool;
    protected worker_pool : workerpool.WorkerPool;
    protected pool_proxy;
    protected script = Path.getPathInstance().join(__dirname, '..', '..', 'app', 'worker', './pool_logic.js');
    protected options : {
        minWorkers: string;
        workerType: string;
    } = {
        minWorkers: 'max',
        workerType: 'auto'
    };

    private constructor(script? : string, options? : object) {
        script = this.script;
        options = this.options;
        this.worker_pool  = workerpool.pool(script, options);
        this.pool_proxy   = this.worker_pool.proxy();
    }

    /**
     * @function getWorkerPoolInstance
     * @description Inits or gives back an instance of the class
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Workerpool
    */
    static getWorkerPoolInstance() : Workerpool {
        if (this.workerpool_instance) {
            return this.workerpool_instance;
        }
        return this.workerpool_instance = new Workerpool();
    }

    /**
     * @function load
     * @description Loads the workerpool proxy
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Promise
    */
    loadProxy() {
        return this.pool_proxy;
    }

    /**
     * @function loadPool
     * @description Loads the workerpool
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Promise
    */
    loadPool() : workerpool.WorkerPool {
        return this.worker_pool;
    }

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
    terminate(force = false, timeout = 0) {
        return this.isInitialized() ? this.worker_pool.terminate(force, timeout) : false;
    }

    /**
     * @function isTerminated
     * @description Checks if the workerpool is terminated
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns boolean
    */
    isTerminated() {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.workers.length === 0 : false;
    }

    /**
     * @function getTotalWorkers
     * @description Gets the number of all workers
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number Stats of the total workers
    */
    getTotalWorkers() {
        return this.isInitialized() ? this.worker_pool.stats().totalWorkers : false;
    }

    /**
     * @function getBusyWorkers
     * @description Gets the number of the busy (currently used) workers
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number Stats of the busy workers
    */
    getBusyWorkers() {
        return this.isInitialized() ? this.worker_pool.stats().busyWorkers : false;
    }

    /**
     * @function getAvailabelWorkers
     * @description Gets the number of the availabel workers
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number Stats of the availabel workers
    */
    getAvailabelWorkers() {
        return this.isInitialized() ? this.worker_pool.stats().idleWorkers : false;
    }

    /**
     * @function getActiveTasks
     * @description Gets the number of the active tasks
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number Stats of the active tasks
    */
    getActiveTasks() {
        return this.isInitialized() ? this.worker_pool.stats().activeTasks : false;
    }

    /**
     * @function getPendingTasks
     * @description Gets the number of the queued tasks
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number Stats of the queued tasks
    */
    getPendingTasks() {
        return this.isInitialized() ? this.worker_pool.stats().pendingTasks : false;
    }

    /**
     * @function getStats
     * @description Gets the status of the workerpool
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Object Stats of the workerpool
    */
    getStats() {
        return this.isInitialized() ? this.worker_pool.stats() : false;
    }

    /**
     * @function getMaxWorkers
     * @description Gets the value of the maxWorkers
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number
    */
    getMaxWorkers() {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.maxWorkers : false;
    }

    /**
     * @function getMinWorkers
     * @description Gets the value of the minWorkers
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number
    */
    getMinWorkers() {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.minWorkers : false;
    }

    /**
     * @function getWorkerType
     * @description Gets the value of the workerType
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns String
    */
    getWorkerType() {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.workerType : false;
    }

    /**
     * @function getDebugPortStart
     * @description Gets the value of the debug port start
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number
    */
    getDebugPortStart() {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.debugPortStart : false;
    }

    /**
     * @function getMaxQueueSize
     * @description Gets the value of the max queue size
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Number
    */
    getMaxQueueSize() {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.maxQueueSize : false;
    }

    /**
     * @function getScriptPath
     * @description Gets the path of the script
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns string
    */
    getScriptPath() {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.script : false;
    }

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
    onCreateWorker(callback: Function) {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.onCreateWorker(callback) : false;
    }

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
    onTerminateWorker(callback: Function) {
        // @ts-ignore
        return this.isInitialized() ? this.worker_pool.onTerminateWorker(callback) : false;
    }

     /**
     * @function isInitialized
     * @description Checks if the workerpool is initialized
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns boolean
    */   
    protected isInitialized() {
        return !!Workerpool.getWorkerPoolInstance();
    }
}