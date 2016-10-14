This is a cron job scheduler for Node.

Allows jobs to be defined in a separate module.

It can fork a new process for each job, resulting in zero impact on application performance.


## Table of Contents

- [Install](#install)
- [Setup](#setup)
- [API](#api)
- [Note](#note)
- [Future releases](#future-releases)


## Install

```sh
$ npm install node-cron-job
```



## Setup

The jobs have to be declared in a separate module such as:
```js
// jobs.js

exports.first_job = {
    
    after: {                // Configuring this job to run after this period.
        seconds: 2,
        minutes:2,
        hours: 1,
        days: 3
    },
    job: function () {
        console.log("first_job");
    },
    spawn: true             
}

exports.second_job = {
    
    on: "*/2 * * * * *",    // Cron tab instruction.
    job: function () {
        console.log("second_job");
    },
    spawn: false            // If false, the job will not run in a separate process.
}
```

Next, the module may be used any where within your code to indicate the absolute path to the 
jobs file and explicit instructions to start those jobs. Example:

```js
// main.js

var cronjob = require('node-cron-job');


cronjob.setJobsPath(__dirname + '/jobs.js');  // Absolute path to the jobs module.

cronjob.startJob('first_job');

cronjob.startJob('second_job');
```


## API

Each job exported by the jobs module can have the following objects:

* `on`: The cron tab instruction string that defines the schedule. Please see [crontab.org](http://crontab.org/).

[cron-parser](https://www.npmjs.com/package/cron-parser) is used to parse these.

* `after`: A easier-to-use but less expressive way to schedule a job. It defines
the time after which the job is supposed to run, periodically. This will take priority over `on`. 
Example:

```txt
after: {
    hours: 2,
    days: 10
},
```

* `job`: The job closure/function that is to be scheduled.

* `spawn`: A boolean value telling the module to run this job in a separate forked process or in the same
thread as your application. This should be set according to scalibility and peformance needs.
The default value is `true`.


The module includes these methods:

* `setJobsPath(abs_path)`: Sets the absolute path to the jobs module.

* `startJob(job_name)`: Starts the given job.

* `startAllJobs()`: Starts all jobs defined in the jobs module.


## Note

*If your application is a cluster with multiple instances, beware that unless you load and start your jobs
module in the master process, your jobs may run on schedule once per node instance !*

## Future releases

An option will be introduced soon allowing *all* the jobs to run in one separate process.
Some of the work may be moved to a C++ extension in future releases.
