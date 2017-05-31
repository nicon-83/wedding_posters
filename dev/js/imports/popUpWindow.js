;'use strict';
/*
Плагин создает, показывает и через заданный промежуток времени удаляет всплывающее окно при клике на элементе-родителе
ВАЖНО! плагин должен быть применен только к одному элементу на странице
Элемент-родитель (parent) должен быть объектом jQuery
Вызов $().addPopUp(arguments)
Плагин имеет 5 методов:
1. create ---> $(...).addPopUp('create', 'parent') - создает всплывающее окно и привязывает его к родителю, аргумент parent обязателен!
2. setPos ---> $(...).addPopUp('setPos', 'parent') - позиционирует всплывающее окно на странице
3. show ---> $(...).addPopUp('show') - показывает всплывающее окно (анимация)
4. hide ---> $(...).addPopUp('show') - скрывает всплывающее окно и удаляет объект из DOM дерева
5. init ---> $(...).addPopUp(options) - установка родителю position: relative, инициализация события(click) на элементе-родителе и объекте window, при изменении размера окна запускается метод setPos для поддержания позиции окна по отношению к его родителю
options = {
	showTime: время анимации показа (число в ms),
	hideTime: время анимации скрытия (число в ms),
	hideTimeout: время отображения окна на странице, по истечении которого окно будет скрыто (число в ms),
	positionOffset: высота нижней границы окна над родителем (число),
	popUpWindowClass: класс который будет применен к созданному всплывающему окну,
	parentLinksSelector: селектор ссылок размещенных во всплывающем окне,
	containerSelector: селектор основного контейнера документа,
	nodes: [
		массив ссылок которые необходимо разместить во всплывающем окне
	]
}
*/
(function($){
	var count,
		 popUpWindow,
		 settings = {
		 	showTime: 800,
		 	hideTime: 800,
		 	hideTimeout: 6000,
		 	positionOffset: 15
		 };

	var methods = {
		init: function(options){
			settings = $.extend(settings, options);

			var self = this;

			this.each(function(){
				$(this).css('position', 'relative')
						 .on('click', function(){
						 	methods.create($(this));
						 	methods.setPos($(this));
						 	methods.show($(this));
						 	if (!count){
						 		count = setTimeout(function(){
						 			methods.hide($(self));
						 		}, settings.hideTimeout);
						 	}
						 });
			});

			$(window).on('resize', function(){
				methods.setPos($(self));
			});
			return this;
		},

		create: function (parent){
			if (!popUpWindow){
				var elem =  $('<div></div>')
					.css('position','absolute')
					.addClass(settings.popUpWindowClass)
					.append(settings.nodes)
					.appendTo(parent)
					.hide();
				$(settings.parentLinksSelector).attr('target', '_blank');
				popUpWindow = elem;
				return this;
			}
		},

		setPos: function (parent){
			if(popUpWindow){
				var popUpWindowWidth = popUpWindow.outerWidth(),
					 parentWidth = parent.outerWidth(),
					 parentHeight = parent.outerHeight(),
					 wrapperWidth = $(settings.containerSelector).outerWidth();
					 wrapperLeftBorder = $(settings.containerSelector).offset().left;
					 wrapperRightBorder = wrapperLeftBorder + wrapperWidth;
					 parentLeftBorder = parent.offset().left;
					 parentRightBorder = parentLeftBorder + parentWidth;
					 rightSpace = wrapperRightBorder - parentRightBorder;
					 leftSpace = parentLeftBorder - wrapperLeftBorder;
				if(rightSpace < popUpWindowWidth/2){
					popUpWindow.css('left', '');
					popUpWindow.css('right', '5px');
				} else if (leftSpace < popUpWindowWidth/2){
					popUpWindow.css('right', '');
					popUpWindow.css('left', '5px');
				} else {
					popUpWindow.css('right', '');
					popUpWindow.css('left', (parentWidth - popUpWindowWidth)/2 + 'px');
				}
				popUpWindow.css('bottom', parentHeight + settings.positionOffset + 'px');
				return this;
			}
		},

		show: function (parent){
			if (popUpWindow){
				popUpWindow.slideDown(settings.showTime);
			}
			return this;
		},

		hide: function (parent){
			if(popUpWindow){
				popUpWindow.slideUp(settings.hideTime, function(){
					popUpWindow.remove();
					popUpWindow = undefined;
					count = undefined;
				});
				return this;
			}
		}
	}

	$.fn.addPopUp = function(action){
		if(methods[action]){
			return methods[action].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if(typeof action === 'object' || !action){
			return methods.init.apply(this, arguments);
		} else {
			console.info('Method ' + action + ' not found in this plugin');
			return this;
		}
	};

})(jQuery);