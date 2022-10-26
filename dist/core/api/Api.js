"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Route_1 = __importDefault(require("../routes/Route"));
var Singleton_1 = require("../Singleton/Singleton");
module.exports = /** @class */ (function (_super) {
    __extends(Api, _super);
    function Api() {
        var _this = _super.call(this) || this;
        _this.path = Singleton_1.Singleton.getPath();
        _this.file_system = Singleton_1.Singleton.getFileSystem();
        _this.constants = Singleton_1.Singleton.getConstants();
        return _this;
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
    Api.prototype.deployApi = function (app) {
        var _this = this;
        Singleton_1.Singleton.getConstantsInstance().addMethod('POST');
        var directory_routes = this.path.join(__dirname, '..', '..', 'app', 'api');
        var methods_array = null;
        this.file_system.readdir(directory_routes, { withFileTypes: true }, function (err, files) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            /*
            * is a directory or is a file
            */
            files.forEach(function (file) {
                var is_dir = file.isDirectory();
                var is_file = file.isFile();
                if (is_file) {
                    /*
                     * let content   = this.file_system.readFileSync(directory_routes+'/'+file);
                    */
                    var file_name = _this.__.capitalize(file.name.substring(0, file.name.indexOf('js') - 1));
                    var route_name = require('../../app/api/' + file_name + '.js');
                    var instance_of = new route_name();
                    methods_array = instance_of.methods;
                    if (methods_array.length > 0) {
                        methods_array.forEach(function (route) {
                            eval('app.use(instance_of.' + route + '());');
                        });
                    }
                }
                else if (is_dir) {
                    var directory_name_1 = file.name;
                    _this.file_system.readdir(directory_routes + '/' + file.name, { withFileTypes: true }, function (err, files) {
                        if (err) {
                            return console.log('Unable to scan directory: ' + err);
                        }
                        files.forEach(function (file) {
                            var is_file = file.isFile();
                            if (is_file) {
                                var file_name = _this.__.capitalize(file.name.substring(0, file.name.indexOf('js') - 1));
                                var route_name = require('../../app/api/' + directory_name_1 + '/' + file_name + '.js');
                                var instance_of = new route_name();
                                methods_array = instance_of.methods;
                                if (methods_array.length > 0) {
                                    methods_array.forEach(function (route) {
                                        eval('app.use(instance_of.' + route + '());');
                                    });
                                }
                            }
                        });
                    });
                }
            });
        });
    };
    return Api;
}(Route_1.default));
