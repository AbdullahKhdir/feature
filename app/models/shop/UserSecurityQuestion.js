'use strict';

const BaseModel = require("../../../core/model/BaseModel");

/**
 * @class UserSecurityQuestion
 * @constructor
 * @extends BaseModel
 * @description Defining Model UserSecurityQuestion
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class UserSecurityQuestion extends BaseModel {
    constructor() {
        super();

        this.table = 'node.tbl_users_security_questions';
        this.columns = {
            id: {
                label: 'id'
            },
            user_id: {
                label: 'User id',
                references: {
                    name: 'user_security',
                    table: 'node.tbl_users',
                    class: 'shop/User'
                },
                required: true
            },
            question: {
                label: 'Question',
                references: {
                    name: 'question_id',
                    table: 'node.tbl_security_questions',
                    class: 'shop/SecurityQuestion'
                },
                required: true
            },
            answer: {
                label: 'Answer',
                required: true
            },
            created_at: {
                label: 'Created at',
                required: true
            },
            update_at: {
                label: 'Update at'
            }
        };
    }
};