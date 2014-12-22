"use strict";

/**

needs:

3 x 3 grid
alternate clicks to place 0 and X
check for lines on each click
game ends when a line is completed

*/

function NoughtsAndCrosses(){

	var self = this;

	self.socket = io();

	self.winLines = [
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

	self.gameWon = false;
	self.winningLine = undefined;

	self.playerSymbol = "0";

	// create container for grid
	self.gameGrid = document.querySelector("#gameGrid");

	self.drawGrid = function(x,y){
		for(var r=y; r>0; r--){
			for(var c=0; c<x; c++){
				var cell = document.createElement('span');
				cell.id = "c"+(c+1)+r;
				gameGrid.appendChild(cell);
			}
		}
	}

	// handle each play
	self.clickHandler = function(e){
		var elem = e.target;
		
		var thisCell = self.getGridRef(elem);

		if(elem.innerHTML == "") elem.innerHTML = self.playerSymbol;

		self.checkWinningLine(elem);

		var moveData = {
			cell: thisCell
		};

		self.socket.emit("move", moveData);
	}

	// get grid reference from ID of last played cell
	// @return two-digit Number
	self.getGridRef = function(elem){
		return parseInt(elem.id.substring(1), 10);
	}

	// attach click handler to all cells in game grid
	self.bindClicks = function(gameGrid){
		var cells = gameGrid.querySelectorAll('span');

		for(var i=0; i<cells.length; i++){
			cells[i].addEventListener('click', self.clickHandler);
		}
	}

	// find lines that intersect the last click
	// we only need to check these lines for a winning move
	self.getIntersectingLines = function(currentCell){

		// remove first letter from id and convert grid reference to array
		var target = self.getGridRef(currentCell),
			lines = [];

		// check all winlines for target cell and store in lines array	
		for(var line in self.winLines){
			if(self.winLines[line].indexOf(target)>-1){
				lines.push(self.winLines[line]);
			}
		}

		return lines;
	}

	// look for winning lines for the last played cell
	self.checkWinningLine = function(target){
		// check only intersecting lines for current player

		var lines = self.getIntersectingLines(target);

		for(var line in lines){
			var currentLine = lines[line];

			var cell1 = self.gameGrid.querySelector("#c"+currentLine[0]),
				cell2 = self.gameGrid.querySelector("#c"+currentLine[1]),
				cell3 = self.gameGrid.querySelector("#c"+currentLine[2]);

			if(
				cell1.innerHTML == self.playerSymbol &&
				cell2.innerHTML == self.playerSymbol &&
				cell3.innerHTML == self.playerSymbol
			){
				self.removeEvents();
				self.finishGame(currentLine);
			}
		}
	}

	self.removeEvents = function(){
		var cells = self.gameGrid.querySelectorAll('span');
		for(var i=0; i<cells.length; i++){
			cells[i].removeEventListener('click', self.clickHandler);
		}
	}

	self.finishGame = function(winningLine){
		for(var cell in winningLine){
			document.querySelector("#c"+winningLine[cell]).style.backgroundColor = "lime";
		}
	}

	// Do move and check for win
	self.doMove = function(move){
		var cell = self.gameGrid.querySelector("#c"+move.cell)
		// update grid with last play from opponent
		cell.innerHTML = opponentSymbol;
		// look for winning line 
		self.checkWinningLine(cell);
	}

	// receive opponent's move and update game
	self.socket.on("move", function(data){
		console.log(data);
		self.doMove(data);
	});

	self.drawGrid(3,3);
	self.bindClicks(gameGrid);

	return self;

};

window.onload = function(){
	var game = new NoughtsAndCrosses();
	console.log(game);
	game.drawGrid();
}