var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var usernames = [];

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

http.listen(process.env.PORT || 3000, function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log("Listening on port 3000");
	}
});

// Establish a Connection
io.sockets.on('connection', function(socket){

	// when new user join
	socket.on('new user', function(data, callback){
		if(usernames.indexOf(data) != -1){
			callback(false);
		} else {
			callback(true);
			socket.username = data;
			usernames.push(socket.username);
			updateUsernames();
		}
	})

	// update username
	function updateUsernames(){
		io.sockets.emit('usernames', usernames);
	}
	// send message
  socket.on('send message', function(data){
    io.sockets.emit('new message',{
			msg: data,
			user: socket.username
		});
  })

	// disconnect
	socket.on('disconnect', function(data){
		if(!socket.username) return ;
		usernames.splice(usernames.indexOf(socket.username), 1);
		updateUsernames();
	})
});