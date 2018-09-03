// ToDo: VERY TEMP
$(document).ready(function () {
    $('.tooltip').tooltipster({
        theme: 'tooltipster-borderless',
        side: 'left'
    });

    $("#login_btn").click(function () {
        var url = $("#currentUrl").val().replace("Action_Id", "Login");
        window.location.href = url;
    });

    $("#reg_btn").click(function () {
        var url = $("#currentUrl").val().replace("Action_Id", "Register");
        window.location.href = url;
    });

    // Select source
    if ($("#sourceList").length) {
        $("#sourceList").change(function () {
            var url = "/subsurface/" + $(this).attr("data-id") + "/" + $(this).val();
            if (location.href.indexOf('geology') > -1)
                url += "/geology";
            else if (location.href.indexOf('works') > -1)
                url += "/works";
            window.location.href = url;
        });
    }
    // HEADER
    $('header .login > button').bind('click', function (e) {
        $(e.target).blur();
        $('header .login').toggleClass('opened');
    });
    $(document).bind('click', function (e) {
        if (!$(e.target).closest('.login').length)
            if ($('header .login').hasClass('opened')) {
                $('header .login').removeClass('opened');
                return false;
            }
    });

    // Menu 
    var findActiveMenuItem = function () {
        var sTop = $(window).scrollTop();
        var sectionIsFound = false;
        $.each($('.menu-block div.white ul li a'), function (k, el) {
            if ($($(el).attr('href')).length) {
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
        findActiveMenuItem();
    }, 0);

    // TOOLTIP EXAMPLE
    if ($('.simple-html-tooltip').length)
        $('.simple-html-tooltip').tooltipster({
            trigger: 'hover',
            onlyOne: true,
            touchDevices: true,
            maxWidth: $(window).width() / 2,
            repositionOnScroll: true,
            touchDevices: true,
            contentAsHTML: true,
            interactive: true,
            position: "right",

            functionInit: function (instance, helper) {
                var content = $('#' + $(helper.origin).attr('tooltip-content-id')).html();
                instance.content(content);
            },
        });

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
                            $(".is-favorite").show();
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
                            $(".is-favorite").hide();
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

    $("#get-rating-button").bind('click', function () {
        var that = this;
        if ($(this).attr("data-valuation").toLowerCase() == "true" || $(this).attr("data-authenticated").toLowerCase() == "false") {
            if ($(this).attr("data-valuation").toLowerCase() == "true"){
                $("#get-rating .text > p").html($("#get-rating .text > input[type='hidden']").val());
            }
            $.magnificPopup.open({
                items: {
                    src: "#get-rating"
                },
                type: 'inline'
            });
        } else {
            $.magnificPopup.open({
                items: {
                    src: "#get-rating-popup"
                },
                type: 'inline'
            });
        }
    });

    $("#get-rating-popup-button").bind('click', function () {
        var id = $("#get-rating-button").attr("data-id");
        $.ajax({
            url: globalVars.consts.AbsoluteUri + "/api/subsurface/request_valuation?informationId=" + id,
            dataType: "json",
            type: "POST",
            success: function (result) {
                if (!!result && result.result) {
                    $("#get-rating-button").attr("data-valuation", "true");
                    $("#get-rating-popup").magnificPopup("close");
                    if (!!result.favoriteId) {
                        $("#add-to-favorites").addClass("added");
                        $("#add-to-favorites").attr("data-favorite-id", result.favoriteId);
                    }
                } else {
                    console.log(result.Error);
                }
            }
        });;
    });

    $("#to-licensing-button").bind('click', function () {
        var that = this;
        if ($(this).attr("data-offered").toLowerCase() == "true" || $(this).attr("data-authenticated").toLowerCase() == "false") {
            if ($(this).attr("data-offered").toLowerCase() == "true"){
                $("#to-licensing .text > p").text($("#to-licensing .text > input[type='hidden']").val());
            }
            $.magnificPopup.open({
                items: {
                    src: "#to-licensing"
                },
                type: 'inline'
            });
        } else {
            $.magnificPopup.open({
                items: {
                    src: "#to-licensing-popup"
                },
                type: 'inline'
            });
        }
    });

    $("#to-licensing-popup-button").bind('click', function () {
        var id = $("#to-licensing-button").attr("data-id");
        $.ajax({
            url: globalVars.consts.AbsoluteUri + "/api/subsurface/offer_licensing?informationId=" + id,
            dataType: "json",
            type: "POST",
            success: function (result) {
                if (!!result && result.result) {
                    $("#to-licensing-button").attr("data-offered", "true");
                    $("#to-licensing-popup").magnificPopup("close");
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

    $(".load-more-subsurfaces").bind('click', function () {
        $(".subsurfaces-list li").show();
        $(this).hide();
        $(".pagination-block-subsurface label span").text($(".subsurfaces-list li").length);
    });

    $(".load-more-documents").bind('click', function () {
        $(".documents-list li").show();
        $(this).hide();
        $(".pagination-block-documents label span").text($(".subsurfaces-list li").length);
    });

    $(".add-to-liked-document").bind('click', function (e) {
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
                            $(e.currentTarget).closest("button").tooltipster('content', globalVars.consts.AddToFavorites);
                        }
                    }
                });
            } else {
                var id = $(this).attr("data-id");
                $.ajax({
                    url: globalVars.consts.AbsoluteUri + "/api/favorites/add_document?documentId=" + id,
                    dataType: "json",
                    type: "POST",
                    success: function (result) {
                        if (!!result && result.IsSuccessful) {
                            $(that).attr("data-favorite-id", result.favoriteId);
                            $(that).addClass("added");
                            $(e.currentTarget).closest("button").tooltipster('content', globalVars.consts.RemoveFroFavorites);
                        }
                    }
                });
            }
        } else {
            var id = $(this).attr("data-id");
            $("#currentUrl").val($("#documentUrl").val().replace("document_value_id", id));
            $.magnificPopup.open({
                items: {
                    src: "#to-liked-dialog"
                },
                type: 'inline'
            });
        }
        return false;
    });

    $(".add-to-liked-subsurface").bind('click', function (e) {
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
                            $(that).attr("data-favorite-id", result.favoriteId);
                            $(that).addClass("added");
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
        return false;
    });

    $("#to-forming-request-button").bind('click', function () {
        var that = this;
        if ($(this).attr("data-forming").toLowerCase() == "true" || $(this).attr("data-authenticated").toLowerCase() == "false") {
            if ($(this).attr("data-forming").toLowerCase() == "true") {
                $("#to-forming-request .text > p").text($("#to-forming-request .text > input[type='hidden']").val());
            }
            $.magnificPopup.open({
                items: {
                    src: "#to-forming-request"
                },
                type: 'inline'
            });
        } else {
            $.magnificPopup.open({
                items: {
                    src: "#to-forming-request-popup"
                },
                type: 'inline'
            });
        }
    });

    $("#to-forming-request-popup-button").bind('click', function () {
        var id = $("#to-forming-request-button").attr("data-id");
        $.ajax({
            url: globalVars.consts.AbsoluteUri + "/api/subsurface/forming_request?informationId=" + id,
            dataType: "json",
            type: "POST",
            success: function (result) {
                if (!!result && result.result) {
                    $("#to-forming-request-button").attr("data-forming", "true");
                    $("#to-forming-request-popup").magnificPopup("close");
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
})