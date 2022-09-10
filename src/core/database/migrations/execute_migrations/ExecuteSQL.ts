'use strict';

import { Singleton } from "../../../Singleton/Singleton";
import Db from "../../Db";

/**
 * @class ExecuteSQL
 * @constructor
 * @extends Db
 * @description To execute all the migrations 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
class ExecuteSQL {
    constructor() {
    }

    static execute() {
        Singleton.getDb().readMigrations();
    }
}

ExecuteSQL.execute();