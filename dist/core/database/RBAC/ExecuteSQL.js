"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Singleton_1 = require("../../../Singleton/Singleton");
/**
 * @class ExecuteSQL
 * @constructor
 * @extends Db
 * @description To execute all the migrations
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
var ExecuteSQL = /** @class */ (function () {
    function ExecuteSQL() {
    }
    ExecuteSQL.execute = function () {
        Singleton_1.Singleton.getDb().readMigrations();
    };
    return ExecuteSQL;
}());
ExecuteSQL.execute();
