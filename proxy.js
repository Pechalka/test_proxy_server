var request = require('request');
var proxy = function(apiUrl){
  return function(req, res) {
    var url = apiUrl + req.url;
  var method = req.method;
  var body = req.rawBody;

  console.log('proxy: ', method, ' ', req.url, ' to: ', url);

  // copy headers, except host header
  var headers = {}
  for (var key in req.headers) {
    if (req.headers.hasOwnProperty(key)) {
      headers[key] = req.get(key)
    }
  }
  headers['host'] = 'final-host';
//  headers['Content-Type'] = 'application/json';
  console.log('body1> ',  body);

 // req.pipe(request({url:url, headers: headers, method : method })).pipe(res);

request({url:url, headers: headers, method : method, body : body }, function (error, response, body) {
  // debug response headers
  console.log('response.headers>', response.headers)
  // debug response body
  console.log('body2>', body)

  // copy response headers
  for (var key in response.headers) {
    if (response.headers.hasOwnProperty(key)) {
      res.setHeader(key, response.headers[key])
      //res.header(key, response.headers[key]);
    }
  }
 // res.setHeader('Content-Type', 'application/json')

  res.send(response.statusCode, body)
});
}
}


var  rawBody = function(req, res, next) {
   var data = '';
    req.on('data', function(chunk) { 
       data += chunk;
    });

    req.on('end', function() {
        req.rawBody = data;
    }); 

    next();
}


module.exports = {
  proxy : proxy,
  rawBody : rawBody
}