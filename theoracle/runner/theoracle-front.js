var express = require('express');
var app = express();

console.log();
console.log("---------------------------------------------");
console.log("THE ORACLE FRONT");
console.log("---------------------------------------------");
console.log();

//setting middleware
app.use('/', express.static(__dirname + './../data/dist/theoracle-front'));

var server = app.listen(5000);