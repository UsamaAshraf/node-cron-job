var Promise = require('promise');
var parser = require('cron-parser');

const MAX_INT = 2147483647;
const SAFETY_MARGIN = 1;

/*
 * A utility method used for time conversion.
 */
exports.convertToTime = function convertToTime(_after) {
    
    var milliseconds = 0;
    
    if(_after.hasOwnProperty('days') && _after.days) {
        milliseconds = _after.days ? _after.days * 24 * 60 * 60 * 1000 : 0; 
    }
    
    if(_after.hasOwnProperty('hours') && _after.hours) {
        milliseconds += _after.hours ? _after.hours * 60 * 60 * 1000 : 0;
    }
    
    if(_after.hasOwnProperty('minutes') && _after.minutes) {
        milliseconds += _after.minutes ? _after.minutes * 60 * 1000 : 0;
    }
    
    if(_after.hasOwnProperty('seconds') && _after.seconds) {
        milliseconds += _after.seconds ? _after.seconds * 1000 : 0;
    }
    
    return milliseconds;
}

/*
 * This returns a promise that is resolved after every interval
 * determined by the millisecond (integer) or cron tab parameter.
 */
exports.convertToPromise = function convertToPromise(interval) {

  return new Promise(function(resolve, reject) {
    
    var _interval = interval;
    var one_round = MAX_INT;

    // Pushing 'time' to the JS task queue incase the interval is too long.
    
    while(_interval > one_round) {

        setTimeout(function(){}, one_round);
        _interval -= one_round
    }
    
    setTimeout(function(){ resolve(_interval); }, _interval);
  });
}

/*
 * Calculates the remaining time based on the cron tab.
 */
exports.getNextInterval = function getNextInterval(_on) {
    
    var today = new Date();
    
    try {
        var interval = parser.parseExpression(_on);
        var nextDate = new Date(interval.next().toString());
        
    } catch (err) {
        console.log('Error: ' + err.message);
        process.exit(-1);
    }
    
    return nextDate - today;
}

/*
 * Utility function to check if the given input is an integer.
 */
function checkInteger(param) {

    return param === parseInt(param, 10);
}
