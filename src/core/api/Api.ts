"use strict";

import Constants from '../../app/utils/Constants';
import { Express } from '../framework/Express';
import Routes from "../routes/Route";
import { Singleton } from "../Singleton/Singleton";

/**
 * @class Api
 * @constructor
 * @extends Routes
 * @description 
 * Class Api is used to define the api 
 * and deploy all the defined endpoints in the api's class
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Api extends Routes {
    
    protected path;
    protected file_system;
    protected readonly constants;
    constructor() {
        super();
        this.path        = Singleton.getPath();
        this.file_system = Singleton.getFileSystem();
        this.constants   = Singleton.getConstants();
    }

    /**
     * @function deployApi
     * @description
     * * Will automatically scan the api
     * * directory and loop each api file 
     * * and initiate new instance of each api
     * * class and loop the methods array for any declared
     * * endpoints that will be deployed by the app via express
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Application} app
     * @return void
     */
    deployApi(app: Express) {
        Singleton.getConstantsInstance().addMethod('POST');
        let directory_routes = this.path.join(__dirname, '..', '..', 'app', 'api');
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

                    let file_name    = this.__.capitalize(file.name.substring(0, file.name.indexOf('js') - 1));
                    let route_name   = require('../../app/api/'+file_name+'.js');
                    let instance_of  = new route_name();

                    methods_array    = instance_of.methods;
                    if(methods_array.length > 0) {
                        methods_array.forEach((route: any) => {
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
                                let file_name    = this.__.capitalize(file.name.substring(0, file.name.indexOf('js') - 1));
                                let route_name   = require(
                                    '../../app/api/'+directory_name+'/'+file_name+'.js'
                                );
                                let instance_of  = new route_name();
                                methods_array    = instance_of.methods;

                                if(methods_array.length > 0) {
                                    methods_array.forEach((route: any) => {
                                        eval('app.use(instance_of.'+route+'());');
                                    });
                                }
                            }
                        });
                    });
                }
            });
        });
    }
}