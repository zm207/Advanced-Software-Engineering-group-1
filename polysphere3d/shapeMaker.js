/*
	*/
	
var rots, h, shapeNum, numShapes, placements, ready = 0;
	
onmessage = (e) => {
	e = e.data;
	if(Array.isArray(e)){
		if(Array.isArray(e[0])){
			rots = getRotations(trim(e));
		} else {
			ready = 0;
			if(e[0] != undefined){
				h = e[0];
			}
			if(e[1] != undefined){
				shapeNum = e[1];
			}
			if(e[1] != undefined){
				numShapes = e[1];
			}
			
		}
	} else {
		if(ready==2){
			postMessage(placements);
		}
	}
	ready =	rots != undefined		&&
			h != undefined 			&&
			shapeNum != undefined	&&
			numShapes != undefined	?
			placements != undefined	?
			2 : 1 : 0;
	if(ready==1){
		placements = getPlacements(rots, h, shapeNum, numShapes);
		//console.log("ready: 2");
		ready = 2;
	}
}
	
	/**
	in:		arr - a 2d array representing a 2d shape
	out:	a 2d array representing a 2d shape with empty edge columns and rows removed
	*/
function trim(arr){
	//console.log("shapeMaker.trim");
	var firstR = arr.length
	var lastR = -1
	var firstC = arr[0].length
	var lastC = -1
	for(var i = 0; i < arr.length; i++){
		for(var j = 0; j < arr.length; j++){
			if(arr[i][j]!=0){
				firstR = 	i < firstR 	? i : firstR;
				lastR = 	i > lastR 	? i : lastR;
				firstC = 	j < firstC 	? j : firstC;
				lastC = 	j > lastC 	? j : lastC;
			}
		}
	}
	var trimmed = []
	for(var i = 0, r = firstR; r<=lastR; i++, r++){
		trimmed[i] = [];
		for(var j = 0, c = firstC; c<=lastC; j++, c++){
			trimmed[i][j] = arr[r][c]
		}
	}
	return trimmed
}

	/**
	in:		arr - a 2d array representing a 2d shape
	out:	a 2d array representing all possible rotations of that shape
	*/
function getRotations(arr){
	//console.log("shapeMaker.getRotations");
	var flats = [arr];
	var fArr = [];
	var temp = rotate2d(arr);
	if(!match(arr,temp)){
		flats.push(temp);
		temp = rotate2d(arr);
		if(!match(arr,temp)){
			flats.push(temp);
			temp = rotate2d(arr);
			flats.push(temp);
		}
	}
	var i = 0;
	temp = flip(arr);
	//console.log("------"+flats.length);
	while(i<flats.length){
		if(match(temp,flats[i])){
			break
		}else{
			i++
		}
	}
	if(i==flats.length){
		for(i = flats.length-1; i>-1; i--){
			flats.push(flip(flats[i]));
		}
	}
	flats.push(temp);
	rots = [];
	for(i = 0; i<flats.length; i++){
		temp = to3d(flats[i]);
		for(j = 0; j<temp.length; j++){
			rots.push(temp[j]);
		}
		temp = to3dDiagonal(temp);
		rots.push(temp);
		rots.push(rotate3d(temp));
	}
	return rots;
}

	/**
	in:		arr - a 2d array representing a 2d shape
	out:	a 2d array representing arr rotated 90 degrees
	*/
function rotate2d(arr){
	//console.log("shapeMaker.rotate2d");
	var rot = [];
	for(var i = arr.length-1, r = 0; i>=0; i--, r++){
		rot[i]=[];
		for(var j = arr[0].length-1, c = 0; j>=0; j--, c++){
			rot[i][j] = arr[r][c];
		}
	}
	return rot;
}
	
	/**
	in:		arr1 - a 2d array, arr2 - a 2d array
	out:	true if the two arrays are the same height & width and contain the same values in each cell
	*/
