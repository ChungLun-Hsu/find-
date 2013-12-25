/*global google: false, $: false*/
'use strict';
var map;
var geocoder;
var human_marker = [];
var current_pos = {
   latitude: 22.9966,
   longitude: 120.216
};
var service_marker = [];
var service;
var infowindow;
var myLatLng;
var google_service_marker = [];

var status_count = 0;

var search_name = {};

/**
 *  初始化地理位置、物件
 *  1. 地圖
 *  2. info window
 *  3. 地方資訊
 */
$(function (){
   var mapOptions = {
      zoom: 10,
      center: new google.maps.LatLng(current_pos.latitude, current_pos.longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
         {
            featureType: 'pio',
            elementType: 'labels',
            stylers: [
               { visibility: 'off' }
            ]
         },
         {
            featureType: 'road',
            elementType: 'labels',
            stylers: [
               { visibility: 'on'}
            ]
         }
      ]
   };
   map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
   infowindow = new google.maps.InfoWindow();
   service = new google.maps.places.PlacesService(map);
   getLocation();
   show_marker(); // 有作用嗎?
});

//抓取目前位置
function getLocation() {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPosition, showError);
   } else {
      console.log('Geolocation is not supported by this browser.');
   }

}

//接收位置
function setPosition(position) {
   current_pos.latitude = position.coords.latitude;
   current_pos.longitude = position.coords.longitude;

   myLatLng = new google.maps.LatLng(current_pos.latitude, current_pos.longitude);
   var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: 'images/human_marker.png',
      title: 'You are here!'
   });
   human_marker.push(marker);
   map.setCenter(new google.maps.LatLng(current_pos.latitude, current_pos.longitude));
   map.setZoom(16);

}

//抓不到位置的錯誤處理函數
function showError(error) {
   current_pos.latitude = 22.9966;
   current_pos.longitude = 120.216;
   myLatLng = new google.maps.LatLng(current_pos.latitude, current_pos.longitude);
   var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: 'images/human_marker.png',
      title: 'You are here!'
   });
   human_marker.push(marker);
   map.setCenter(new google.maps.LatLng(current_pos.latitude, current_pos.longitude));
   map.setZoom(16);

   switch (error.code) {
   case error.PERMISSION_DENIED:
      console.log('User denied the request for Geolocation.');
      break;

   case error.POSITION_UNAVAILABLE:
      console.log('Location information is unavailable.');
      break;

   case error.TIMEOUT:
      console.log('The request to get user location timed out.');
      break;

   case error.UNKNOWN_ERROR:
      console.log('An unknown error occurred.');
      break;
   }
}

//將地址轉成經緯度
function codeAddress(addr) {
   var address = addr;
   geocoder = new google.maps.Geocoder();
   console.log('成功進入codeAddress');

   geocoder.geocode({
      'address': address
   }, function (results, status) {
      console.log('geocoder成功');
      console.log(status);
      if (status === google.maps.GeocoderStatus.OK) {
         map.setCenter(results[0].geometry.location);
         //顯示icon
         var image = 'images/human_marker.png';
         var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            animation: google.maps.Animation.DROP,
            icon: image,
            title: 'You are here!'
         });
         var p = results[0].geometry.location.toString();
         var patt = new RegExp(/\d+.\d+/ig);
         var result;
         var count = 1;
         while ((result = patt.exec(p)) !== null) {
            if (count === 1) {
               current_pos.latitude = result;
               count = 0;
            } else {
               current_pos.longitude = result;
               count = 1;
            }
         }
         myLatLng = new google.maps.LatLng(current_pos.latitude, current_pos.longitude);
         human_marker[0].setMap(null);
         human_marker = [];
         human_marker.push(marker);

      } else {
         console.log('Geocode was not successful for the following reason: ' + status);
      }
   });
}

function codeAddress2(name, latitude, longitude) {
   console.log('成功進入codeAddress2');
   var image = 'images/service_marker.png';
   var marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(latitude, longitude),
      animation: google.maps.Animation.DROP,
      icon: image,
      title: name
   });
   service_marker.push(marker);
}

