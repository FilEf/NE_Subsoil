// ToDo: VERY TEMP
$(document).ready(function () {
    $("#login_btn").click(function () {
        var url = $("#currentUrl").val().replace("Action_Id", "Login");
        window.location.href = url;
    });

    $("#reg_btn").click(function () {
        var url = $("#currentUrl").val().replace("Action_Id", "Register");
        window.location.href = url;
    });

    $('.tooltip').tooltipster({
        theme: 'tooltipster-borderless',
        side: 'left'
    });
    // Menu 
    var findActiveMenuItem = function () {
        var sTop = $(window).scrollTop();
        var sectionIsFound = false;
        $.each($('.menu-block div ul li a'), function (k, el) {
            if ($(el).attr('href').startsWith('#') && !!$($(el).attr('href')).length) {
                // var top,h = $($(el).attr('href')).offset().top, $($(el).attr('href')).height();
                var top = $($(el).attr('href')).offset().top;
                var h = $($(el).attr('href')).height();

                if ((sTop >= top - 100) && (sTop <= top + h)) {
                    if (!$(el).hasClass('active')) {
                        $('.menu-block div ul li a.active').removeClass('active');
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
            $('.menu-block div ul li a.active').removeClass('active');
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
            $("html, body").stop().animate({
                scrollTop: $($(e.target).attr('href')).offset().top - 50
            }, 500, 'swing');
            return false;
        }

    });

    $('.menu-block').bind('mouseleave', function (e) {
        findActiveMenuItem();
    });
    setTimeout(function () {
        findActiveMenuItem();
    }, 0);

    $("#add-to-favorites").bind('click', function (e) {
        if ($("#add-to-favorites").attr("data-user-authenticated").toLowerCase() == "true") {
            if ($("#add-to-favorites").hasClass("added")) {
                var id = $(this).attr("data-favorite-id");
                $.ajax({
                    url: globalVars.consts.AbsoluteUri + "/api/favorites/remove_favorite?favoriteId=" + id,
                    dataType: "json",
                    type: "POST",
                    success: function (result) {
                        if (!!result && result.IsSuccessful) {
                            $("#add-to-favorites").attr("data-favorite-id", "");
                            $("#add-to-favorites").removeClass("added");
                            $(e.currentTarget).closest("button").tooltipster('content', globalVars.consts.AddToFavorites);
                        }
                    }
                });
            } else {
                var id = $(this).attr("data-id");
                $.ajax({
                    url: globalVars.consts.AbsoluteUri + "/api/favorites/add_subsurface?subsurfaceId=" + id,
                    dataType: "json",
                    type: "POST",
                    success: function (result) {
                        if (!!result && result.IsSuccessful) {
                            $("#add-to-favorites").attr("data-favorite-id", result.favoriteId);
                            $("#add-to-favorites").addClass("added");
                            $(e.currentTarget).closest("button").tooltipster('content', globalVars.consts.RemoveFroFavorites);
                        }
                    }
                });
            }
        } else {
            var id = $(this).attr("data-id");
            $("#currentUrl").val($("#subsurfaceUrl").val().replace("subsurface_value_id", id));
            $.magnificPopup.open({
                items: {
                    src: "#to-liked-dialog"
                },
                type: 'inline'
            });
        }
    });

    $(".add-to-liked:not(.parent)").bind('click', function (e) {
        var that = this;
        if ($(this).attr("data-user-authenticated").toLowerCase() == "true") {
            if ($(this).hasClass("added")) {
                var id = $(this).attr("data-favorite-id");
                $.ajax({
                    url: globalVars.consts.AbsoluteUri + "/api/favorites/remove_favorite?favoriteId=" + id,
                    dataType: "json",
                    type: "POST",
                    success: function (result) {
                        if (!!result && result.IsSuccessful) {
                            $(that).attr("data-favorite-id", "");
                            $(that).removeClass("added");
                            $(e.currentTarget).closest("button").tooltipster('content', 'Добавить в избранное');
                        }
                    }
                });
            } else {
                var id = $(this).attr("data-id");
                var url = "";
                if ($(this).hasClass("subsurface"))
                    url = "add_subsurface?subsurfaceId=";
                else if ($(this).hasClass("document"))
                    url = "add_document?documentId=";
                $.ajax({
                    url: globalVars.consts.AbsoluteUri + "/api/favorites/" + url + id,
                    dataType: "json",
                    type: "POST",
                    success: function (result) {
                        if (!!result && result.IsSuccessful) {
                            $(that).attr("data-favorite-id", result.favoriteId);
                            $(that).addClass("added");
                            $(e.currentTarget).closest("button").tooltipster('content', 'Удалить из избранного');
                        }
                    }
                });
            }
        } else {
            var id = $(this).attr("data-id");
            if ($(this).hasClass("subsurface"))
                $("#currentUrl").val($("#subsurfaceUrl").val().replace("subsurface_value_id", id));
            else if ($(this).hasClass("document"))
                $("#currentUrl").val($("#documentUrl").val().replace("document_value_id", id));
            $.magnificPopup.open({
                items: {
                    src: "#to-liked-dialog"
                },
                type: 'inline'
            });
        }
    });
});