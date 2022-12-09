var dlx = null;
var solutionsArray;

onmessage = (e) => {
	console.log("who, me?");
	e = e.data;
	if(Array.isArray(e)){
		if(!Array.isArray(e[0])){
			e = [e];
		}
		if(dlx != null){
			dlx.arrayToRow(e);
		} else {
			dlx = new DLX(e.length);
		}
		if(dlx.expecting == dlx.received){
			dlx.solve();
		}
	} else {
		if(dlx != null){
			dlx.solve();
		} else {
			dlx = new DLX(e);
		}
	}
}

class Node {
	constructor(val = 0, leftNode = null, upNode = null, downNode = null){
		this.val = val;
		this.left = leftNode;
		this.up = upNode;
		this.right = null;
		this.down = null;
		this.loc = 0;
	}
	isCol(){return false;}
	
	removeRow(chosen = false) {
		for(var node = this.right; node!=this; node = node.right){
			if(chosen){this.removeCol();}
			node.up.down = node.down;
			node.up.down = node.down;
		}
	}
	
	reviveRow() {
		for(var node = this.right; node!=this; node = node.right){
			node.up.down = node;
			node.up.down = node;
		}
	}
	removeCol() {
		var node = this.down;
		while(!node==this){
			if(node.isCol()){node.removeCol();}
			node.removeRow();
			node=node.down;
		}
	}
	reviveCol() {
		var node = this;
		while(!node.isCol()){node=node.down;}
		node.reviveCol();
	}
	draw(){
		var node = this.right;
		while(node!=this){
			solutionsArray[this.loc] = this.val;
			node = node.right;
		}
	}
}

class Column extends Node {
	isCol(){return true;}
	removeRow() {}
	reviveRow() {}
	removeCol() {
		this.right.left = this.left; 
		this.left.right = this.right;
	}
	reviveCol() {
		this.right.left = this; 
		this.left.right = this;
	}
	
}

class DLX extends Column{
	removeCol() {}
	reviveCol() {}
	constructor(cols){
		super();
		var temp = this;
		this.up = this;
		this.down = this;
		this.cols = cols;
		var h = 1;
		var offset = 0;
		while(offset<cols){offset+=(h*h); h++;}
		this.expecting = h-1;
		this.received = 0;
		for(var i = 0; i < cols; i++){
			temp = new Column(0,temp);
			temp.up = temp;
			temp.down = temp;
			temp.left.right = temp;
		}
		temp.right = this;
		this.left = temp;
	}
	
	arrayToRow(arr){
		this.received++;
		if(!Array.isArray(arr[0])){
			arr = [arr];
		}
		var col = this;
		var current = null;
		for(var j = 0; j<arr.length; j++){
			col = this;
			current = null;
			for(var i = 0; i<arr.length; i++){
				col=col.right;
				if(arr[j][i]!=0){
					current = new Node(arr[j][i],current,col.up,col);
					current.loc = i;
					if(i>0)current.left.right = current;
					col.up.down = current;
					col.up = current;
				}
			}
		}
		if(current!=null){
			var first = current;
			while(first.left!=null){
				first=first.left;
			}
			first.left=current;
			current.right = first;
		}
	}
	
	solve(){
		console.log("begin solve");
		this.solutions = [];
		solutionsArray = [];
		this.step(dlx);
	}
	
	step(column){
		var column, node, killNode;
		if(column.left == dlx){
			for(var i=0; i<this.solutions.length; i++){
				this.solutions[i].draw();
			}
			postMessage(solutionsArray);
			console.log("solution found");
		} else {
			column = column.left;
			column.removeCol();
			for(node = column.down; node != column; node=node.down){
				this.solutions.push(node);
				console.log(node.val);
				node.removeRow(true);
				//for(killNode = node.left; killNode != node; killNode=killNode.down){
					
				this.step(dlx);
				this.solutions.pop();
				node.reviveRow();
			}
			column.reviveCol();
		}
	}
	
}

// https://www.geeksforgeeks.org/implementation-of-exact-cover-problem-and-algorithm-x-using-dlx/