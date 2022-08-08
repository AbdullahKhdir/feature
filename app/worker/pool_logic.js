'use strict'

const Promise    = require("../../core/utils/Promise");
const WorkerPool = require('workerpool')

// MIDDLEWARE FUNCTION
const index = (obj) => Promise.asyncHandler(async (req, res, next,) => {
    const user_products = req.session.currentUser.getProducts();
    user_products
        .then((rows) => {
            return obj.render(
                res,
                'shop/index',
                {
                    products: rows ?? [],
                    page_title: 'Shop',
                    path: '/',
                    lodash: obj.__
                }
            );
        })
        .catch(err => console.log(err)); 
});

const logger = () => {
    const number = 100;
    let n1 = 0, n2 = 1, nextTerm;

    console.log('Fibonacci Series:');

    for (let i = 1; i <= number; i++) {
        nextTerm = n1 + n2;
        n1 = n2;
        n2 = nextTerm;
    }
    console.log(n1);
};


// CREATE WORKERS
WorkerPool.worker({
    logger
})

exports.index = index