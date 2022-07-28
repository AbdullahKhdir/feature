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


// CREATE WORKERS
WorkerPool.worker({
    index
})

exports.index = index