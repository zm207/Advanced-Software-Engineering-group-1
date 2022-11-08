class PolysphereSolver {
	h; // height of grid
	w; // width of grid
	p; // pieces that can be inserted into the grid
	totalSquares; // total number of squares from combining all shapes
	errors; // for storing information about poor setups
	
	constructor(height, width, pieces, grid = false) {
		this.h = height;
		this.w = width;
		this.p = pieces;
		this.g = grid
		this.totalSquares = 0;
		this.errors = [];
		this.setupPieces();
	}
	
	setupPieces(){
		for(var i = this.p.length-1; i>-1; i--){
			this.p[i] = this.trimPiece(this.p[i]); //remove empty edge rows/columns
			var killPiece = false;
			if(this.p[i].length < 1){
				this.errors.unshift("Shape "+i+" is empty.");
				killPiece = true;
			} else {
				if(this.p[i].length > this.h) {
					this.errors.unshift("Shape "+i+" is taller than the grid.");
					killPiece = true;
				}
				if(this.p[i][0].length > this.w) {
					this.errors.unshift("Shape "+i+" is wider than the grid.");
					killPiece = true;
				}
			}
			if(killPiece){
				this.p.splice(i,1); //remove error shapes
			}
		}
		if(this.totalSquares > (this.w*this.h)){
			this.errors.unshift("Your shapes take up a greater area than the grid can fit.");
		}
	}
	
	rotatePiece(piece){
		var newPiece = [];
		for(var i = 0; i < piece[0].length; i++){
			newPiece[i] = [];
			for(var j = 0; j < piece.length; j++){
				newPiece[i][j] = piece[j][(piece[0].length-i)-1];
			}
		}
		return newPiece;
	}
	
	logPieces(header = false){
		if(header){
			console.log("("+this.p.length+")"+header);
		}
		for(var i = 0; i < this.p.length; i++) {
			this.logPiece(this.p[i]);
		}
	}
	
	logPiece(piece, header = false){
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
	
	trimPiece(piece){
		var firstRow, lastRow, firstColumn, lastColumn;
		lastRow = lastColumn = -1;
		firstRow = piece.length;
		firstColumn = piece[0].length;
		for(var i = 0; i < piece.length; i++){ //row
			for(var j = 0; j < piece[i].length; j++){ //column
				if(piece[i][j]!=0){
					this.totalSquares++;
					if(i < firstRow){
						firstRow = i;
					}
					if(j < firstColumn){
						firstColumn = j;
					}
					if(i > lastRow){
						lastRow = i;
					}
					if(j > lastColumn){
						lastColumn = j;
					}
				}
			}
		}
		var newPiece = [];
		var height = (1+lastRow)-firstRow;
		var width = (1+lastColumn)-firstColumn;
		for(var i = 0; i < height; i++){ //row
			newPiece[i] = [];
			for(var j = 0; j < width; j++){ //column
				newPiece[i][j] = piece[i+firstRow][j+firstColumn];
			}
		}
		return newPiece;
	}
	
	getErrors(){
		return this.errors;
	}
	
	solve(){
		//alert("not yet implemented","");
		var worker = new Worker("polysphereWorker.js");
		worker.onmessage = function(event){
			if(event.data){
				showSolution(event.data);
			} else {
				resetPage();
			}
		};
		var data = [this.h,this.w,this.p,this.g];
		worker.postMessage(data);
	}
	
}