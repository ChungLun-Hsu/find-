<?php
	// 資料庫參數
	$dbhost = '127.0.0.1';
	$dbuser = 'nckuservice';
	$dbpass = 'TURPjftGvJSsJ9zY';
	$dbname = 'nckuservice';
	$connect = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error with MySQL connection');
	mysql_select_db($dbname, $connect);  
	mysql_query("SET NAMES 'utf8'");
	
	$searchTag='牛肉麵'; 
	$u_word=" SELECT * FROM `4_store` WHERE `tag` = '$searchTag'";
	$result=mysql_query($u_word);
	while ( $row = mysql_fetch_assoc($result)){
		$data[]= array( 'id' => $row['store_id'] , 'name' => $row['name'], 
		'time' => $row['open_time'], 'address' => $row['address'], 
		'phone' => $row['phone'], 'tag' => $row['tag'], 'category' => $row['category'], 
		'longitude ' => $row['longitude '], 'latitude' => $row['latitude'] );
	}
	
	print_r	($data);
	mysqli_close($con);
?>