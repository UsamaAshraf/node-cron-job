const fork = require('child_process').fork;
var path = require('path');
var master_runner = require('./master-runner');


/*
 * Runs a specific job either in the current process
 * or in a newly spawned one.
 */
function run(job_name, jobs_file_path) {
    
    var jobs = require(jobs_file_path);
    
    if(! jobs.hasOwnProperty(job_name)) {
        
        return console.log('Job not found: ' + job_name);
    }
    
    if(jobs[job_name].hasOwnProperty('spawn') && ! jobs[job_name].spawn) {
        
        return master_runner.run(jobs[job_name]);
    }
    
    var ps = fork(path.resolve(__dirname, 'spawned'));
    ps.send({job_key: job_name, path: jobs_file_path});
    
    // Attaching a handler to the closing/exiting of this spawned process.

    ps.on('close', (code) => {
        if (code !== 0) {
            console.log(`ps process exited with code ${code}`);
        }
    });
}

/*
 * Calls the run function iteratively to run a batch of jobs.
 */
function runAll(jobs_file_path) {
    
    var job_module = require(jobs_file_path);
    for(key in job_module) {
        run(key, jobs_file_path);
    }
}

exports.run = run;

exports.runAll = runAll;
