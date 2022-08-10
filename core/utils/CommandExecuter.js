'use_strict';

var exec = require('child_process').exec;

/**
 * Executes a shell an array of commands.
 * @param array {Array}
 * @param callback {Function}
 * @return void
*/
const runCommands = (array, callback) => {
    var index = 0;
    var results = [];

    function next() {
       if (index < array.length) {
           exec(array[index++], function(err, stdout) {
               if (err) return callback(err);
               // do the next iteration
               results.push(stdout);
               next();
           });
       } else {
           // all done here
           callback(null, results);
       }
    }
    // start the first iteration
    next();
}

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
*/
const _execShellCommand = async (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.warn(error);
        }
        resolve(stdout? stdout : stderr);
        });
    });
}

/**
 * Wrapper
 * @param cmd {string}
 * @return string
*/
const execShellCommand = async (cmd) => {
    return await _execShellCommand(cmd);
}


/**
 * Mysql Configutation Socket für UNIX, LINUX & MAC OSs
 * @param cmd {string}
 * @return string
*/
const mysqlSocket = () => {
    let cmd          = 'mysql_config --socket';
    return syncExecShellCmd(cmd);
}


/**
 * Sync Command Execution
 * @param cmd {string}
 * @return string
*/
const syncExecShellCmd = (cmd) => {
    const execSync = require('child_process').execSync;
    return execSync(cmd).toString();
}

exports.mysqlSocket      = mysqlSocket;
exports.execShellCommand = execShellCommand;
exports.runCommands      = runCommands;