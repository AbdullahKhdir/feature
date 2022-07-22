'use strict';

const BaseController = require("../../../core/controller/BaseController");
const ExampleModel = require("../../models/example_model/ExampleModel");

module.exports = class ExampleController extends BaseController{
    constructor() {
        super();
        /**
        * ! DYNAMIC ROUTES MUST BE THE LAST INDEX OF THE METHODS ARRAY
        */
        this.methods = [
            'firstMethod',
            'secondMethod',
            'thirdMethod',
            'fourthMethod',
            'fifthMethod',
             /*
             * AT LAST WE DEFINE THE DYNAMIC METHODS
             */
            'firstDynMethod'
        ];
        this.exmaple_model = new ExampleModel();
    }

    /**
     * @function firstMethod
     * @description firstMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    firstMethod = () => this._().get('/get_exmaple', (req, res, next) => {
        res.send('<h1>THIS IS AN EXAMPLE OF A GET REQUEST</h1>');
        res.end();
    });

    /**
     * @function secondMethod
     * @description secondMethod route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    secondMethod = () => this._().post('/post_example', (req, res, next) => {
        this.exmaple_model
            .all()
            .then(([rows, fieldData]) => {
                res.send('<h1>DATA FETCHED FROM EXAMPLE MODEL SUCCESSFULY</h1>');
                res.end();
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
        return this._().put('/put_example', (req, res, next) => {
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
                    res.redirect('/get_example');
                    res.end();
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
        return this._().patch('/patch_example', (req, res, next) => {
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
                    res.redirect('/get_example');
                    res.end();
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
        return this._().delete('/delete_example', (req, res, next) => {
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
                    res.redirect('/get_example');
                    res.end();
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
        return this._().get('/dynamic/:dynamicInput', (req, res, next) => {
            const dynamicInput = +req.params.dynamicInput ?? false;
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
        return this._().get('/dynamic_two/:dynamicInput', (req, res, next) => {
            const dynamicInput = +req.params.dynamicInput ?? false;
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
}