function parse_address(addr, callback) {
   geocoder = new google.maps.Geocoder();
   console.log('成功進入parse_address');
   geocoder.geocode({
      'address': addr
   }, function (results, status) {
      console.log('geocoder成功');
      console.log(status);
      if (status === google.maps.GeocoderStatus.OK) {
         callback([results[0].geometry.location.lat().toString(), results[0].geometry.location.lng().toString()]);

      } else {
         console.log('Geocode was not successful for the following reason: ' + status);
         callback(null);
      }
   });
}

function changepos() {
   var temp = document.getElementById('new-location').value;
   $('#what-pos').html(temp);
   codeAddress(temp);
   $('#change-pos').modal('hide');
}

function changepos_cur() {
   $('#what-pos').html('我現在位置');
   human_marker[0].setMap(null);
   human_marker = [];
   getLocation();

   $('#change-pos').modal('hide');
}

function show_marker() {
   $.getJSON('php/get_service.php', function (data) {
      console.log(data);
      var len = data.length;
      for (var i = 0; i < len; i++) {
         codeAddress2(data[i][0], data[i][1], data[i][2]);
      }
   });
}

function insert_new_service(service, update) {
   var data = {
         service_name: service.name,
         service_address: service.formatted_address,
         service_phone: service.formatted_phone_number,
         service_stime: service.s_time,
         service_ftime: service.f_time,
         latitude: service.latitude,
         longitude: service.longitude
      };
   if( update ) {
      data.update = true;
   }
   console.log(data);
   $.ajax({
      type: 'POST',
      url: 'php/add_service.php',
      data: data,
      success: function () {
         map.setCenter(new google.maps.LatLng(service.latitude, service.longitude));
      },
      error: function (error) {
         console.log(error.responseText);
      }
   });
   // setTimeout(function () {
   //    document.getElementById('add-info_form').reset();
   // }, 500);
   // codeAddress2(document.getElementById('add_info_name').value, parse_result[0], parse_result[1]);
}

function addinfo_button() {
   if (localStorage.FBinfo) {
      console.log('submit_new_service');
      parse_address(document.getElementById('add_info_address').value, function (data) {
         if (data) {
            var place = {};
            place.name = document.getElementById('add_info_name').value;
            place.formatted_address = document.getElementById('add_info_address').value;
            place.formatted_phone_number = document.getElementById('add_info_phone').value;
            place.s_time = document.getElementById('add_info_stime').value;
            place.f_time = document.getElementById('add_info_ftime').value;
            place.opening_hours = place.s_time + ' ~ ' + place.f_time;
            place.latitude = data[0];
            place.longitude = data[1];
            console.log(place);
            insert_new_service(place);
            createMarker(place);
            $('#DOMWindow').find('p').find('input').val(''); //清空欄位
         }
      });
      // setTimeout(insert_new_service, 1000);
   } else {
      alert('登入後才能使用「補充地圖資訊」!');
   }

}

// 搜尋服務
function scroll(query,flag) {

	if (query) {
		var box1;
		clearOverlays();
		clearServiceMarker();
		$("html,body").animate({
			scrollTop: document.documentElement.clientHeight
		}, 500);

		setTimeout(function () {
			box1 = new AjaxLoader($("#second"));
		}, 500);
		if(flag == 0)
		{
			setTimeout(function () {
				search(query, box1);
			}, 1000);
		}
		else
		{
			setTimeout(function () {
				getServices(query,box1);
			}, 1000)
			infowindow = new google.maps.InfoWindow();
		}
		return false;

	} else {
		alert("你沒有輸入任何東西!");
	}

}

function search(query, box1) {

   var request = {
      location: myLatLng,
      radius: 500,
      query: query
   };

   
   service.textSearch(request, function (results, status) {
      //clearOverlays();
      //clearServiceMarker();
      if (status === google.maps.places.PlacesServiceStatus.OK) {
         status_count = 0;
         for (var i = 0, item; (item = results[i]); i++) {
            placeInfo(item, i, box1, query, results.length);
         }
      }
   });

}

