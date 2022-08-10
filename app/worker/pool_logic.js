'use strict'

const workerpool = require('workerpool')

const exampleLogger = (nr) => {
    const number = nr;
    let n1 = 0, n2 = 1, nextTerm;

    console.log('Fibonacci Series:');
    
    for (let i = 1; i <= number; i++) {
        nextTerm = n1 + n2;
        n1 = n2;
        n2 = nextTerm;
    }
    return n1;
};


const exampleLoggerWithEvent = (nr) => {
    const number = nr;
    let n1 = 0, n2 = 1, nextTerm;

    console.log('Fibonacci Series:');
    workerpool.workerEmit({
        status: 'in_progress'
    });
    

    for (let i = 1; i <= number; i++) {
        nextTerm = n1 + n2;
        n1 = n2;
        n2 = nextTerm;
    }
    
    workerpool.workerEmit({
        status: 'complete'
    });
    
    return n1;
};
  
// create a worker and register functions
workerpool.worker({
    exampleLoggerWithEvent,
    exampleLogger
});
  