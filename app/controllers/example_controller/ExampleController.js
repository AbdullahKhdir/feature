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

    firstMethod = () => this.getRouterInstance().get('/get_exmaple', (req, res, next) => {
        res.send('<h1>THIS IS AN EXAMPLE OF A GET REQUEST</h1>');
        res.end();
    });

    secondMethod = () => this.getRouterInstance().post('/post_example', (req, res, next) => {
        this.exmaple_model
            .all()
            .then(([rows, fieldData]) => {
                res.send('<h1>DATA FETCHED FROM EXAMPLE MODEL SUCCESSFULY</h1>');
                res.end();
            })
            .catch(err => console.log(err)); 
    });

    thirdMethod() {
        return this.getRouterInstance().put('/put_example', (req, res, next) => {
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

    fourthMethod() {
        return this.getRouterInstance().patch('/patch_example', (req, res, next) => {
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

    fifthMethod() {
        return this.getRouterInstance().delete('/delete_example', (req, res, next) => {
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

    
    firstDynMethod() {
        return this.getRouterInstance().get('/dynamic/:dynamicInput', (req, res, next) => {
            const dynamicInput = +req.params.dynamicInput ?? false;
            this.exmaple_model.filter(dynamicInput).then(([rows, fields]) => {
                if (rows) {
                    const rows = rows[0];
                    res.render(
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

    secondDynMethod() {
        return this.getRouterInstance().get('/dynamic_two/:dynamicInput', (req, res, next) => {
            const dynamicInput = +req.params.dynamicInput ?? false;
            this.exmaple_model.filter(dynamicInput).then(([rows, fields]) => {
                if (rows) {
                    const rows = rows[0];
                    res.render(
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