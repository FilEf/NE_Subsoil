var makeBeautifulScroll = function(el) {
	if (!el.length)
		return false;

	var el = $(el[0]);

	if (el.hasClass('beautiful-scroll'))
		return false;

	// Формируем 
		var scroll = $('<div class="b-scroll"/>').append('<button type="button"/>');
		el.append(scroll);
		el.addClass('beautiful-scroll');

	// UPDATE
		var change = function() {
			// VISIBLE
				if (!(el[0].scrollHeight - el.outerHeight()))
					el.find(' > .b-scroll').hide();

			// HEIGHT
			    el.find(' > .b-scroll').css('height', el[0].scrollHeight);

			// HEIGHT BUTTON
				var butH = el.outerHeight() / 6;
				var scrollDelta = (el[0].scrollHeight - el.outerHeight());
				if (el.outerHeight() < scrollDelta)
					butH = butH / (scrollDelta / el.outerHeight());
				butH = Math.max(butH, 30);
			    el.find(' > .b-scroll button').css('height', butH);
		}
		change();

	// STORY
		el[0].bScroll = {
			delta: Math.min(el.outerHeight() / 3, (el[0].scrollHeight - el.outerHeight()) / 4),
			offsetY: 0
		}


	var mouseUp = function(e) {
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
	}
	var mouseMove = function(e) {
		if (!el[0].bScroll)
			return false;

		// Получили высоту кнопки
			var butH = el.find(' > .b-scroll button').outerHeight();

		// Считаем разницу с началом (где курсор наш есть)
			var diff = -(el.offset().top - $(window).scrollTop() - e.clientY) - el[0].bScroll.offsetY;

		// Находим процент прокрутки / 100
			h = diff / (el.outerHeight() - butH);
			h = Math.max(h, 0);
			h = Math.min(h, 1);

		// Новую позицию	
			var fScrollTop = h * (el[0].scrollHeight - el.outerHeight());
	    
	    // Двигаем документ
		    el.scrollTop(fScrollTop);

	    // Находим позицию ползунка
		    var scrollPos = fScrollTop + h * (el.outerHeight() - butH);

		// Двигаем
		    el.find('.b-scroll button').css('top', scrollPos);

		return false;
	}

	var scrollTo = function(fScrollTop, mode) {
		// Ограничения
			fScrollTop = Math.max(fScrollTop, 0);
			fScrollTop = Math.min(fScrollTop, el[0].scrollHeight - el.outerHeight());

		// VALIDATE
			if (!(el[0].scrollHeight - el.outerHeight()))
				return false;

		// FOR SCROLL BUTTON
		    var h = fScrollTop / (el[0].scrollHeight - el.outerHeight());
		    var pos = fScrollTop + el.outerHeight() * h;
		    pos -= el.find('.b-scroll button').outerHeight() * h;

	    // MOVE
            if (mode != "fast") {
			    el.find('.b-scroll button').stop().animate({
			    	top: pos,
			    }, 'fast');

			    el.stop().animate({
			    	scrollTop: fScrollTop,
			    }, 'fast');
			} else {
	            el.find('.b-scroll button').css('top', pos);
	            el.scrollTop(fScrollTop);
	        }
	}
  	
    // EVENTS
			el.on('DOMNodeInserted resize', function(e) {
				change();
				scrollTo(el.scrollTop());
			});
			
    	// MOUSE WHEEL
			el.on('DOMMouseScroll mousewheel', function(e) {
				if (!el[0].bScroll)
					return false;

				var fScrollTop = el.scrollTop() - 
					Math.sign(e.originalEvent.wheelDelta || -e.originalEvent.detail) * el[0].bScroll.delta

				scrollTo(fScrollTop);

				return false;
			});

		// MOUSEDOWN
			el.find(' > .b-scroll button').off('mousedown');
			el.find(' > .b-scroll button').on('mousedown', function(e) {
				if (!el[0].bScroll)
					return false;

				if (e.type == "touchstart") {
                       
                }
                else {
                    el[0].bScroll.offsetY = (e.offsetY || e.offsetY - $(e.target).offset().top);

					window.addEventListener('mouseup', mouseUp);
			        window.addEventListener('mousemove', mouseMove);
			 	}
			});

			var touchMove = function(e) {
	            if (!el[0].bScroll)
	                return false;

	            var touch = e.touches[0] || e.changedTouches[0];
	            var clientY = touch.clientY;

	            // Получили высоту кнопки
	                var butH = el.find(' > .b-scroll button').outerHeight();

	            // Считаем разницу
	                var diff = -(clientY - el[0].bScroll.offsetY);

	                fScrollTop = el.scrollTop() + parseInt(diff);
	                
	                el[0].bScroll.offsetY = clientY;
	                scrollTo(fScrollTop, 'fast');
	                return false;
	        }

	        var touchUp = function(e) {
	            window.removeEventListener('touchmove', touchMove);
	            window.removeEventListener('touchend', touchUp);
	        }

	        el.off('touchstart');
	        el.on('touchstart', function(e) {
	            if (!el[0].bScroll)
	                return false;

	            if (e.type == "touchstart") {
	                var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
	                el[0].bScroll.offsetY = touch.clientY;

	                window.addEventListener('touchend', touchUp);
	                window.addEventListener('touchmove', touchMove);
	            }

	            event.stopPropagation();
	            event.preventDefault();
	            return false;
	        });

}