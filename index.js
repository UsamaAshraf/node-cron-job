var runner = require('./lib/runner.js');

/*
 * The JobsConfig prototype.
 */
function JobsConfig() {}


JobsConfig.jobs_module_path = null;

/*
 * Starts a specific user-defined job.
 */
JobsConfig.startJob = function startJob(job_name) {

	if(! JobsConfig.jobs_module_path)
		throw new Error('No path provided for the jobs module.');
	
	runner.run(job_name, JobsConfig.jobs_module_path);
}

/*
 * Starts all user-defined jobs in one breath.
 */
JobsConfig.startAllJobs = function startAllJobs() {
	
	if(! JobsConfig.jobs_module_path)
		throw new Error('No path provided for the jobs module.');
		
	runner.runAll(JobsConfig.jobs_module_path);
}

/*
 * Sets the absolute path to the user-defined jobs file/module.
 */
JobsConfig.setJobsPath = function setJobsPath(_path) {
	
	if(! _path)
		throw new Error('Invalid path provided.');
	
	JobsConfig.jobs_module_path = _path;
}

module.exports = JobsConfig;
