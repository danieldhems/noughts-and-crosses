var express = require("express"),
	app = express(),
	http = require("http").Server(app),
	io = require("socket.io")(http);

app.use(express.static(__dirname));
app.get("/", function(req, res){
	res.sendfile("game.html");
});

var clients = [];

io.on("connection", function(socket){
	var socketID = socket.id;

	var roomID = "game",
			rooms = io.sockets.adapter.rooms;

	var gameInfo = {};

	socket.on("initGame", function(data){

		console.log(data);

		// if no room name is provided, join a new room named after the connected uesr
		if(!data.roomname){
			roomID = data.username;

			gameInfo.host = data.username;
			gameInfo.roomname = data.username;
			gameInfo.players = [data.username];
			gameInfo.turn = "host";

			socket.join(roomID);

			io.to(data.username).emit("userJoin", {
				username: data.username,
				roomname: data.username,
				host: data.username,
				turn: gameInfo.turn
			});
		} 
		// if a room name is provided, join it if it exists
		else {
			roomID = data.roomname;
			socket.join(roomID);
			io.to(data.roomname).emit("guestJoin", {
				username: data.username,
				roomname: gameInfo.roomname,
				host: gameInfo.host,
				turn: gameInfo.turn
			});
		}
		console.log(rooms);
		
	});

	socket.on("move", function(data){
		//console.log("move received from: "+socket.id);
		gameInfo.turn = data.turn == "0" ? "X" : "0";
		io.to(roomID).emit("move", data);
	});
});

http.listen(3000, function(){
	console.log("server listening on port 3000");
});