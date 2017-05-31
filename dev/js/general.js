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
			'<a href="./Calculator/index.html">Калькулятор на javascript</a>',
			'<a href="./trafficLight/index.html">Светофор на javascript</a>',
			'<a href="./calendar/index.html">Календарь на javascript</a>'
		]
	});

$(document).ready(function(){
	addActive();
});