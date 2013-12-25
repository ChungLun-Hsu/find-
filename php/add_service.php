<?php
header("Content-Type:text/html; charset=utf-8");
$con = mysqli_connect("localhost", "nckuservice", "TURPjftGvJSsJ9zY", "nckuservice");
mysqli_query($con, "SET NAMES 'UTF8'");

if (mysqli_connect_errno()) {
    echo "Failed to connect to MySql: " . mysqli_connect_error();
}

$name      = $_POST['service_name'];
$stime     = $_POST['service_stime'];
$address   = $_POST['service_address'];
$phone     = $_POST['service_phone'];
$latitude  = $_POST['latitude'];
$longitude = $_POST['longitude'];

if( isset($_POST['update']) ){
	$sql = "UPDATE 4_store SET longitude = '$longitude', latitude = '$latitude'
		WHERE name = '$name' AND address = '$address'";
	mysqli_query($con, $sql) or die('ERROR:' . mysqli_error($con));
} else {
	$sql = "INSERT INTO 4_store (name,open_time,address,phone,longitude, latitude)
	 VALUES('$name','$stime','$address','$phone','$longitude','$latitude')";
	if (!mysqli_query($con, $sql)) {
	    die('ERROR:' . mysqli_error($con));
	}
}
mysqli_close($con);
?>
