'use strict';

const BaseModel = require("../../../core/model/BaseModel");
const Lodash = require("../../utils/Lodash");

module.exports = class ExampleModel extends BaseModel{

    constructor() {
        super();

        this.table = 'database_name.table_name';
        this.columns = {
            first_column: 'first_column',
            second_column: 'second_column',
            third_column: 'third_column',
            fourth_column: 'fourth_column',
            etc: 'etc'
        };
    }

};