function placeInfo(place, i, box1, query, length) {
   // console.log(place);
   var request = {
      'reference': place.reference,
   };

   service.getDetails(request, function (placeDetail, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
         status_count++;
         placeDetail.formatted_address = place.formatted_address;
         placeDetail.name = place.name;
         googleAddToData(placeDetail, query);
         if (status_count === length)
            getServices(query, box1);
         //box1.remove();
         //createMarker(placeDetail);
      } else {
         //sleep(500);
         setTimeout(function () {
            placeInfo(place, i, box1, query, length);
         }, 500);
         console.log(status);
         //createMarker(place);
      }
   });

}

function getServices(query, box1) { //edited by chenchenchang
   $.ajax({
      type: 'POST',
      dataType: 'json',
      async: false,
      url: 'php/get_service.php',
      data: {
         search_val: query
      },
      success: function (data) {
         console.log(data);
         for (var i = 0, item; (item = data[i]); i++) {
            //console.log('i = '+ i);
            createMarker(item);
            //showOnMap(item['name'], item['longitude'], item['latitude']);
         }
         box1.remove();
      }
   });
}

function googleAddToData(placeDetail, query) {
   var p = placeDetail.geometry.location.toString();
   var patt = new RegExp(/\d+.\d+/ig);
   var result;
   var lat;
   var lng;
   var count = 1;
   while ((result = patt.exec(p)) !== null) {
      if (count === 1) {
         lat = result.toString();
         count = 0;
      } else {
         lng = result.toString();
         count = 1;
      }
   }
   $.ajax({
      type: 'POST',
      url: 'php/google_add_database.php',
      data: {
         service_name: placeDetail.name,
         service_address: placeDetail.formatted_address,
         service_phone: placeDetail.formatted_phone_number,
         tag: query,
         latitude: lat,
         longitude: lng
      },
      success: function () {},
      error: function (error) {
         console.log(error);
      }
   });
}

/**
 * 產生 marker 和 infowindow
 * @param item - 包含完整店家資訊、位置的物件
 */
function createMarker(item) {
   // console.log(placeDetail);
   var marker = new google.maps.Marker({
      icon: 'images/service_marker.png',
      map: map,
      position: new google.maps.LatLng(item.latitude, item.longitude),
   });
   google_service_marker.push(marker);

   google.maps.event.addListener(marker, 'click', function () {
      var content = '<div id="infowindow">';
      content += '<p>名稱： ' + item.name + '</p>';
      content += '<p>地址： ' + item.formatted_address + '</p>';
      content += '<p>電話： ' +( item.formatted_phone_number || '' )+ '</p>';
      content += '<p>營業時間： ' + ( item.opening_hours || '' )+ '</p>';
      content += '<p>標籤： ' + ( item.tag || '' ) + '</p>';
      // content += '<p>評分： ' + '無資料' + '</p>';
      content += '<button id="edit_place">編輯店家資料</button> <button id="edit_position">位置有誤?</button>';
      content += '</div>';
      infowindow.setContent(content);
      infowindow.open(map, this);
      createMarker.marker = marker;
   });
}

$(document).on('click', '#edit_position', function () {
   $('#submit_position').data({ info: $('#infowindow').find('p')});
   infowindow.close();
   $('#add-info_button').hide();
   $('#change-pos_button').hide();
   $('#submit_position').show();
   var status = $('body');
   status.addClass('editing');
   google.maps.event.addListener(map, 'click', function (e) {
      if (status.hasClass('editing')) {
         var marker = createMarker.marker;
         marker.setPosition(e.latLng);
         createMarker.marker.lag = e.latLng.nb;
         createMarker.marker.lng = e.latLng.ob;
      }
   });
});

