'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var LogicException_1 = __importDefault(require("../exception/types/LogicException"));
var Singleton_1 = require("../Singleton/Singleton");
module.exports = /** @class */ (function () {
    function Pagination() {
    }
    /**
     * @function getPaginationInstance
     * @description Inits or gives back an instance
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Pagination
    */
    Pagination.getPagination = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new Pagination();
        return this.instance;
    };
    Pagination.prototype.getCurrentPage = function (req) {
        var _a;
        if (!req || typeof req === 'undefined') {
            return new LogicException_1.default('Request object must be givin as parameter!');
        }
        var current_page = (_a = req.getQueryParam('page')) !== null && _a !== void 0 ? _a : false;
        var __ = Singleton_1.Singleton.getLodash();
        if (__.isNumber(current_page) || !__.isNaN(current_page)) {
            current_page = +current_page === 0 ? 1 : +current_page;
        }
        return current_page;
    };
    Pagination.prototype.getRecords = function (req, rows, items_per_page, total_pages_count) {
        if (total_pages_count === void 0) { total_pages_count = 5; }
        if (!req || typeof req === 'undefined') {
            return new LogicException_1.default('Request object must be givin as parameter!');
        }
        if (!rows || typeof rows.length === 'undefined') {
            return new LogicException_1.default('Rows must be an array of records!');
        }
        if (!items_per_page || typeof items_per_page !== 'number') {
            return new LogicException_1.default('Number of items per page must be a number!');
        }
        if (typeof total_pages_count === 'number') {
            while ((items_per_page * total_pages_count) > rows.length) {
                total_pages_count = total_pages_count - 1;
            }
        }
        //****************************\\
        //* Getting page query param *\\
        //****************************\\
        var current_page = this.getCurrentPage(req);
        var total = rows.length;
        var pages = 0;
        var sign = 0;
        var paginator = "";
        var skip = (current_page - 1) * items_per_page === 0 ? 1 : (current_page - 1) * items_per_page;
        //****************************\\
        //* Calculating total pages  *\\
        //****************************\\
        while (total !== 0) {
            total = total - items_per_page;
            sign = Math.sign(total);
            if (sign === 0 || sign > 0) {
                pages++;
            }
            else {
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
            }
            else { //any other page
                while (rows.length !== items_per_page) {
                    rows = rows.slice(skip);
                    if (rows.length > items_per_page) {
                        rows.length = items_per_page;
                    }
                    else {
                        break;
                    }
                }
            }
        }
        //***********************************\\
        //* Rendering the paginator counter *\\
        //***********************************\\
        if (typeof pages === 'number') {
            var previous = '';
            var next = '';
            if (pages === 1) {
                previous = "disabled";
                next = "disabled";
            }
            else if (pages > 1 && current_page === 1) {
                previous = "disabled";
            }
            else if (pages > 1 && current_page === pages) {
                previous = "";
                next = "disabled";
            }
            else {
                previous = "";
            }
            if (previous == "disabled") {
                paginator = "\n                    <ul class=\"pagination\">\n                        <li class=\"waves-effect ".concat(previous, "\">\n                            <i class=\"material-icons\">chevron_left</i>\n                        </li>\n                ");
            }
            else {
                paginator = "\n                    <ul class=\"pagination\">\n                        <li class=\"waves-effect ".concat(previous, "\">\n                            <a href=\"?page=").concat(current_page - 1 <= 0 ? 1 : current_page - 1, "\"><i class=\"material-icons\">chevron_left</i></a>\n                        </li>\n                ");
            }
            if (pages === 1) {
                paginator = "\n                    <ul class=\"pagination\">\n                        <li class=\"active\"><a href=\"?page=1\">1</a></li>\n                ";
            }
            else {
                var counter = 0;
                var start = true;
                for (var index = current_page; index <= pages; index++) {
                    counter = counter + 1;
                    if (current_page !== false && typeof current_page === 'number') {
                        if (pages - current_page < total_pages_count && start) {
                            var _current_page = current_page;
                            var max_items = total_pages_count - 1;
                            var diff = 0;
                            while (pages - current_page < max_items) {
                                diff = diff + 1;
                                max_items = max_items - 1;
                            }
                            for (var index_1 = diff; index_1 >= 1; index_1--) {
                                paginator = paginator + "<li class=\"\"><a href=\"?page=".concat(_current_page - index_1, "\">").concat(_current_page - index_1, "</a></li>");
                            }
                            start = false;
                        }
                        if (current_page === index) {
                            if (counter < total_pages_count) {
                                paginator = paginator + "<li class=\"active\"><a href=\"?page=".concat(index, "\">").concat(index, "</a></li>");
                            }
                        }
                        else {
                            if (counter < total_pages_count) {
                                paginator = paginator + "<li class=\"waves-effect\"><a href=\"?page=".concat(index, "\">").concat(index, "</a></li>");
                            }
                            if (counter === total_pages_count) {
                                if (current_page === pages) {
                                    paginator = paginator + "<li class=\"active\"><a href=\"?page=".concat(pages, "\">").concat(pages, "</a></li>");
                                }
                                else {
                                    paginator = paginator + "<li class=\"waves-effect\"><a href=\"?page=".concat(pages, "\">").concat(pages, "</a></li>");
                                }
                            }
                        }
                    }
                    else {
                        paginator = paginator + "<li class=\"waves-effect active\"><a href=\"?page=".concat(index, "\">").concat(index, "</a></li>");
                    }
                }
            }
            if (next == "disabled") {
                paginator = paginator + "\n                    <li class=\"waves-effect ".concat(next, "\">\n                        <i class=\"material-icons\">chevron_right</i>\n                    </li>\n                ");
            }
            else {
                paginator = paginator + "\n                    <li class=\"waves-effect ".concat(next, "\">\n                        <a href=\"?page=").concat(current_page + 1 > pages ? 1 : current_page + 1, "\"><i class=\"material-icons\">chevron_right</i></a>\n                    </li>\n                ");
            }
            paginator = paginator + "</ul>";
        }
        return [rows, current_page, pages, paginator];
    };
    return Pagination;
}());
