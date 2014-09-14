var express = require("express"),
	http = require("http");

var app = express();

app.set("port", process.env.PORT || 3000)

app.use(express.static(__dirname));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/game.html");
});

http.createServer(app).listen(app.get("port"), function(){
	console.log("server running on port " + app.get("port"));
});