$(window).scroll(function () {
   var scrollVal = $(this).scrollTop();
   $('#top').css({
      'top': scrollVal
   });
});
$(function () {
   //var s = '';
   //s += ' 網頁可見區域高：'+ document.documentElement.clientHeight;
   //alert(s);
   $('.banner').css({
      'height': document.documentElement.clientHeight * 0.6
   });
   $("#hot_search").css({
      "height": document.documentElement.clientHeight * 0.4
   });
   $("#usual_search").css({
      "height": document.documentElement.clientHeight * 0.4
   });
   $("#usual_search div").css({
	  "width": document.documentElement.clientHeight * 1.2,
	  "height" : "100%",
	  "float":"right"
   });
   $('#search_thing').css({
      'height': document.documentElement.clientHeight * 0.4
   });
   $('#search_form').css({
      'height': document.documentElement.clientHeight * 0.4
   });
   $('#search').css({
      'margin-top': document.documentElement.clientHeight * 0.16
   });
   $('#second').css({
      'height': document.documentElement.clientHeight
   });
   $('#map-canvas').css({
      'height': document.documentElement.clientHeight - 40,
      'margin-top': document.documentElement.clientHeight * 0.0672
   });
   $('#top').css({
      'height': document.documentElement.clientHeight * 0.0672
   });
   $('.banner-head').css({
      'font-weight': document.documentElement.clientHeight * 0.64,
      'font-size': document.documentElement.clientHeight * 0.104
   });
   $('#topic').css({
      'margin-left': document.documentElement.clientHeight * 0.02,
      'padding': document.documentElement.clientHeight * 0.0048,
      'height': document.documentElement.clientHeight * 0.056,
      'width': document.documentElement.clientHeight * 0.208
   });
   $('#top span').css({
      'font-size': document.documentElement.clientHeight * 0.0272,
      'padding': document.documentElement.clientHeight * 0.0168
   });
   $('#search_top').css({
      'height': document.documentElement.clientHeight * 0.04,
      'width': '40%',
      'margin-top': document.documentElement.clientHeight * 0.0112
   });
   $('#search_button_top').css({
      'height': document.documentElement.clientHeight * 0.0432,
      'margin-top': document.documentElement.clientHeight * 0.0112
   });
   $('.back-to-top').css({
      'margin-top': document.documentElement.clientHeight * 0.85,
      'right': '26.969px'
   });
   $('#buttons').css({
      'margin-left': '12px'
   });

   $('.back-to-top').click(function () {
      $('html,body').animate({
         scrollTop: 0
      }, 500);
      return false;
   });
   $("#searchsubmit").click(function () {
      scroll($('#search-tag').val(),0);
      $('#find-service').find('button.close').click();
   });
   $("#search_button").click(function () {
      scroll($('#search').val(),0);
      $('#find-service').find('button.close').click();
   });
   $("#search_button_top").click(function () {
      scroll($('#search_top').val(),0);
      $('#find-service').find('button.close').click();
   });
   $(".store_icon").click(function(){
		var ans = this.getAttribute("value");
		scroll(ans,1);
   });
   $("#hot_search fieldset h1").click(function(){
		var ans = search_name[0];
		scroll(ans,1);
   });
	$("#hot_search fieldset h2").click(function(){
		var ans = search_name[1];
		scroll(ans,1);
   });
	$("#hot_search fieldset h3").click(function(){
		var ans = search_name[2];
		scroll(ans,1);
   });
   hot_search();
});
$(window).resize(function () {
   $('.banner').css({
      'height': document.documentElement.clientHeight * 0.6
   });
   $('#search_thing').css({
      'height': document.documentElement.clientHeight * 0.4
   });
   $('#search_form').css({
      'height': document.documentElement.clientHeight * 0.4
   });
   $('#search').css({
      'margin-top': document.documentElement.clientHeight * 0.16
   });
   $('#second').css({
      'height': document.documentElement.clientHeight
   });
   $('#map-canvas').css({
      'height': document.documentElement.clientHeight - 40,
      'margin-top': document.documentElement.clientHeight * 0.0672
   });
   $('#top').css({
      'height': document.documentElement.clientHeight * 0.0672
   });
   $('.banner-head').css({
      'font-weight': document.documentElement.clientHeight * 0.64,
      'font-size': document.documentElement.clientHeight * 0.104
   });
   $('#topic').css({
      'margin-left': document.documentElement.clientHeight * 0.02,
      'padding': document.documentElement.clientHeight * 0.0048,
      'height': document.documentElement.clientHeight * 0.056,
      'width': document.documentElement.clientHeight * 0.208
   });
   $('#top span').css({
      'font-size': document.documentElement.clientHeight * 0.0272,
      'padding': document.documentElement.clientHeight * 0.0168
   });
   $('#search_top').css({
      'height': document.documentElement.clientHeight * 0.0412,
      'width': '40%',
      'margin-top': document.documentElement.clientHeight * 0.0112
   });
   $('#search_button_top').css({
      'height': document.documentElement.clientHeight * 0.0432,
      'margin-top': document.documentElement.clientHeight * 0.0112
   });
   $('.back-to-top').css({
      'margin-top': document.documentElement.clientHeight * 0.85,
      'right': '26.969px'
   });
   $('#buttons').css({
      'margin-left': '12px'
   });
});

