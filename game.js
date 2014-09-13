"use strict";

/**

needs:

3 x 3 grid
alternate clicks to place 0 and X
check for lines on each click
game ends when a line is completed

*/

window.onload = function(){

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
	var targetElem = document.querySelector("#gameGrid");

	// track current player by 0 or X
	var currentSymbol = "0";
	// update symbol to be palced for next player
	function nextSymbol(){
		currentSymbol = currentSymbol === "0" ? "X" : "0";
		return currentSymbol;
	}

	function drawGrid(x,y){
		for(var r=y; r>0; r--){
			for(var c=0; c<x; c++){
				var cell = document.createElement('span');
				cell.id = "c"+(c+1)+r;
				targetElem.appendChild(cell);
			}
		}
	}

	function bindClicks(targetElem){
		var cells = targetElem.querySelectorAll('span');
		for(var i=0; i<cells.length; i++){
			cells[i].addEventListener('click', function(e){
				var elem = e.target;
				if(elem.innerHTML == "") elem.innerHTML = nextSymbol(currentSymbol);

				getIntersectingLines(elem);

			})
		}
	}

	// look for winning lines for the last played cell
	function checkLines(target){
		// check only intersecting lines for current player

		var cells = targetElem.querySelectorAll('span');

		// check rows
		if(
				(
					cells[1].innerHTML == currentSymbol &&
					cells[0].innerHTML == currentSymbol &&
					cells[2].innerHTML == currentSymbol
				)
			)
		{
			finishGame();
		}
	}

	// find lines tat intersect the last click
	// we only need to check these lines for a winning move
	function getIntersectingLines(currentCell){
		// remove first letter from id and convert grid reference to array
		var target = parseInt(currentCell.id.substring(1), 10),
			lines = [];
		// check all winlines for target cell and store in lines array	
		for(var line in winLines){
			if(winLines[line].indexOf(target)>-1){
				lines.push(winLines[line]);
			}
		}

		return lines;
	}

	function finishGame(){
		console.log("win");
	}

	drawGrid(3,3);
	bindClicks(targetElem);
}
