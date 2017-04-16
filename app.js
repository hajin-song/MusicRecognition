var express = require('express');
var multer = require('multer');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

var storage = multer.diskStorage({
 destination: function(req, file, callback){
  callback(null, './images');
 },
 filename: function(req, file, callback){
  callback(null, file.originalname);
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
 res.send("HI");
});

app.listen(3000, function() {
 console.log('Listening on port 3000..');

});