// Binding events
$(function(){
   $('#nowpos').click(function(){
      changepos_cur();
   });
   $('#changeposition').click(function(){
      changepos();
   });
   $('#addinfosubmit').click(function(){
      addinfo_button();
   });
   $('#edit_place').click(function(e){
      e.preventDefault();
      var data = $(this).siblings(); console.log(data);
      $('#add_info_name').attr('value', (data[0].textContent).substr(4));
      $('#add_info_address').attr('value', (data[1].textContent).substr(4));
      $('#add_info_phone').attr('value', (data[2].textContent).substr(4));
      $('#add_info_tag').attr('value', (data[4].textContent).substr(4));
      $('#add-info_button').click();
   });
   $('#submit_position').click(function(){
      if( createMarker.marker && createMarker.marker.lag ){
         var marker = createMarker.marker,
            $info = $(this).data('info'), service = {};

         console.log('Lag='+ marker.lag + ', lng=' + marker.lng );
         console.log($info);

         service.name = ($info[0].textContent).substr(4);
         service.formatted_address = ($info[1].textContent).substr(4);
         service.formatted_phone_number = ($info[2].textContent).substr(4);
         service.s_time = ($info[3].textContent).substr(6);
         service.f_time = ($info[3].textContent).substr(6);
         service.latitude = marker.lag;
         service.longitude = marker.lng;

         insert_new_service(service,"update");
      }
      $('body').removeClass('editing');
      $('#add-info_button').show();
      $('#change-pos_button').show();
      $('#submit_position').hide();
   });
});

function clearOverlays() {
   if (google_service_marker) {
      for (var i in google_service_marker) {
         google_service_marker[i].setMap(null);
      }
   }
}

function clearServiceMarker() {
   if (service_marker) {
      for (var i in service_marker) {
         service_marker[i].setMap(null);
      }
   }
}

function AjaxLoader(el, options) {
   // Becomes this.options
   var defaults = {
      bgColor: '#361B1B',
      duration: 800,
      opacity: 0.7,
      classOveride: false
   };
   this.options = $.extend(defaults, options);
   this.container = $(el);

   this.init = function () {
      var container = this.container;
      // Delete any other loaders
      this.remove();
      // Create the overlay 
      var overlay = $('<div></div>').css({
         'background-color': this.options.bgColor,
         'opacity': this.options.opacity,
         'width': container.width(),
         'height': container.height(),
         'position': 'absolute',
         'top': document.documentElement.clientHeight,
         'left': '0px',
         'z-index': 1000
      }).addClass('ajax_overlay');
      // add an overiding class name to set new loader style 
      if (this.options.classOveride) {
         overlay.addClass(this.options.classOveride);
      }
      // insert overlay and loader into DOM 
      container.append(
         overlay.append(
            $('<div></div>').addClass('ajax_loader')
         ).fadeIn(this.options.duration)
      );
   };

   this.remove = function () {
      var overlay = this.container.children('.ajax_overlay');
      if (overlay.length) {
         overlay.fadeOut(this.options.classOveride, function () {
            overlay.remove();
         });
      }
   };

   this.init();
}

function hot_search()
{
	$.ajax({
		type : "post",
		url : "php/getSearchTopk.php",
		dataType: 'json',
		async: false,
		data : {},
		success: function (data){
			console.log(data);
			for(var i = 0 ; i < data.length;i++)
			{
				search_name[i] = data[i];
				console.log(search_name[i]);
			}
			$("#hot_search fieldset h1").text("1."+data[0]);
			$("#hot_search fieldset h2").text("2."+data[1]);
			$("#hot_search fieldset h3").text("3."+data[2]);
		}
	});
}
