window.fbAsyncInit = function() {
	FB.init({
    appId      : '179104038951748', // App ID
    channelUrl : '//merry.ee.ncku.edu.tw/~f74991162/1203_1_chen/res/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
 });
};

// Load the SDK asynchronously
(function(d){
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));

function loginSite(FBinfo) {
	if (!FBinfo) {
		FB.api('/me', function(response) {
			console.log('Fetching your information, ' + response.name + '.');
			localStorage.setItem('FBinfo',JSON.stringify(response));
			$('#user_image').attr('src','https://graph.facebook.com/'+response.id+'/picture').css('width','40px');
		});
	} else if ( FBinfo.id ) {
		$('#user_image').attr('src','https://graph.facebook.com/'+JSON.parse(localStorage.FBinfo).id+'/picture').css('width','40px');
	} else {
		console.log( FBinfo.error || 'error' );
	}
}

$(function (){
	var $loginBtn = $('#login'),
	FBinfo = (localStorage.FBinfo) ? JSON.parse(localStorage.FBinfo) : '';

	// 檢查是否已登入
	if( FBinfo ) {
		if ( FBinfo.id ) {
			$loginBtn.find('span').text('LOGOUT');
			loginSite(FBinfo);
		} else { // 登入有問題
			console.log( FBinfo.error || 'error' );
		}
	}

	$loginBtn.click(function(e){
		e.preventDefault();
		FB.getLoginStatus(function(response){
			if (response.status === 'connected') { // 已經與 Facebook Login 連結
				if( e.target.textContent === 'LOGIN') {
					e.target.textContent = 'LOGOUT';
					loginSite(FBinfo);
				} else {
					localStorage.removeItem('FBinfo');
					$('#user_image').removeAttr('src').css('width','0');
					e.target.textContent = 'LOGIN';
				}
			} else { // 尚未使用過 Facebook Login 登入
				FB.login(function(response){
					if (response.authResponse) {
						e.target.textContent = 'LOGOUT';
						loginSite(FBinfo);
					} else {
				      // The person cancelled the login dialog
				   }
				});
			}
		});
	});

	$('#top').click(function(e){
		e.preventDefault();
	});
});