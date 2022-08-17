'use strict';

const BaseModel = require("../../../core/model/BaseModel");

/**
 * @class Migration
 * @constructor
 * @extends BaseModel
 * @description Defining Model Migration
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Migration extends BaseModel {
    constructor() {
        super();

        this.table = 'node.tbl_db_migrations';
        this.columns = {
            id: {
                label: 'Id'
            },
            migrations_file_name: {
                label: 'Migrations File Name',
                required: true
            },
            migrations_sql: {
                label: 'Migrations Sql',
                required: true
            },
            created_at: {
                label: 'Created at',
                required: true
            }
        };
    }
};