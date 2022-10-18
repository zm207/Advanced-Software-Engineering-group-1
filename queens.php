
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="style.css">
</head>
<body>
<form method="post">
  <label for="width">Board Width:</label>
  <input type="text" id="width" name="width"><br><br>
  <label for="height">Board Height:</label>
  <input type="text" id="height" name="height"><br><br>
  <label for="n">Number of Queens:</label>
  <input type="text" id="n" name="n"><br><br>
  <input type="submit" value="Submit">
</form>
<?php
require 'solver.php';
if($solution!=false){
  echo "<table>";
  for($i=0;$i<$h;$i++){
    echo "<tr>";
    for($j=0;$j<$w;$j++){
      echo "<td>";
      echo $solution[$j][$i]? "Q" : "";
      echo "</td>";
    }
    echo "</tr>";
  }
  echo "</table></br>";
}
?>
</body>
</html>