function match(arr1, arr2){
	//console.log("shapeMaker.match");
	if(arr1.length!=arr2.length){
		return false
	}
	if((!Array.isArray(arr1)) || (!Array.isArray(arr2))){
		arr1 = [arr1];
		arr2 = [arr2];
	}
	for(var i = 0; i < arr1.length; i++){
		for(var j = 0; j < arr1.length; j++){
			if(arr1[i][j]!=arr2[i][j]){
				return false;
			}
		}
	}
	return true;
}
	
	/**
	in:		arr - a 2d array representing a 2d shape
	out:	a 2d array representing all placements of arr onto a minimum-height 3d pyramid
	*/
function to3d(arr){
	//console.log("shapeMaker.to3d");
	var res = [];
	var temp, end;
	if(arr[0].length==arr.length){
		return [placePyramid(arr)];
	}
	else if(arr[0].length>arr.length){
		var blank = []
		for(var i = 0; i < arr[0].length; i++){
			blank[i] = 0
		}
		end = arr[0].length-arr.length
		for(var i = 0; i < end; i++){
			temp = []
			for(var j = 0; j < i; j++){
				temp.push(blank)
			}
			for(var j = 0; j < arr.length; j++){
				temp.push(arr[j])
			}
			for(var j = end; j > i; j--){
				temp.push(blank)
			}
			res.push(placePyramid(temp))
		}
	} else {
		end = arr.length-arr[0].length
		for(var i = 0; i < end; i++){
			temp=[]
			for(var j = 0; j < arr.length; j++){
				var n
				for(var k = 0; k < i; k++, n++){
					temp[n][k] = 0
				}
				for(var k = 0; k < arr[j].length; k++, n++){
					temp[n][k] = arr[j][k]
				}
				for(var k = n; k < arr.length; k++, n++){
					temp[n][k] = arr[j][k]
				}
			}
			res.push(placePyramid(temp))
		}
	}
	return res
}

	/**
	in:		arr - a 2d array representing a square containing a 2d shape
	out:	a 1d array representing a pyramid with a base arr
	*/
function placePyramid(arr){
	//console.log("shapeMaker.placePyramid");
	res = []
	level = 1
	n = 0;
	var end;
	while(level<arr.length){
		end = level*level
		for(var i = 0; i < end; i++){
			res[n] = 0;
			n++;
		}
		level++;
	}
	end = arr.length*arr.length;
	for(var i = 0; i < end; i++){
		res[n] = arr[i%arr.length][Math.floor(i/arr.length)];
		n++;
	}
	return res
}

	/**
	in:		arr - a 2d array representing a 2d shape
	out:	a 1d array representing arr placed into minimum-height pyramid after being rotated to stand vertically
	*/
function to3dDiagonal(arr){
	//console.log("shapeMaker.to3dDiagonal");
	var rot = [];
	var max = 0;
	var offset, loc, level;
	for(var i = 0; i<arr.length; i++){
		for(var j = 0; j<arr[0].length; j++){
			level = i + j + 1;
			loc = j + i + (i * (i + j)) + (((level-1)*level*((2 * level)-1))/6);
			max = loc>max ? loc : max;
			rot[loc] = arr[i][j];
		}
	}
	level = 1;
	offset = 0;
	while(offset<max){offset+=(level*level); level++;}
	offset+=(level*level);
	var fArr = []
	for(var i = 0; i<offset; i++){
		fArr[i] = rot[i] == undefined ? 0 : rot[i];
	}
	return fArr;
}
	
	/**
	in:		arr - a 1d array representing a 3d pyramid
	out:	a 1d array representing arr rotated 90 degrees around the y axis
	*/
function rotate3d(arr){
	//console.log("shapeMaker.rotate3d");
	var rot = [];
	var val;
	var off=0;
	var i = 0;
	level=1;
	while(i<arr.length){
		for(var j = 0; j < (level*level); j++){
			val = (i-off)%level + ((level-Math.floor((i-off)/level))-1) + off;
			rot[i] = arr[val];
			i++
		}
		off+=level*level;
		level++;
	}
	return rot
}

	/**
	in:		arr - a 1d array representing a 3d pyramid, h - the height of the pyramid
	out:	a 1d array representing arr with all elements shifted one level down
	*/
