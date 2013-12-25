
$(document).on('click', '#add-info_button', function(e){
	e.preventDefault();
	$.openDOMWindow({
		height:400,
		width:400,
		loader:1,
		loaderHeight:16,
		loaderWidth:17,
		borderColor:'#C0C0C0',
		windowSourceID:'#add-info'
	});
	// return false;
});
$('#close').closeDOMWindow({eventType:'click'});
$('#addinfosubmit').closeDOMWindow({eventType:'click'});


$(document).on('click', '#change-pos_button', function(e){
	e.preventDefault();
	$.openDOMWindow({
		height:400,
		width:400,
		loader:1,
		loaderHeight:16,
		loaderWidth:17,
		borderColor:'#C0C0C0',
		windowSourceID:'#change-pos'
	});
	// return false;
});
$('#nowpos').closeDOMWindow({eventType:'click'});
$('#close_change').closeDOMWindow({eventType:'click'});
$('#changeposition').closeDOMWindow({eventType:'click'});

$('#About').click(function(){
	$.openDOMWindow({
		height:450,
		width:360,
		loader:1,
		loaderHeight:16,
		loaderWidth:17,
		borderColor:'#C0C0C0',
		windowSourceID:'#AboutUs'
	});
	return false;
});
$('#close_about').closeDOMWindow({eventType:'click'});
