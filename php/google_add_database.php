<?php
	header("Content-Type:text/html; charset=utf-8");
	$con = mysqli_connect("localhost","nckuservice","TURPjftGvJSsJ9zY","nckuservice");
	mysqli_query($con,"SET NAMES 'UTF8'");
	if (mysqli_connect_errno())
	{
		echo "Failed to connect to MySql: " . mysqli_connect_error();
	}
	else
	{
		echo "Access success!!!!!!!!";
	}
	$name = $_POST['service_name'];
	$address = $_POST['service_address'];
	$phone = $_POST['service_phone'];
	$tag = $_POST['tag'];
	$latitude = $_POST['latitude'];
	$longitude = $_POST['longitude'];
	
	$result = mysqli_query($con,"SELECT * FROM 4_store");
	
	$flag = 0;
	$rowcount =  mysqli_num_rows($result);
	echo $rowcount;
	while($row = mysqli_fetch_array($result))
	{
		if((strcasecmp($row['name'],$name) == 0)&&(strpos($latitude,$row['latitude']) !== false)&&(strpos($longitude,$row['longitude']) !== false))
		{	
			$flag = 1;

			// if tag is blank then put it into table directly
			if(strlen($row['tag']) == 0)
			{
				echo "\ntag blank\n";
				$store_id = $row['store_id'];
				$sql = "UPDATE 4_store SET tag='$tag' WHERE store_id='$store_id'";
				if(!mysqli_query($con,$sql))
				{
					die('ERROR:' .mysqli_error($con));
				}
				break;
			}

			// split the tag into array by &
			$tagArray = explode("&", $row['tag']);
			$tagArrayCount = count($tagArray);
			$i = 0;
			for($i = 0; $i< $tagArrayCount; $i++){
				// if tag exists then do nothing
		    	if(strpos($row['tag'], $tag) !== false){
					break;
				}
			}

			// if tag doesnot exist, then put the tag after oldtag
			if($i == $tagArrayCount)
			{
				$newTag = $row['tag'] . "&" . $tag;
				$store_id = $row['store_id'];
				$sql = "UPDATE 4_store SET tag='$newTag' WHERE store_id='$store_id'";
				if(!mysqli_query($con,$sql))
				{
					die('ERROR:' .mysqli_error($con));
				}
				break;

			}
		  	break;
		}
	}
	if($flag == 0)
	{
		$sql="INSERT INTO 4_store ( name, address, phone, tag,latitude, longitude)
		VALUES('$name','$address','$phone','$tag','$latitude','$longitude')";
		
		if(!mysqli_query($con,$sql))
		{
			die('ERROR:'.mysqli_error($con));
		}
	}
	
	mysqli_close($con);
?>
