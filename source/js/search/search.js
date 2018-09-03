var resizeMap = function () {
    var h = $(window).outerHeight() - $('.search-container .filter').outerHeight() -
        $('.search-container .search-input').outerHeight();

    $('.result-container .map').height(h);
    $('.result-container').css('min-height', h);
    $('.result-container').css('height', $('.result-container .results ').outerHeight());
}

$(document).ready(function() {
    // FIRST TYPE
        $('[data-popup-id]').on('click', function(e) {
            $(e.target).blur();

            var el = $('#' + $(e.target).closest('a').attr('data-popup-id'));

            if (!el.length)
                return false;

            var openPopup = function() {
                $.magnificPopup.open({
                    items: {
                        src: el
                    },
                    type: 'inline',
                    callbacks: {
                        open: function() {
                            // $(e.target).closest('a').addClass('opened');
                        },
                        close: function() {
                            // Перепиши это как хочешь)
                            $(e.target).closest('a').text(($.map(el.find('input[type="checkbox"]:checked'), function (item) { return $(item).find('+label').text().trim() })).join(', ') || $(e.target).closest('a').attr("data-placeholder"));
                            $(e.target).closest('a').removeClass('opened');
                        }
                    }
                });
            }

            $(e.target).closest('a').addClass('opened');

            // WAIT ANIMATION AND SHOW
                setTimeout(function() {
                    openPopup();
                }, 800);
        });

    // SECOND TYPE
        $('.data-merged-popup').on('click', function(e) {
            $(e.target).blur();

            var el = $(e.target).closest('a');

            $(e.target).closest('a').toggleClass('opened');
        });

        $('.data-merged-popup').parent().on('mouseleave', function(e) {
            if ($(e.target).closest('.item').find('.opened').length) {
                $(e.target).closest('.item').find('a').text(
                    ($.map($(e.target).closest('.item').find('input[type="checkbox"]:checked'), function(item) { 
                        return $(item).find('+label').text().trim()
                    })).join(', ') || $(e.target).attr("data-placeholder"));


                $(e.target).closest('.item').find('.opened').removeClass('opened');
            }
        });

    $('.close').on('click', function(e) {
        $(e.target).blur();
        $(e.target).closest('button').toggleClass('ok-mod');
    });

    if ($('#search-map').length) {
        function init(){     
            myMap = new ymaps.Map("search-map", {
                center: [55.76, 37.44],
                zoom: 7,
                controls: [],
                behaviors: [],
            });

            var accessor = myMap.copyrights.add('&copy; RosComputing');

        }
        ymaps.ready(init);
        var myMap;

    }

    $('#visible-storage').on('change', function(e) {
        $('.result-container .results').toggleClass('full');
        resizeMap();
    });

    $('.add-to-liked').bind('click', function(e) {
        $(e.target).blur();
        $(e.target).closest('button').toggleClass('added');
        return false;
    });

    $('.events-button').bind('click', function(e) {
        $(e.target).blur();
        $(e.target).closest('button').toggleClass('new-event');

        return false;
    });


    $(window).on('scroll', function(e) {
        var scrTop = $(window).scrollTop();
        if (scrTop >= $('header').outerHeight()) {
            if (!$('.search-container').hasClass('fixed'))
                $(document).scrollTop($('header').outerHeight() + 1); 
            $('.search-container').addClass('fixed');
        }
        else
            $('.search-container').removeClass('fixed');
    });

    $(window).on('resize', function(e) {
        resizeMap();
    });

    $(window).trigger('resize');

   

});