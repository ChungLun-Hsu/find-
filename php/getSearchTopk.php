<?php
// return a array with Top-3 frequently search tag
	header("Content-Type:text/html; charset=utf-8");
	$con = mysqli_connect("localhost","nckuservice","TURPjftGvJSsJ9zY","nckuservice");
	mysqli_query($con,"SET NAMES 'utf8'");
	$searchTag = $_POST['search_val'];
	if(mysqli_connect_errno()){
		die( "Failed to connect to MySql: " . mysqli_connect_error() );
	}

	$result = mysqli_query($con,"SELECT * FROM 4_search_count ORDER BY count DESC");
    $array = array();
	if (mysqli_num_rows($result) > 0){
		for($i = 1; $i <= 3 ;$i++){
			$row = mysqli_fetch_array($result);
			array_push($array, $row['tag']);
		}
		echo json_encode($array);
	}
	else 
	{
		echo 'null';
		
	}
	
	mysqli_close($con);
?>
