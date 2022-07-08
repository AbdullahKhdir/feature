"use strict";

const Routes      = require("../routes/Route");
const Path        = require("../node/Path");
const FileSystem  = require("../node/FileSystem");
const Lodash      = require("../../app/utils/Lodash");
const Application = require("../../app/Application");
const Constants   = require("../../app/utils/Constants");

module.exports = class BaseController extends Routes {
    constructor() {
        super();
        this.path        = Object.assign(new Path().path);
        this.file_system = Object.assign(new FileSystem().fs);
        this._           = Object.assign(new Lodash()._);
    }

    /**
     * @function deployRoutes
     * @description
     * * Will automatically scann the controllers
     * * directory and loop each controller file 
     * * and initiate new instance of each controller
     * * class and loop the methods array for any declared
     * * routes that will be deployed by the app via express
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Application} app
     */
    deployRoutes(app) {
        let directory_routes = this.path.join(__dirname, '..', '..', 'app', 'controllers');
        let methods_array = null;
        this.file_system.readdir(directory_routes, { withFileTypes: true }, (err, files) => {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            
            /*
            * is a directory or is a file
            */
            files.forEach((file) => {
                let is_dir  = file.isDirectory();
                let is_file = file.isFile(); 
                if (is_file) {
                    /*
                     * let content   = this.file_system.readFileSync(directory_routes+'/'+file);
                    */

                    let file_name    = this._.capitalize(file.name.substring(0, file.name.indexOf('js') - 1));
                    let route_name   = require('../../app/controllers/'+file_name+'.js');
                    let instance_of  = new route_name();

                    methods_array    = instance_of.methods;
                    if(methods_array.length > 0) {
                        methods_array.forEach((route) => {
                            eval('app.use(instance_of.'+route+'());');
                        });
                    }
                } else if (is_dir) {
                    let directory_name = file.name;
                    this.file_system.readdir(directory_routes+'/'+file.name, { withFileTypes: true }, (err, files) => {
                        if (err) {
                            return console.log('Unable to scan directory: ' + err);
                        }
                        
                        files.forEach((file) => {
                            let is_file = file.isFile(); 
                            if (is_file) {
                                let file_name    = this._.capitalize(file.name.substring(0, file.name.indexOf('js') - 1));
                                let route_name   = require(
                                    '../../app/controllers/'+directory_name+'/'+file_name+'.js'
                                );
                                let instance_of  = new route_name();
            
                                methods_array    = instance_of.methods;
                                if(methods_array.length > 0) {
                                    methods_array.forEach((route) => {
                                        eval('app.use(instance_of.'+route+'());');
                                    });
                                }
                            }
                        });
                    });
                }
            });
        });
        
        this.undefinedRoutes(app);
    }

    /**
     * @function undefinedRoutes
     * @description
     * * Handles all incoming requests
     * * can be used to issue a requests tests
     * * or parsing or even filtering
     * * all requests will be checked if
     * * thier path is a valid path
     * * if not it will render 404 page
     * * it acceptes all kind of routes with (next())
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Application} app
     */
    undefinedRoutes(app) {
        let site_is_found              = false;
        let is_post_request_successful = false;
        let _constants                 = new Constants().getConstants();
        
        app.use(this.getRouterInstance().get('*', (req, res, next) => {
            let route, routes = [];
            
            app._router.stack.forEach(function(middleware){
                if(middleware.route){ // routes registered directly on the app
                    routes.push(middleware.route);
                } else if(middleware.name === 'router'){ // router middleware 
                    middleware.handle.stack.forEach(function(handler){
                        route = handler.route;
                        route && routes.push(route);
                    });
                }
            });
            
            if (req.path === '/') {
                res.redirect('/shop/');
                res.end();
                return;
            }

            routes.forEach(route => {
                let check_path = req.path.toString().slice(1, req.path.toString().length);
                let direction  = Object.assign(route.path.slice(1, route.path.length));
                
                let predefined_direction_from_route = this._.toLower(direction.toString());
                let requested_path_in_browser       = this._.toLower(check_path.toString());
                
                /*
                * "/route" is same as "/route/"
                */
                if (this._.endsWith(requested_path_in_browser, '/') || this._.endsWith(predefined_direction_from_route, '/')) {
                    requested_path_in_browser       = this._.trimEnd(requested_path_in_browser, '/');
                    predefined_direction_from_route = this._.trimEnd(predefined_direction_from_route, '/');
                }      

                if (predefined_direction_from_route.includes(':')) {
                    const _predefined_direction_from_route = predefined_direction_from_route.substr(0, predefined_direction_from_route.indexOf(':') - 1);
                    const _predefined_direction_from_route_length = _predefined_direction_from_route.length;
                    const _requested_path_in_browser = requested_path_in_browser.substr(0, _predefined_direction_from_route_length);
                    if (_predefined_direction_from_route === _requested_path_in_browser) {
                        site_is_found = true;
                    }
                }
                
                if (predefined_direction_from_route === requested_path_in_browser && route.methods.get) {
                    site_is_found = true;
                }
            });

            if (site_is_found === true) {
                next();
                site_is_found = false;
            } else {
                return this.render(
                    res,
                    '404',
                    {page_title: 'Page not found', path: '/404/'},
                    null,
                    _constants.HTTPS_STATUS.CLIENT_ERRORS.SITE_NOT_FOUND
                );
            }
        }));

        app.use(this.getRouterInstance().post('*', (req, res, next) => {
            let route, routes = [];
            
            app._router.stack.forEach(function(middleware){
                if(middleware.route){ // routes registered directly on the app
                    routes.push(middleware.route);
                } else if(middleware.name === 'router'){ // router middleware 
                    middleware.handle.stack.forEach(function(handler){
                        route = handler.route;
                        route && routes.push(route);
                    });
                }
            });

            routes.forEach(route => {
                let check_path = req.path.toString().slice(1, req.path.toString().length);
                let direction  = Object.assign(route.path.slice(1, route.path.length));
                
                let predefined_direction_from_route = this._.toLower(direction.toString());
                let requested_path_in_browser       = this._.toLower(check_path.toString());
                
                /*
                * "/route" is same as "/route/"
                */
                if (this._.endsWith(requested_path_in_browser, '/') || this._.endsWith(predefined_direction_from_route, '/')) {
                    requested_path_in_browser       = this._.trimEnd(requested_path_in_browser, '/');
                    predefined_direction_from_route = this._.trimEnd(predefined_direction_from_route, '/');
                }

                
                if (predefined_direction_from_route.includes(':')) {
                    const _predefined_direction_from_route = predefined_direction_from_route.substr(0, predefined_direction_from_route.indexOf(':') - 1);
                    const _predefined_direction_from_route_length = _predefined_direction_from_route.length;
                    const _requested_path_in_browser = requested_path_in_browser.substr(0, _predefined_direction_from_route_length);
                    if (_predefined_direction_from_route === _requested_path_in_browser) {
                        is_post_request_successful = true;
                    }
                }
                
                
                if (predefined_direction_from_route === requested_path_in_browser && route.methods.post) {
                    is_post_request_successful = true;
                }
            });

            if (is_post_request_successful === true) {
                next();
                is_post_request_successful = false;
            } else {
                return this.render(
                    res,
                    '404',
                    {page_title: 'Cannot post!', path: '/404/', onPost: 'Route does not support posting requests!'},
                    null,
                    _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR
                );
            }
        }));
    }
}