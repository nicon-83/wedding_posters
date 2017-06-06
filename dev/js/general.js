;'use strict';

//= ./imports/popUpWindow.js

function addActive() {
	var hrefUrl = $(location).attr('href').split('/').pop(),
		 links = $('nav a');

	links.each(function(){
		var hrefLink = $(this).attr('href').split('/').pop();
		$(this).removeClass('active');
		if(hrefLink === hrefUrl){
			$(this).addClass('active');
		}
	});
}

$('#works').addPopUp({
		popUpWindowClass: 'my_works',
		parentLinksSelector: '#works a',
		containerSelector: '.wrapper',
		nodes: [
			'<div><a href="./calculator/index.html">Калькулятор на javascript</a><span> | </span><a href="https://github/nicon-83/calculator.git">GitHub</a></div>',
			'<div><a href="./trafficLight/index.html">Светофор на javascript</a><span> | </span><a href="https://github.com/nicon-83/traffic_light.git">GitHub</a></div>',
			'<div><a href="./calendar/index.html">Календарь на javascript</a><span> | </span><a href="https://github.com/nicon-83/calendar.git">GitHub</a></div>'
		]
	});

$(document).ready(function(){
	addActive();
});