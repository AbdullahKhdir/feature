'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var workerpool_1 = __importDefault(require("workerpool"));
var exampleLogger = function (nr) {
    var number = nr;
    var n1 = 0, n2 = 1, nextTerm;
    console.log('Fibonacci Series:');
    for (var i = 1; i <= number; i++) {
        nextTerm = n1 + n2;
        n1 = n2;
        n2 = nextTerm;
    }
    return n1;
};
var exampleLoggerWithEvent = function (nr) {
    var number = nr;
    var n1 = 0, n2 = 1, nextTerm;
    console.log('Fibonacci Series:');
    workerpool_1.default.workerEmit({
        status: 'in_progress'
    });
    for (var i = 1; i <= number; i++) {
        nextTerm = n1 + n2;
        n1 = n2;
        n2 = nextTerm;
    }
    workerpool_1.default.workerEmit({
        status: 'complete'
    });
    return n1;
};
// create a worker and register functions
workerpool_1.default.worker({
    exampleLoggerWithEvent: exampleLoggerWithEvent,
    exampleLogger: exampleLogger
});
