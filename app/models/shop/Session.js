'use strict';

const BaseModel = require("../../../core/model/BaseModel");

/**
 * @class Session
 * @constructor
 * @extends BaseModel
 * @description Defining Model Session
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Session extends BaseModel {
    constructor() {
        super();

        this.table = 'node.sessions';
        this.columns = {
            session_id: {
                label: 'Session id'
            },
            expires: {
                label: 'Expires',
                required: true
            },
            data: {
                label: 'Data',
                required: true
            }
        };
    }
};