function downShift(arr){
	//console.log("shapeMaker.downShift");
	var dshift = [];
	var off=0;
	var i = 0;
	var level=1;
	var max = 0;
	var h;
	while(i<arr.length){
		for(var j = 0; j < (level*level); j++){
			val = i + Math.floor((i-off)/level) + (level*level);
			max = val>max ? val : max;
			dshift[val] = arr[i];
			i++
		}
		off+=level*level;
		level++;
	}
	h = 1;
	offset = 0;
	while(offset<max){offset+=(h*h); h++;}
	for(off=0, level=1; level<=h; off+=(level*level), level++){
		for(var i=0; i<level; i++){
			dshift[ j + ((level-1)*level) + off ] = 0;
			dshift[ (level-1) + (j*level) + off ] = 0;
		}
	}
	return dshift;
}
	
	/**
	in:		arr - a 2d array representing base rotations of a shape, h - a number, shapeNum - the number by which the original shape is identified, numShapes - the total number of shapes in total puzzle
	out:	all possible placements of that shape within a pyramid of height h
	*/
function getPlacements(arr, h, shapeNum, numShapes){
	//console.log("shapeMaker.getPlacements");
	var metaColumns = [];
	for(var i = 0; i<numShapes; i++){ metaColumns[i] = 0; }
	metaColumns[shapeNum] = shapeNum;
	var offsets = [0];
	for(var i = 1; i < h; i++){
		offsets[i] = offsets[i-1] + ((i-1)*(i-1));
	}
	var total = offsets[h]+(h*h);
	var placements = [];
	var todo = [];
	var todoOffset = [];
	var current;
	var end;
	for(var i = 0; i < arr.length; i++){
		current = arr[i];
		todo.push(current);
		var j = 1;
		while(current.length < total){
			todo.push(current = downShift(current));
			todoOffset.push(j);
			j++;
		}
		end = todo.length;
		for(j = 1; j<end; j++){
			for(var k = 0; k<todoOffset[j]; k++){
				todo.push(rowShift(todo[j],h))
				todoOffset.push(todoOffset[j]);
			}
		}
		for(j = 1; j<end; j++){
			for(var k = 0; k<todoOffset[j]; k++){
				todo.push(colShift(todo[j],h))
				todoOffset.push(todoOffset[j]);
			}
		}
		for(j = 0; j<end; j++){
			current = todo[j]
			for(k = current.length; k < total; k++){
				current[k] = 0;
			}
			for(k = 0; k < metaColumns; k++){
				current[k+total] = metaColumns[k];
			}
			placements.push(current);
		}
	}
	return placements;
}
	
	/**
	in:		arr - a 1d array representing a 3d pyramid, h - the height of the pyramid
	out:	a 1d array representing arr with all elements shifted one row across
	*/
function rowShift(arr, h){
	//console.log("shapeMaker.rowShift");
	arr = arr.slice();
	var loc, temp, level;
	var offsets = [];
	for(level = 1; level < h; level++){
		offsets[level] = (level-1)*(level-1);
	}
	for(var i = arr.length-1; i>-1; i--){
		if(i<offsets[level]){
			level--;
		}
		loc = Math.floor((i-offsets[level])/level) > 0 ? i - level : 0;
		temp = arr[loc];
		arr[loc] = 0;
		arr[i] = temp;
	}
	return arr;
}

	/**
	in:		arr - a 1d array representing a 3d pyramid, h - the height of the pyramid
	out:	a 1d array representing arr with all elements shifted one column across
	*/
function colShift(arr, h){
	//console.log("shapeMaker.colShift");
	arr = arr.slice();
	var loc, temp, level;
	var offsets = [];
	for(level = 1; level < h; level++){
		offsets[level] = (level-1)*(level-1);
	}
	for(var i = arr.length-1; i>-1; i--){
		if(i<offsets[level]){
			level--;
		}
		loc	= (i-offsets[level])%level > 0 ? i - 1 : 0;
		temp = arr[loc];
		arr[loc] = 0;
		arr[i] = temp;
	}
	return arr;
}

function flip(arr){
	//console.log("shapeMaker.flip");
	flipped = []
	for(var i = 0; i<arr.length; i++){
		flipped[i] = []
		for(var j = 0; j<arr.length; j++){
			flipped[i][(arr.length-1)-j] = arr[i][j];
		}
	}
	return flipped;
}