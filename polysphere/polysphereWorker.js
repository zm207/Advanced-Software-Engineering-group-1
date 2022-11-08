var height, width, pieces, grid;

onmessage = function(event){
	height = event.data[0];
	width = event.data[1];
	pieces = event.data[2];
	grid = event.data[3];
	solve();
}

function solve(){
	if(!grid){
		grid = [];
		for (var i = 0; i < height; i++) {
			grid[i] = [];
			for (var j = 0; j < width; j++) {
				grid[i][j] = 0;
			}
		}
	}
	solveStep(0,grid);
	postMessage(false);
}

function solveStep(num, grid){
	var piece = pieces[num];
	solveStepSingle(piece, num+1, grid);
	var rot90 = rotatePiece(piece);
	if(!comparePieces(piece,rot90)){
		solveStepSingle(rot90, num+1, grid);
		var rot180 = rotatePiece(rot90);
		if(!comparePieces(piece,rot180)){
			solveStepSingle(rot180, num+1, grid);
			solveStepSingle(rotatePiece(rot180), num+1, grid);
		}
	}
}

function solveStepSingle(piece, next, grid){
	for(var i=0; i <= (height-piece.length); i++){
		for(var j = 0; j <= (width-piece[0].length); j++){
			var fitted = place(piece, grid, i, j);
			if(fitted){
				if(next<pieces.length){
					solveStep(next, fitted);
				} else {
					postMessage(fitted);
				}
			}
		}
	}
}

function place(piece, grid, row, col){
	grid = clone(grid);
	//postMessage(grid);
	for(var i=0; i < piece.length; i++){
		for(var j = 0; j < piece[i].length; j++){
			if(grid[i+row][j+col] == 0){
				grid[i+row][j+col] = piece[i][j];
				//postMessage(grid);
			} else if (piece[i][j] != 0){
				return false;
			}
		}
	}
	return grid;
}

function clone(piece){
	var newPiece = [];
	for(var i = 0; i < piece.length; i++){
		newPiece[i] = [];
		for(var j = 0; j < piece[i].length; j++){
			newPiece[i][j] = piece[i][j];
		}
	}
	return newPiece;
}
	
function comparePieces(p1,p2){
	if(p1.length != p2.length || p1[0].length != p2[0].length){
		return false;
	} else {
		for(var i = 0; i < p1.length; i++){
			for(var j = 0; j < p1[i].length; j++){
				if(	(p1[i][j] == 0 && p2[i][j] != 0)
				||	(p1[i][j] != 0 && p2[i][j] == 0) ){
					return false;
				}
			}
		}
		return true;
	}
}

function rotatePiece(piece){
	var newPiece = [];
	for(var i = 0; i < piece[0].length; i++){
		newPiece[i] = [];
		for(var j = 0; j < piece.length; j++){
			newPiece[i][j] = piece[j][(piece[0].length-i)-1];
		}
	}
	return newPiece;
}