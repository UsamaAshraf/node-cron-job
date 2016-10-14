var helper = require('./helper');


/*
 * This is used so that with an 'after' schedule the interval
 * doesn't have to be recalculated at every run.
 */
function runAfterUtility(job, interval) {

    helper
    .convertToPromise(interval)
    .then(function done(_int) {
       
       job();
       runAfterUtility(job, interval);
    
    }, function overflow(_interval) {
       console.log('This shouldn\'t happen !');    
    });
}

/*
 * Runs a job that has been scheduled via the 'after' specification.
 */
exports.runAfter = function runAfter(job, _after) {
  
    // Calculating the job period in milliseconds.

    var interval = helper.convertToTime(_after);
    runAfterUtility(job, interval);
}

/*
 * Runs a job that has been scheduled via the 'on' specification.
 */
exports.runOn = function runOn(job, _on) {
    
    // Calculating when the next run is due.

    var interval = helper.getNextInterval(_on);
    
    helper
    .convertToPromise(interval)
    .then(function done(_int) {
       
       job();
       runOn(job, _on);
        
    }, function overflow(_interval) {
       console.log('This shouldn\'t happen !');    
    });
}
