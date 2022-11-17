'use strict';

import BaseModel from "../../../core/model/BaseModel";

/**
 * @class Chat
 * @constructor
 * @extends BaseModel
 * @description Defining Model Chat
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Chat extends BaseModel {
    constructor() {
        super();

        this.can_create = true;
        this.can_update = true;
        this.can_delete = true;

        this.primary_key = 'id';
        this.table       = 'node.tbl_chat';
        this.columns     = {
            id: {
                label: 'ID'
            },
            user_id: {
                label: 'User id',
                references: {
                    name: 'user_chat',
                    table: 'node.tbl_users',
                    class: 'shop/User',
                    column: 'id'
                },
                required: true
            },
            receiver_id: {
                label: 'Receiver id',
                references: {
                    name: 'receiver_chat',
                    table: 'node.tbl_users',
                    class: 'shop/User',
                    column: 'id'
                },
                required: true
            },
            message: {
                label: 'Message',
                required: true
            },
            created_at: {
                label: 'Created at',
                type: 'datetime'
            }
        };
        // this.descripeTable(this.table)
        // .then(result => {
        //     let db_columns_list : any = [];
        //     const columns = result[0];
        //     let invalid_columns = [];
        //     // @ts-ignore 
        //     columns.forEach(column => {
        //         /*
        //         * If columns is in the db but not in this.columns, it will get populated
        //         */
        //         if (Object.keys(this.columns).indexOf(column['Field']) === -1 && column['Key'] !== 'PRI') {
        //             this.columns[column['Field']] = {
        //                 label:   this.__.capitalize(this.__.startCase(column['Field'])),
        //                 type:    column['Type'],
        //                 default: column['Default'] ? column['Default'] : null,
        //             }
        //         }
        //         db_columns_list.push(column["Field"]);
        //     });
        //     /*
        //     * If columns is not in the db but in this.columns, a run time exception will be thrown
        //     */
        //     invalid_columns = Object.keys(this.columns).filter(x => !db_columns_list.includes(x));
        //     if (!this.__.isEmpty(invalid_columns)) {
        //         throw new RuntimeException(
        //             "Columns ["+
        //             invalid_columns.join(',')+" "+
        //             "] not available in database for the Model "+
        //             getClass(this)
        //         );
        //     }
        //     return;
        // })
        // .catch(err => {throw err});
    }
};