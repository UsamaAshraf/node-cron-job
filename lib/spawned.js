var path = require('path');
var executer = require('./executer');


process.on('message', (_data) => {
  execute(_data);
});

function execute(data) {
  
  //console.log('Child loading jobs module...');
  
  var jobs_module = null;
  
  try {
      require.resolve(data.path);
      jobs_module = require(data.path);
  }
  catch(e) {
      console.error("Module " + path.basename(data.path) + " not found");
      process.exit(e.code);
  }
  
  if(! jobs_module.hasOwnProperty(data.job_key)) {
      console.error("Job not found: " + data.job_key)
      process.exit(1);
  }
  
  
  if(jobs_module[data.job_key].hasOwnProperty('after') && jobs_module[data.job_key].after) {
      
      executer.runAfter(jobs_module[data.job_key].job, jobs_module[data.job_key].after);  
  }
  else if (jobs_module[data.job_key].hasOwnProperty('on') && jobs_module[data.job_key].on) {
      
      executer.runOn(jobs_module[data.job_key].job, jobs_module[data.job_key].on);
  }
  else {
    console.error("Job has no schedule: " + data.job_key)
    process.exit(1);
  } 
}
