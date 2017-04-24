var PythonShell = require('python-shell');
var fs = require('fs');
var express = require('express');
var multer = require('multer');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();


app.use(bodyParser.urlencoded({
 extended: true
}));
app.use(bodyParser.json());
var storage = multer.diskStorage({
 destination: function(req, file, callback){
  callback(null, './images');
 },
 filename: function(req, file, callback){
  console.log(file);
  callback(null, "original_sheet.png");
 }
});

var upload = multer({ storage: storage});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.get('/', function(req, res){
 res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/', upload.single('musicSheet'), function(req, res, next){
 console.log(req.body);
 var options = {
   mode: 'text',
   pythonOptions: ['-u'],
   scriptPath: 'python',
   args: ['original_sheet.png']
 };

 PythonShell.run('staveProcessor.py', options, function (err, results) {
   if (err) throw err;
   // results is an array consisting of messages collected during execution
   console.log('results: %j', results);
   res.send("Finished");
 });
});

app.post('/detect', function(req,res){
 console.log(req.body);
 console.log(req);
 //let coordinates = req.body.normalNote
 console.log(req.body)
 var options = {
   mode: 'text',
   pythonOptions: ['-u'],
   scriptPath: 'python',
   args: [req.body.normalNote, req.body.halfNote, req.body.wholeNote]
 };
 PythonShell.run('locateSymbols.py', options, function (err, results) {
   if (err) throw err;
   // results is an array consisting of messages collected during execution
   console.log('results: %j', results);
   res.send("Finished");
 });
 res.send("Finished");
});

app.listen(3000, function() {
 console.log('Listening on port 3000..');

});
