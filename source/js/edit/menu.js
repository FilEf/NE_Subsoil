$(document).ready(function () {
    $(".menu-block .menu a").bind('click', function () {
        if (!$(this).hasClass("active")) {
            $(".menu-block .menu a").removeClass("active");
            $(this).addClass("active");
            findWhiteMenuItems();
            return false
        }
    });

    var findWhiteMenuItems = function () {
        var id = $(".menu-block .menu a.active").attr("data-id");
        $(".surface-section").hide();
        $("." + id).show();
        $(".menu-block .white ul li").hide();
        $(".menu-block .white ul li." + id).show();
        window.editVM.subsurfaceCategoryOnChange();
    }

    var findActiveMenuItem = function () {
        var sTop = $(window).scrollTop();
        var sectionIsFound = false;
        $.each($('.menu-block div.white ul li a'), function (k, el) {
            if ($($(el).attr('href')).length && $($(el).attr('href')).is(":visible")) {
                // var top,h = $($(el).attr('href')).offset().top, $($(el).attr('href')).height();
                var top = $($(el).attr('href')).offset().top;
                var h = $($(el).attr('href')).height();

                if ((sTop >= top - 100) && (sTop <= top + h)) {
                    if (!$(el).hasClass('active')) {
                        $('.menu-block div.white ul li a.active').removeClass('active');
                        $(el).addClass('active');
                    }
                    $('.menu-block .smailer').show();

                    var left = $(el).closest('li').position().left + 11;
                    var w = $(el).closest('li').width();
                    
                    $('.menu-block .smailer').show();
                    $('.menu-block .smailer').css('left', left);
                    $('.menu-block .smailer').css('width', w);
                    sectionIsFound = true;
                }
            }
        });
        if (!sectionIsFound) {
            $('.menu-block div.white ul li a.active').removeClass('active');
            $('.menu-block .smailer').hide();
        }
    }

    $(document).bind('scroll', function (e) {
        var sTop = $(window).scrollTop();

        if ($('.menu-block').parent().offset().top - sTop > -60) {
            $('.menu-block').removeClass('fixed');
        } else {
            $('.menu-block').addClass('fixed');
        }

        findActiveMenuItem();
    });

    var lastMenuId = $('.menu-block ul').length
    // $('.menu-block > ul:nth-child(' + lastMenuId + ') li').bind('mouseover', function(e) {
    // 	var left = $(e.target).closest('li').position().left;
    // 	var w = $(e.target).closest('li').width();
    // 	$('.menu-block .smailer').show();
    // 	$('.menu-block .smailer').css('left', left);
    // 	$('.menu-block .smailer').css('width', w);
    // });
    $('.menu-block ul:nth-child(' + (lastMenuId - 1) + ') li a').bind('click', function (e) {
        if ($($(e.target).attr('href')).length) {
            location.hash = $(e.target).attr('href');
            var scrollTop = $($(e.target).attr('href')).offset().top - 90;
            $("html, body").stop().animate({
                scrollTop: scrollTop
            }, 500, 'swing');
            return false;
        }

    });

    $('.menu-block').bind('mouseleave', function (e) {
        findActiveMenuItem();
    });

    setTimeout(function () {
        findWhiteMenuItems();
        findActiveMenuItem();
    }, 0);
});