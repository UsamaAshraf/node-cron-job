var executer = require('./executer');


/*
 * Delegates the job to the appropriate executer method
 * according to how it is scheduled.
 */
exports.run = function (_job) {
    
    if(_job.hasOwnProperty('after') && _job.after) {
      
        executer.runAfter(_job.job, _job.after);  
    }
    else if (_job.hasOwnProperty('on') && _job.on) {
      
        executer.runOn(_job.job, _job.on);
    }
    else {
        console.error("Job has no schedule")
        process.exit(1);
    } 
}