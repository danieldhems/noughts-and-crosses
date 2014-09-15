"use strict";

/**

needs:

3 x 3 grid
alternate clicks to place 0 and X
check for lines on each click
game ends when a line is completed

*/

window.onload = function(){

	var socket = io(),
			host = null,
			hostSymbol = null,
			guestSymbol = null;

	var username,
			roomname;

	var gameInfo = document.querySelector("#gameInfo");

	var form = document.forms["gameOptions"];

	form.addEventListener("submit", function(e){
		e.preventDefault();
		
		var username = form.username.value,
				roomname = form.roomname.value;

		socket.emit("initGame", {
			username: username,
			roomname: roomname
		});
	});

	socket.on("hostJoin", function(data){
		var joinText = document.createElement("p").innerHTML;

		hostSymbol = "0";
		joinText = "You created "+data.roomname;

		console.log(data);
		gameInfo.appendChild(joinText);
	});

	socket.on("userJoin", function(data){
		var joinText = document.createElement("p"),innerHTML;
		joinText = data.username + " joined";
		guestSymbol = "X";
	});

	var winLines = [
		// rows
		[11,21,31],
		[12,22,32],
		[13,23,33],
		// columns
		[11,12,13],
		[21,22,23],
		[31,32,33],
		// diagonal
		[11,22,33],
		[13,22,31]
	];

	// create container for grid
	var gameGrid = document.querySelector("#gameGrid");

	function drawGrid(x,y){
		for(var r=y; r>0; r--){
			for(var c=0; c<x; c++){
				var cell = document.createElement('span');
				cell.id = "c"+(c+1)+r;
				gameGrid.appendChild(cell);
			}
		}
	}

	// handle each play
	function clickHandler(e){
		var elem = e.target,
			thisCell = getGridRef(elem);

		if(elem.innerHTML == "") elem.innerHTML = playerSymbol;

		checkWinningLine(elem);

		var moveData = {
			cell: thisCell
		};

		socket.emit("move", moveData);
	}

	// get grid reference from ID of last played cell
	// @return two-digit Number
	function getGridRef(elem){
		return parseInt(elem.id.substring(1), 10);
	}

	// attach click handler to all cells in game grid
	function bindClicks(gameGrid){
		var cells = gameGrid.querySelectorAll('span');

		for(var i=0; i<cells.length; i++){
			cells[i].addEventListener('click', clickHandler);
		}
	}

	// find lines that intersect the last click
	// we only need to check these lines for a winning move
	function getIntersectingLines(currentCell){

		// remove first letter from id and convert grid reference to array
		var target = getGridRef(currentCell),
			lines = [];

		// check all winlines for target cell and store in lines array	
		for(var line in winLines){
			if(winLines[line].indexOf(target)>-1){
				lines.push(winLines[line]);
			}
		}

		return lines;
	}

	// look for winning lines for the last played cell
	function checkWinningLine(target){
		// check only intersecting lines for current player

		var lines = getIntersectingLines(target);

		for(var line in lines){
			var currentLine = lines[line];

			var cell1 = gameGrid.querySelector("#c"+currentLine[0]),
				cell2 = gameGrid.querySelector("#c"+currentLine[1]),
				cell3 = gameGrid.querySelector("#c"+currentLine[2]);


			if(
				cell1.innerHTML == playerSymbol &&
				cell2.innerHTML == playerSymbol &&
				cell3.innerHTML == playerSymbol
			){
				removeEvents();
				finishGame(currentLine);
			}
		}
	}

	function removeEvents(){
		var cells = gameGrid.querySelectorAll('span');
		for(var i=0; i<cells.length; i++){
			cells[i].removeEventListener('click', clickHandler);
		}
	}

	function finishGame(winningLine){
		for(var cell in winningLine){
			document.querySelector("#c"+winningLine[cell]).style.backgroundColor = "green";
		}
	}

	function updateGameGrid(move){
		console.log(opponentSymbol);
		var cell = gameGrid.querySelector("#c"+move.cell)
		// update grid with last play from opponent
		cell.innerHTML = opponentSymbol;
		// look for winning line 
		checkWinningLine(cell);
	}

	// receive opponent's move and update game
	socket.on("move", function(data){
		console.log(data);
		updateGameGrid(data);
	});

	drawGrid(3,3);
	bindClicks(gameGrid);
}
