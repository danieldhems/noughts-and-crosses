var express = require("express"),
	app = express(),
	http = require("http").Server(app),
	io = require("socket.io")(http);

app.use(express.static(__dirname));
app.get("/", function(req, res){
	res.sendfile("game.html");
});

io.on("connection", function(socket){
	console.log("a user connection");
	
	socket.on("move", function(data){
		console.log(data);
		io.emit("move", data);
	});
});

http.listen(3000, function(){
	console.log("server listening on port 3000");
});