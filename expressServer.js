var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var multer	 = require('multer');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());
app.use(multer({dest: '/tmp/'}).any());
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//app.use(express.bodyParser());
//file upload

app.get('/index.htm', function (req, res) {
	console.log('Hello Get');
	res.sendFile(__dirname + '/index.htm');
})

app.post('/file_upload', function(req, res){
	console.log(req.files[0]);
	console.log(req.files[0].originalname);
	console.log(req.files[0].path);
	console.log(req.files[0].mimetype);
	var file = __dirname + "/" + req.files[0].originalname;

	fs.readFile(req.files[0].path, function(err, data){
		fs.writeFile(file, data, function(err){
			if(err){
				console.log(err);
			}
			else{
				response = {
					message: 'File uploded',
					filename: req.files[0].originalname
				};
			}
			console.log(response);
			res.end(JSON.stringify(response));
		});
	});
});

app.get('/list_user', function(req, res){
	console.log('Hello list_user');
	fs.readFile(__dirname +"/users.json", 'utf8', function(err, data){
		if(err){
			console.log(err);
		}
		else{
			console.log(data);
			res.send(data);
		}
	})
})
app.get('/list_user/:id', function(req, res){
	console.log(req.params.id);
	fs.readFile(__dirname +"/users.json", 'utf8', function(err, data){
		if(err){
			console.log(err);
		}
		else{
			var users = JSON.parse(data);
			console.log(users);
			var user = users["user"+req.params.id]
			console.log(user);
			res.send(JSON.stringify(user));
		}
	})
})

app.delete('/del_user',function(req, res){
	console.log('Hello delete');
	fs.readFile(__dirname + '/users.json', 'utf8', function(err, data){
		data = JSON.parse(data);
		delete data["user2"];
		console.log(data);
		res.end(JSON.stringify(data));
	})

	//res.end('delete Express Hello World');
})


app.get('/process_get', function (req, res) {
	response = {
		first_name: req.query.first_name,
		last_name: req.query.last_name
	}
	console.log(response);
	res.end(JSON.stringify(response));
})


app.post('/process_post', urlencodedParser, function (req, res) {
	response = {
		first_name: req.body.first_name,
		last_name: req.body.last_name
	};
	console.log(response);
	res.end(JSON.stringify(response));
})

app.post('/',function(req, res){
	console.log('Hello post');
	res.send('Post Express Hello World');
})




app.get('/ab*cd',function(req, res){
	console.log('Hello abcd');
	res.send('abcd Express Hello World');
})

var server = app.listen(8081, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log(host + ":" + port);
})