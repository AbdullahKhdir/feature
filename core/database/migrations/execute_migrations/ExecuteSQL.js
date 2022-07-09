'use strict';

const Db = require("../../Db");

/**
 * @class ExecuteSQL
 * @constructor
 * @extends Db
 * @description To execute all the migrations 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
class ExecuteSQL extends Db {
    constructor() {
        super();
    }

    execute() {
        this.readMigrations();
    }
}

const migrations_object = new ExecuteSQL();

migrations_object.execute();