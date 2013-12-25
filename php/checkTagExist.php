<?php
// return exist if tag exist
// return notexist if tag is not exist
// otherwise it will update the times of tag has been search in table 4_search_coount
	header("Content-Type:text/html; charset=utf-8");
	$con = mysqli_connect("localhost","nckuservice","TURPjftGvJSsJ9zY","nckuservice");
	mysqli_query($con,"SET NAMES 'utf8'");
	$searchTag = $_POST['search_val'];
	if(mysqli_connect_errno()){
		die( "Failed to connect to MySql: " . mysqli_connect_error() );
	}

	$result = mysqli_query($con,"SELECT * FROM 4_search_count WHERE tag = '$searchTag'");
    
	if (mysqli_num_rows($result) > 0){
		$row = mysqli_fetch_array($result);
		$newcount = $row['count'] + 1;
		$sql = "UPDATE 4_search_count SET count='$newcount' WHERE tag='$searchTag'";
		if(!mysqli_query($con,$sql))
		{
			die('ERROR:' .mysqli_error($con));
		}
		echo 'exist';
	}
	else 
	{
		$row = mysqli_fetch_array($result);
		$sql = "INSERT INTO 4_search_count (tag,count) VALUES('$searchTag', '1')";
		if(!mysqli_query($con,$sql))
		{
			die('ERROR:' .mysqli_error($con));
		}
		echo 'notexist';
		
	}
	
	mysqli_close($con);
?>
