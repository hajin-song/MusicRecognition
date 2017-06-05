/**
* app.js
* Author: Ha Jin Song
* Last Modified: 5-June-2017
* @description Server for the applciation
*/

const PythonShell = require('python-shell');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const uuid = require('node-uuid');
const mkdirp = require('mkdirp');
var session = require('client-sessions');

var app = express();

app.use(bodyParser.urlencoded({
 extended: true,
 limit: '50mb',
}));

app.use(bodyParser.json());

// File uploading
var storage = multer.diskStorage({
 destination: function(req, file, callback){
  mkdirp('./public/' +  req.session.unique_path);
  callback(null, './public/' + req.session.unique_path + "/");
 },
 filename: function(req, file, callback){
  callback(null, "original.png");
 }
});

var upload = multer({ storage: storage});

// Asset paths
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// Session string
app.use(session({
 cookieName: 'session',
 secret: uuid.v4(),
 duration: 30 * 60 * 1000,
 activeDuration: 5 * 60 * 1000
}));

// root
app.get('/', function(req, res){
 req.session.unique_path = uuid.v1();
 res.sendFile(path.join(__dirname + '/index.html'));
});

// uploading sheet
app.post('/', upload.single('musicSheet'), function(req, res, next){
 var options = {
   mode: 'text',
   pythonOptions: ['-u'],
   scriptPath: 'python',
   args: [req.session.unique_path, 'original.png']
 };

 PythonShell.run('staveProcessor.py', options, function (err, results) {
   if (err) throw err;
   // results is an array consisting of messages collected during execution
   req.session.stave_group = "[" + results.join(',') + "]";
   res.send("Finished");
 });
});

// updating the data on server side
app.post('/update', function(req, res){
 var options = {
   mode: 'text',
   pythonOptions: ['-u'],
   scriptPath: 'python',
   args: [req.body.data, req.session.unique_path, req.body.target]
 };

 PythonShell.run('dataUpdator.py', options, function (err, results) {
   if (err) throw err;
   // results is an array consisting of messages collected during execution
   res.send(results);
 });
});

// Updating the image on the server side
app.post('/editImage', function(req, res){
 var base64Data = req.body.img.replace(/^data:image\/png;base64,/, "");
 fs.writeFile("public/" + req.session.unique_path + "/" + req.body.name, base64Data, 'base64', function(err) {
  console.log(err);
});
 res.send("Done");
});

// Retrieve session
app.get('/session', function(req, res){
 res.send(req.session);
});

// Symbol Detection
app.post('/detect', function(req,res){
 var options = {
   mode: 'text',
   pythonOptions: ['-u'],
   scriptPath: 'python',
   args: [req.body.normal, req.body.half, req.body.whole,
    req.body.normal_rest, req.body.half_rest, req.body.quaver_rest,
    req.body.semi_quaver_rest, req.body.demi_semi_quaver_rest,
    req.body.flat, req.body.sharp, req.session.unique_path, "sheet_without_staves.png"]
 };
 PythonShell.run('locateSymbols.py', options, function (err, results) {
   if (err) throw err;
   req.session.stave_group = "[" + results.join(',') + "]";
   // results is an array consisting of messages collected during execution
   res.send(JSON.parse("[" + results.join(',') + "]"));
 });
});


// Initialise
app.listen(process.env.PORT || 3000, function() {
 console.log("Laucnhing application... listening on port 3000")
});
