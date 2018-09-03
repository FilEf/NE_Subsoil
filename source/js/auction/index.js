// ToDo: VERY TEMP
$(document).ready(function () {
    $('.tooltip').tooltipster({
        theme: 'tooltipster-borderless',
        side: 'left'
    });
    // Menu 
    var findActiveMenuItem = function () {
        var sTop = $(window).scrollTop();
        var sectionIsFound = false;
        $.each($('.menu-block div ul li a'), function (k, el) {
            if ($($(el).attr('data-href')).length) {
                // var top,h = $($(el).attr('href')).offset().top, $($(el).attr('href')).height();
                var top = $($(el).attr('data-href')).offset().top;
                var h = $($(el).attr('data-href')).height();

                if ((sTop >= top - 100) && (sTop <= top + h)) {
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
            $.magnificPopup.open({
                items: {
                    src: "#to-liked-dialog"
                },
                type: 'inline'
            });
        }
    });

    $("#form-request-button").bind('click', function () {
        var that = this;
        if ($(this).attr("data-forming").toLowerCase() == "true" || $(this).attr("data-authenticated").toLowerCase() == "false") {
            if ($(this).attr("data-forming").toLowerCase() == "true") {
                $("#form-request .text > p").text($("#form-request .text > input[type='hidden']").val());
            }
            $.magnificPopup.open({
                items: {
                    src: "#form-request"
                },
                type: 'inline'
            });
        } else {
            $.magnificPopup.open({
                items: {
                    src: "#form-request-popup"
                },
                type: 'inline'
            });
        }
    });

    $("#form-request-popup-button").bind('click', function () {
        var id = $("#form-request-button").attr("data-id");
        $.ajax({
            url: globalVars.consts.AbsoluteUri + "/api/subsurface/forming_request?informationId=" + id,
            dataType: "json",
            type: "POST",
            success: function (result) {
                if (!!result && result.result) {
                    $("#form-request-button").attr("data-forming", "true");
                    $("#form-request-button").magnificPopup("close");
                    if (!!result.favoriteId) {
                        $("#add-to-favorites").addClass("added");
                        $("#add-to-favorites").attr("data-favorite-id", result.favoriteId);
                    }
                } else {
                    console.log(result.Error);
                }
            }
        });
    });
});