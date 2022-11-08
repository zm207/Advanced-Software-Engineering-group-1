var solver;
onmessage = function(event){
	if(event.data =="stop"){
		solver.stop();
	}
	solver = new polysphereSolver(event.data[0], event.data[1], event.data[2], event.data[3])
	solver.solve();
}

class polysphereSolver {
	#h; // height of grid
	#w; // width of grid
	#p; // pieces that can be inserted into the grid
	#g; // The grid with which the solver was initialised
	#test;
	#cont;
	
	constructor(height, width, pieces, grid = false) {
		this.test=1;
		this.cont = true;
		this.h = height;
		this.w = width;
		this.p = pieces;
		this.g = grid;
		if(!this.g){
			this.g = [];
			for (var i = 0; i < this.h; i++) {
				this.g[i] = [];
				for (var j = 0; j < this.w; j++) {
					this.g[i][j] = 0;
				}
			}
		}
	}
	
	solve(){
		this.#solveStep(0,this.g);
		postMessage(false);
	}
	
	stop(){
		this.cont=false;
	}

	#solveStep(num, grid){
		//console.log(this.test++);
		if(!this.cont) return;
		var fRow = this.h;
		var lRow = 0;
		var fCol = this.w;
		var lCol = 0;
		for(var i = 0; i < grid.length; i++){
			for(var j = 0; j < grid[0].length; j++){
				if(grid[i][j]==0){
					if(i<fRow) fRow = i;
					if(i>lRow) lRow = i;
					if(j<fCol) fCol = j;
					if(j>lCol) lCol = j;
				}
			}
		}
		var piece = this.p[num];
		var fits = (piece.length <= (lRow-fRow)+1 && piece[0].length <= (lCol-fCol)+1);
		var fitsRot = (piece[0].length <= (lRow-fRow)+1 && piece.length <= (lCol-fCol)+1);
		if (fits) this.#solveStepSingle(piece, num+1, grid, fRow, lRow+1, fCol, lCol+1);
		if(fits || fitsRot){
			var rot90 = this.#rotatePiece(piece);
			if(!this.#comparePieces(piece,rot90)){
				if (fitsRot) this.#solveStepSingle(rot90, num+1, grid, fRow, lRow+1, fCol, lCol+1);
				var rot180 = this.#rotatePiece(rot90);
				if(!this.#comparePieces(piece,rot180)){
					if (fits) this.#solveStepSingle(rot180, num+1, grid, fRow, lRow+1, fCol, lCol+1);
					if (fitsRot) this.#solveStepSingle(this.#rotatePiece(rot180), num+1, grid, fRow, lRow+1, fCol, lCol+1);
				}
			}
		}
	}
	
	#logPiece(piece, header = false){
		if(header){
			console.log("("+piece.length+")"+header);
		}
		var x = "";
		for (var j = 0; j < piece.length; j++) {
			for (var k = 0; k < piece[j].length; k++) {
				x += piece[j][k];
			}
			x += "\n";
		}
		console.log(x);
	}

	#solveStepSingle(piece, next, grid, fRow, lRow, fCol, lCol){
		for(var i=fRow; i <= (lRow-piece.length); i++){
			for(var j = fCol; j <= (lCol-piece[0].length); j++){
				var fitted = this.#place(piece, grid, i, j);
				if(fitted){
					if(next<this.p.length){
						this.#solveStep(next, fitted);
					} else {
						postMessage(fitted);
					}
				}
			}
		}
	}

	#place(piece, grid, row, col){
		grid = this.#clone(grid);
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

	#clone(piece){
		var newPiece = [];
		for(var i = 0; i < piece.length; i++){
			newPiece[i] = [];
			for(var j = 0; j < piece[i].length; j++){
				newPiece[i][j] = piece[i][j];
			}
		}
		return newPiece;
	}
		
	#comparePieces(p1,p2){
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

	#rotatePiece(piece){
		var newPiece = [];
		for(var i = 0; i < piece[0].length; i++){
			newPiece[i] = [];
			for(var j = 0; j < piece.length; j++){
				newPiece[i][j] = piece[j][(piece[0].length-i)-1];
			}
		}
		return newPiece;
	}
}