'use strict';
/*
* Npm and Node Modules 
*/
const Bodyparser      = require('../core/node/Bodyparser.js');
const Path            = require('../core/node/Path.js');
const BaseController  = require('../core/controller/BaseController.js');
const Constants       = require('./utils/Constants.js');
const Lodash          = require('./utils/Lodash.js');
const Helmet          = require("helmet");
const BadRequestError = require('../core/error/types/BadRequestError.js');

module.exports = class Application extends BaseController {

    #app;
    constructor(app) {
        super();

        if (typeof this.app !== 'undefined') {
            return this.getApp();
        }
        
        this.body_parser    = new Bodyparser().body_parse;
        this.path           = new Path().path;
        this.constants      = Object.assign(new Constants());
        this.sub_controller = this;
        this._              = new Lodash()._; 

        /*
        * Init The Application
        */
        app = this.express();
        
        /*
        * Sets the follwing policies
          ! contentSecurityPolicy
          ! crossOriginEmbedderPolicy
          ! crossOriginOpenerPolicy
          ! crossOriginResourcePolicy
          ! dnsPrefetchControl
          ! expectCt
          ! frameguard
          ! hidePoweredBy
          ! hsts
          ! ieNoOpen 
          ! noSniff
          ! originAgentCluster 
          ! permittedCrossDomainPolicies
          ! referrerPolicy
          ! xssFilter
        */
        app.use(Helmet.contentSecurityPolicy());
        app.use(Helmet.crossOriginEmbedderPolicy());
        app.use(Helmet.crossOriginOpenerPolicy());
        app.use(Helmet.crossOriginResourcePolicy());
        app.use(Helmet.dnsPrefetchControl());
        app.use(Helmet.expectCt());
        app.use(Helmet.frameguard());
        app.use(Helmet.hidePoweredBy());
        app.use(Helmet.hsts());
        app.use(Helmet.ieNoOpen());
        app.use(Helmet.noSniff());
        app.use(Helmet.originAgentCluster());
        app.use(Helmet.permittedCrossDomainPolicies());
        app.use(Helmet.referrerPolicy());
        app.use(Helmet.xssFilter());


        /*
        * DISABLE CORS
        */
        const corsOptions = {
            origin: false,
        }

        app.use(this.cors(corsOptions));

        /*
        * AUTO ESCAPE JSON
        */
        app.set('json escape', true);
       
        /*
        * USE EJS TEMPLATE ENGINE (NODE SUPPORTS TWIG)
        */
        app.set('view engine', 'ejs');

        /*
        * Specify the templates folder of the view property in express 
        */
        app.set('views', 'app/views');

        /*
        * Parse JSON-BODY or ANY DATA TYPE Requests
        */
        app.use(this.body_parser.json());
        app.use(this.body_parser.urlencoded({extended: true}));
        

        /*
        * Middleware To Set Static Public Folder
        */
        const options = {
            dotfiles: 'ignore',
            etag: true,
            extensions: ['ejs'],
            fallthrough: true,
            immutable: true,
            index: false,
            maxAge: '1d',
            redirect: false,
            setHeaders: function (res, path, stat) {
                res.set('x-timestamp', Date.now())
            }
        }
        app.use(this.express.static(this.path.join(__dirname, 'public'), options));

        /*
        * Middleware To Always Get The First User
        */
       app.use((req, res, next) => {
            const User = require('./models/shop/User');
            let user_model = new User();
            user_model.get({name: 'Abdullah'})
            .then(rows => {
                if (!this._.isEmpty(rows)) {
                    req.registered_user = rows[0];
                    req.registered_user.getCart = function () {
                        let Cart = require('../app/models/shop/Cart');
                        let cart_model = new Cart();
                        return cart_model.filter({user_id: req.registered_user.id});
                    };
                    req.registered_user.getProducts = function () {
                        let Product = require('../app/models/shop/Product');
                        let product_model = new Product();
                        return product_model.filter({user_id: req.registered_user.id});
                    }
                    next();
                } else {
                    throw new BadRequestError('User not registered');
                }
            })
            .catch(err => console.log(err));
       });
        
        /*
        * Routes 
        */
        this.sub_controller.deployRoutes(app);

        this.#app = app;
    }

    /**
     * @function getApp
     * @description  gets an instance of the application class
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @return Application Object
     */
    getApp() {
        return this.#app;
    }

    /**
     * @function getConstants
     * @description  gets an instance of the constants class
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @return Constants Object
     */
    getConstants() {
        return this.constants;
    }
}



