const { exec } = require("child_process");
var fs = require('fs');

var logBackendStream = fs.createWriteStream('./../data/applog/backend.log', { flags: 'a' });
var logFrontendStream = fs.createWriteStream('./../data/applog/frontend.log', { flags: 'a' });

let backendProcess = exec("node ../data/dist/theoracle-back/theoracle-back.js");
backendProcess.stdout.pipe(logBackendStream);
backendProcess.stdout.pipe(process.stdout);

let frontendProcess = exec("node theoracle-front.js");
frontendProcess.stdout.pipe(logFrontendStream);
frontendProcess.stdout.pipe(process.stdout);