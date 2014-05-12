var express = require('express');
var app = express();
var path = require('path');
var http = require('http');

var bodyParser     = require('body-parser');
var cookieParser = require('cookie-parser');

var p = require('./proxy');

app.set('port', process.env.PORT || 3000);




//https://gist.github.com/davemo/4027855
app.use(p.rawBody);
app.use(bodyParser({ encoding : 'utf8' })); 


app.post('/test', function(req, res){
  console.log('req.body>', req.body);
  
  res.json('ok');
})
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')));
app.use('/pages', express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));




app.use('/', p.proxy('http://localhost:7776'))



app.listen(3000); 
console.log('Magic happens on port 3000'); 

