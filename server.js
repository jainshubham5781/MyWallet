var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer(function (request, respone) {
	// body...
	var pathname = url.parse(request.url).pathname;
	console.log("request for " + pathname + " received");

	fs.readFile(pathname.substr(1), function(err,data){
		if(err){
			console.log(err);
			respone.writeHead(404,{'Content-Type': 'text/html'});
		}
		else{
			respone.writeHead(200,{'Content-Type': 'text/html'});
			respone.write(data.toString());
		}
	respone.end();		
	});
}).listen(8081);

console.log('Ended');