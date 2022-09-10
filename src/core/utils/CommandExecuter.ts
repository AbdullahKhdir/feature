'use_strict';

import exec from 'child_process';

/**
 * Executes a shell an array of commands.
 * @param array {Array}
 * @param callback {Function}
 * @return void
*/
export const runCommands = (array : any[], callback: Function) => {
    var index = 0;
    var results : any = [];

    function next() {
       if (index < array.length) {
            exec.exec(array[index++], function(err : any, stdout: any) {
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
const _execShellCommand = async (cmd : string): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec.exec(cmd, (error: any, stdout: any, stderr: any) => {
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
export const execShellCommand = async (cmd: string) => {
    return await _execShellCommand(cmd);
}


/**
 * Mysql Configutation Socket für UNIX, LINUX & MAC OSs
 * @param cmd {string}
 * @return string
*/
export const _mysqlSocket = () => {
    let cmd          = 'mysql_config --socket';
    return syncExecShellCmd(cmd);
}


/**
 * Sync Command Execution
 * @param cmd {string}
 * @return string
*/
const syncExecShellCmd = (cmd: string) => {
    // return exec.execFileSync(cmd).toString();
}