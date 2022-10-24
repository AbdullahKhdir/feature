'use strict';

import { Request } from 'express';
import LogicException from "../exception/types/LogicException";
import { Singleton } from "../Singleton/Singleton";


/**
 * @class Pagination
 * @constructor
 * @description Class Pagination is used to stucture the records of a model
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Pagination{
    
    private static instance: Pagination;
    private constructor() {
    }

    /**
     * @function getPaginationInstance
     * @description Inits or gives back an instance
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Pagination
    */
    static getPagination () : Pagination {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new Pagination();
        return this.instance;
    }

    protected getCurrentPage(req: Request) {
        if (!req || typeof req === 'undefined') {
            return new LogicException('Request object must be givin as parameter!');
        }

        let current_page = req.getQueryParam('page') ?? false;
        let __ = Singleton.getLodash();
        
        if (__.isNumber(current_page) || !__.isNaN(current_page)) {
            current_page = +current_page === 0 ? 1 : +current_page;
        }

        return current_page;
    }

    getRecords(req: Request, rows: any, items_per_page: number, total_pages_count: number = 5) : LogicException | any{
        if (!req || typeof req === 'undefined') {
            return new LogicException('Request object must be givin as parameter!');
        }

        if (!rows || typeof rows.length === 'undefined') {
            return new LogicException('Rows must be an array of records!');
        }

        if (!items_per_page || typeof items_per_page !== 'number') {
            return new LogicException('Number of items per page must be a number!');
        }

        if (typeof total_pages_count === 'number') {
            while((items_per_page * total_pages_count) > rows.length) {
                total_pages_count = total_pages_count - 1;
            }
        }

        //****************************\\
        //* Getting page query param *\\
        //****************************\\
        let current_page       = this.getCurrentPage(req);
        let total              = rows.length;
        let pages              = 0;
        let sign               = 0;
        let paginator          = ``;
        let skip               = (current_page - 1) * items_per_page === 0 ? 1 : (current_page - 1) * items_per_page;
        
        //****************************\\
        //* Calculating total pages  *\\
        //****************************\\
        while(total !== 0) {
            total = total - items_per_page;
            sign  = Math.sign(total);
            if (sign === 0 || sign > 0) {
                pages++;
            } else {
                pages++;
                total = 0;
            }
        }

        //*******************************\\
        //* Calculating records numbers *\\
        //*******************************\\
        if (rows.length !== items_per_page) {
            if (current_page === skip) { //first page
                rows.length = items_per_page;
            } else { //any other page
                while(rows.length !== items_per_page) {
                    rows = rows.slice(skip);
                    if (rows.length > items_per_page) {
                        rows.length = items_per_page;
                    } else {
                        break;
                    }
                }
            }
        }

        //***********************************\\
        //* Rendering the paginator counter *\\
        //***********************************\\
        if (typeof pages === 'number') {
            let previous  = '';
            let next      = '';
            
            if (pages === 1) {
                previous = "disabled";
                next     = "disabled";
            } else if (pages > 1 && current_page === 1) {
                previous = "disabled";
            } else if (pages > 1 && current_page === pages) {
                previous = "";
                next     = "disabled";
            } else {
                previous = "";
            }

            if (previous == "disabled") {
                paginator = `
                    <ul class="pagination">
                        <li class="waves-effect ${previous}">
                            <i class="material-icons">chevron_left</i>
                        </li>
                `;
            } else {
                paginator = `
                    <ul class="pagination">
                        <li class="waves-effect ${previous}">
                            <a href="?page=${current_page - 1 <= 0 ? 1 : current_page - 1}"><i class="material-icons">chevron_left</i></a>
                        </li>
                `;
            }

            if (pages === 1) {
                paginator = `
                    <ul class="pagination">
                        <li class="active"><a href="?page=1">1</a></li>
                `;
            } else {
                let counter = 0;
                var start = true;
                for( let index = current_page; index <= pages; index++ ) {
                    counter = counter + 1;
                    if (current_page !== false && typeof current_page === 'number') {
                        if (pages - current_page < total_pages_count && start) {
                            let _current_page = current_page;
                            let max_items = total_pages_count - 1;
                            let diff      = 0;
                            while (pages - current_page < max_items) {
                                diff = diff + 1;
                                max_items = max_items - 1;
                            }
                            for (let index = diff; index >= 1; index--) {
                                paginator = paginator + `<li class=""><a href="?page=${_current_page - index}">${_current_page - index}</a></li>`;
                            }
                            start = false;
                        }
                        
                        if (current_page === index) {
                            if (counter < total_pages_count) {
                                paginator = paginator + `<li class="active"><a href="?page=${index}">${index}</a></li>`;
                            }
                        } else {
                            if (counter < total_pages_count) {
                                paginator = paginator + `<li class="waves-effect"><a href="?page=${index}">${index}</a></li>`;
                            }
                            
                            if (counter === total_pages_count) {
                                if (current_page === pages) {
                                    paginator = paginator + `<li class="active"><a href="?page=${pages}">${pages}</a></li>`;
                                } else {
                                    paginator = paginator + `<li class="waves-effect"><a href="?page=${pages}">${pages}</a></li>`;
                                }
                            }
                        }
                    } else {
                        paginator = paginator + `<li class="waves-effect active"><a href="?page=${index}">${index}</a></li>`;
                    }
                }
            }

            if (next == "disabled") {
                paginator = paginator + `
                    <li class="waves-effect ${next}">
                        <i class="material-icons">chevron_right</i>
                    </li>
                `;
            } else {
                paginator = paginator + `
                    <li class="waves-effect ${next}">
                        <a href="?page=${current_page + 1 > pages ? 1 : current_page + 1}"><i class="material-icons">chevron_right</i></a>
                    </li>
                `;
            }
            paginator = paginator + `</ul>`;
        }

        return [rows, current_page, pages, paginator];
    }
}