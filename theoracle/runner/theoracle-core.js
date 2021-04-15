const { exec } = require("child_process");
var fs = require('fs');

var logBackendStream = fs.createWriteStream('./../data/applog/core.log', { flags: 'a' });

let backendProcess = exec("cd ../../theoracle-core && npm i && node main.js");
backendProcess.stdout.pipe(logBackendStream);
backendProcess.stdout.pipe(process.stdout);