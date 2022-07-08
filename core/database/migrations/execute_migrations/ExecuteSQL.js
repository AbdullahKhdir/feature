'use strict';

const Db = require("../../node/Db");

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