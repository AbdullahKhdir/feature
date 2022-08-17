'use strict';

const BaseModel = require("../../../core/model/BaseModel");

/**
 * @class SecurityQuestion
 * @constructor
 * @extends BaseModel
 * @description Defining Model SecurityQuestion
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class SecurityQuestion extends BaseModel {
    constructor() {
        super();

        this.table = 'node.tbl_security_questions';
        this.columns = {
            id: {
                label: 'id'
            },
            question: {
                label: 'Question',
                required: true
            },
            created_at: {
                label: 'Created at',
                required: true
            },
            updated_at: {
                label: 'Updated at',
                required: true
            }
        };
    }
};