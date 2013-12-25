<?php
	header("Content-Type:text/html; charset=utf-8");
	$con = mysqli_connect("localhost","nckuservice","TURPjftGvJSsJ9zY","nckuservice");
	mysqli_query($con,"SET NAMES 'utf8'");
	$searchTag = $_POST['search_val'];

	if(mysqli_connect_errno()){
		die( "Failed to connect to MySql: " . mysqli_connect_error() );
	}

	$result = mysqli_query($con,"SELECT name,open_time,address,phone,tag,category,longitude,latitude FROM 4_store");

	$data = array();
	while ($row = mysqli_fetch_assoc($result)) {
		$data[] =
		array(
			'name' => $row['name'] ,
			'opening_hours' => $row['open_time'] ,
			'formatted_address' => $row['address'] ,
			'formatted_phone_number' => $row['phone'] ,
			'tag' => $row['tag'],
			'category' => $row['category'],
			'longitude' => $row['longitude'],
			'latitude' => $row['latitude'] 
		);
	}
	
	function filter_by_search_tag( $data_arr, $tag_key ){
		$key_arr =array();
		$output_store =array();
		$length =count($data_arr);
		for( $a=0;$a<$length;$a++ ){
			$data_arr[$a]['tag'] = explode("&", $data_arr[$a]['tag']);
			$key_arr = array_flip($data_arr[$a]['tag']);
			if(	array_key_exists( $tag_key ,$key_arr))
				array_push( $output_store,$data_arr[$a] );
		}
		return $output_store;
	}
	
	$data = filter_by_search_tag( $data, $searchTag );
	echo json_encode($data);
	mysqli_close($con);
?>
