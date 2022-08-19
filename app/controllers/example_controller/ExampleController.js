'use strict';

const BaseController = require("../../../core/controller/BaseController");
const ExampleModel = require("../../models/example_model/ExampleModel");

module.exports = class ExampleController extends BaseController{
    constructor() {
        super();
        /**
        * ! DYNAMIC ROUTES MUST BE THE LAST INDEX OF THE METHODS ARRAY
        * ? UNCOMMENT THE ELEMENTS IN THE ARRAY TO DEPLOY THE ROUTES
        */
        this.methods = [
            // 'firstMethod',
            // 'secondMethod',
            // 'thirdMethod',
            // 'fourthMethod',
            // 'fifthMethod',
            // 'workerPool',
            // 'workerEmit',
             /*
             * AT LAST WE DEFINE THE DYNAMIC METHODS
             */
            // 'firstDynMethod'
        ];
        this.exmaple_model = new ExampleModel();

        /*
        * Init Workerpool
        */
        this.worker = this.getWorkerPool();
    }

    /**
     * @function firstMethod
     * @description firstMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    firstMethod = () => this.route('get', '/get_exmaple', {}, async (req, res, next) => {
        return this.send(res, '<h1>THIS IS AN EXAMPLE OF A GET REQUEST</h1>');
    });

    /**
     * @function secondMethod
     * @description secondMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    secondMethod = () => this.route('post', '/post_example', {}, async (req, res, next) => {
        this.exmaple_model
            .all()
            .then(([rows, fieldData]) => {
                return this.send(res, '<h1>DATA FETCHED FROM EXAMPLE MODEL SUCCESSFULY</h1>');
            })
            .catch(err => console.log(err)); 
    });

    /**
     * @function thirdMethod
     * @description thirdMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    thirdMethod() {
        return this.route('put', '/put_example', {}, async (req, res, next) => {
            this.exmaple_model
                .all()
                .then(([rows, fieldData]) => {
                    if (rows) {
                        const rows = rows[0];
                        const id = rows['id'];
                        this.exmaple_model.update(id)
                            .then(() => {
                                console.log('RECORD UPDATED :)');
                            })
                            .catch(err => console.log(err));
                    }
                    return this.redirect(res, '/get_example');
                })
                .catch(err => console.log(err));
        });
    }

    /**
     * @function fourthMethod
     * @description fourthMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    fourthMethod() {
        return this.route('patch', '/patch_example', {}, async (req, res, next) => {
            this.exmaple_model
                .all()
                .then(([rows, fieldData]) => {
                    if (rows) {
                        const rows = rows[0];
                        const id = rows['id'];
                        this.exmaple_model.update(id)
                            .then(() => {
                                console.log('RECORD UPDATED :)');
                            })
                            .catch(err => console.log(err));
                    }
                    return this.redirect(res, '/get_example');
                })
                .catch(err => console.log(err));
        });
    }

    /**
     * @function fifthMethod
     * @description fifthMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    fifthMethod() {
        return this.route('delete', '/delete_example', {}, async (req, res, next) => {
            this.exmaple_model
                .all()
                .then(([rows, fieldData]) => {
                    if (rows) {
                        const rows = rows[0];
                        const id = rows['id'];
                        this.exmaple_model.delete(id)
                            .then(() => {
                                console.log('RECORD DELETED :)');
                            })
                            .catch(err => console.log(err));
                    }
                    return this.redirect(res, '/get_example');
                })
                .catch(err => console.log(err));
        });
    }

    /**
     * @function firstDynMethod
     * @description firstDynMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    firstDynMethod() {
        return this.route('get', '/dynamic/:dynamicInput', {}, async (req, res, next) => {
            const dynamicInput = +req.getDynamicParam('dynamicInput') ?? false;
            this.exmaple_model.filter(dynamicInput).then(([rows, fields]) => {
                if (rows) {
                    const rows = rows[0];
                    return this.render(
                        res,
                        'example/index',
                        {
                            page_title: rows ?? 'Dynamic route',
                            path: '/dynamic/',
                            product: rows
                        }
                    );
                }
            })
            .catch((err) => {
                throw err
            });
        });
    }

    /**
     * @function secondDynMethod
     * @description secondDynMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    secondDynMethod() {
        return this.route('get', '/dynamic_two/:dynamicInput', {}, async (req, res, next) => {
            const dynamicInput = +req.getDynamicParam('dynamicInput') ?? false;
            this.exmaple_model.filter(dynamicInput).then(([rows, fields]) => {
                if (rows) {
                    const rows = rows[0];
                    return this.render(
                        res,
                        'example/index',
                        {
                            page_title: rows ?? 'Dynamic route',
                            path: '/dynamic/',
                            product: rows
                        }
                    );
                }
            })
            .catch((err) => {
                throw err
            });
        });
    }

    /**
     * @function workerPool
     * @description workerPool function offloads heavy tasks to be executed by the cpu
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    workerPool() {
        return this.route('get', '/workerpool/', {}, async (req, res, next) => {
            /*
            * Workerpool example
            */
            this.worker.loadProxy()
                .then(methods => {
                    return methods.exampleLogger(100);
                })
                .then(result => {
                    console.log(result)
                    return result;
                })
                .catch(err => {
                    console.error(err);
                })
                .then((result) => {
                    res.status(200).send('<h1>Worker Pool In Progress</h1><br><p>'+result+'</p>');
                    res.end();
                    console.log('Terminating');
                    this.worker.terminate();
                    console.log('is terminated ?: ', this.worker.isTerminated());
                });
        });
    }

    /**
     * @function workerEmit
     * @description 
     * workerEmit function offloads heavy tasks to be executed
     * by the cpu with the usage of status or state
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    workerEmit() {
        return this.route('get', '/workeremit/', {}, async (req, res, next) => {
            /*
             * workerEmit event Exampel 
             */
            this.worker.loadPool().exec('exampleLoggerWithEvent', [101], {
                on: function (payload) {
                    if (payload.status === 'in_progress') {
                        console.log(payload)
                        console.log('In progress...');
                    } else if (payload.status === 'complete') {
                        console.log('Done!');
                    }
                }
            }).then(result => {
                console.log(result);
                return result
            }).catch(err => {
                console.log(err)
            }).then(result => {
                res.status(200).send('<h1>Worker Emit In Progress</h1><br><p>'+result+'</p>');
                res.end();
                console.log('Terminating');
                this.worker.terminate();
                console.log('is terminated ?: ', this.worker.isTerminated());
            });
        });
    }
}