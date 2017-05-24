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
 extended: true
}));

app.use(bodyParser.json());

var storage = multer.diskStorage({
 destination: function(req, file, callback){
  mkdirp('./public/' +  req.session.uniqueString);
  callback(null, './public/' + req.session.uniqueString + "/");
 },
 filename: function(req, file, callback){
  callback(null, "original.png");
 }
});

var upload = multer({ storage: storage});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(session({
 cookieName: 'session',
 secret: uuid.v4(),
 duration: 30 * 60 * 1000,
 activeDuration: 5 * 60 * 1000
}));

app.get('/', function(req, res){
 req.session.uniqueString = uuid.v1();
 res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/', upload.single('musicSheet'), function(req, res, next){
 var options = {
   mode: 'text',
   pythonOptions: ['-u'],
   scriptPath: 'python',
   args: [req.session.uniqueString, 'original.png']
 };

 PythonShell.run('staveProcessor.py', options, function (err, results) {
   if (err) throw err;
   // results is an array consisting of messages collected during execution
   req.session.staveGroup = "[" + results.join(',') + "]";
   res.send("Finished");
 });
});

app.post('/update', function(req, res){
 var options = {
   mode: 'text',
   pythonOptions: ['-u'],
   scriptPath: 'python',
   args: [req.body.data, req.session.uniqueString, req.body.target]
 };
 console.log(req.body.data);
 PythonShell.run('dataUpdator.py', options, function (err, results) {
   if (err) throw err;
   console.log('results: %j', results);
   // results is an array consisting of messages collected during execution
   res.send(results);
 });
});

app.post('/editImage', function(req, res){
 var base64Data = req.body.img.replace(/^data:image\/png;base64,/, "");
 fs.writeFile("public/" + req.session.uniqueString + "/" + req.body.name, base64Data, 'base64', function(err) {
  console.log(err);
});
 res.send("Done");
});

app.get('/session', function(req, res){
 res.send(req.session);
});

app.post('/detect', function(req,res){
 console.log(req.body);
 //let coordinates = req.body.normalNote

 var options = {
   mode: 'text',
   pythonOptions: ['-u'],
   scriptPath: 'python',
   args: [req.body.normal, req.body.half, req.body.whole, req.body.flat, req.body.sharp, req.session.uniqueString, "sheet_without_staves.png"]
 };
 PythonShell.run('locateSymbols.py', options, function (err, results) {
   if (err) throw err;
   console.log('results: %j', results);
   console.log( "[" + results.join(',') + "]" );
   req.session.staveGroup = "[" + results.join(',') + "]";
   // results is an array consisting of messages collected during execution
   res.send(JSON.parse("[" + results.join(',') + "]"));
 });
});

app.listen(process.env.PORT || 3000, function() {
 console.log("Laucnhing application... listening on port 8888")
});
