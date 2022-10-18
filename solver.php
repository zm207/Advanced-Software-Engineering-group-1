
<?php
$solution = false;
if(isset($_POST["width"]) && isset($_POST["height"]) && isset($_POST["n"])){ //if width, height and goal number of queens is set
	//globals
	$grid = array(); //a grid representing areas a queen can take from
	$queens = array(); //an array for storing coordinates of queens
	$numQueens = 0;
	$w = (int)$_POST["width"]; //width of board
	$h = (int)$_POST["height"]; //height of board
	$n = (int)$_POST["n"]; //goal number of Queens
	//set up empty board
	for($i=0; $i<$w; $i++){
		$temp = array();
		$temp2 = array();
		for($j=0; $j<$h; $j++){
			$temp[$j] = 0;
			$temp2[$j] = false;
		}
		$grid[$i] = $temp;
		$queens[$i] = $temp2;
	}
	//HERE IS WHERE FUTURE CODE FOR PLACING PRE-DETERMINED QUEENS WOULD GO
	$solution = solveStep(0);
	if($solution){
		$solution = $queens;
	}
}
	
function solveStep($steps, $x = 0,	$y = 0){
	global $w, $h, $n, $grid;
	if($steps >= $n){
		return true;
	} else {
		while($x < $w){
			while($y < $h){
				if($grid[$x][$y] == 0){
					setQueen($x,$y);
					if(solveStep($steps+1,$x,$y)){
						return true;
					} else {
						setQueen($x,$y,$true);
					}
				}
				$y++;
			}
			$y = 0;
			$x++;
		}
		return false;
	}
} 

function setQueen($x, $y, $undo = false){
	global $grid, $queens, $w, $h;
	
	$a = $undo ? -1 : 1;
	$queens[$x][$y] = $undo ? false : true;
	for($i=0; $i<$w; $i++){
		$grid[$i][$y] += $a; //horizontal
		if($y-$x+$i >=0 && $y-$x+$i < $h){
			$grid[$i][$y-$x+$i] += $a;	//diagonal1
		}
		if($y+$x-$i >=0 && $y+$x-$i < $h){
			$grid[$i][$y+$x-$i] += $a;	//diagonal2
		}
	}
	for($i=0; $i<$h; $i++){
		$grid[$x][$i] += $a; //vertical
	}
}
?>	