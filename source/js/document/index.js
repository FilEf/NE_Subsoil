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
    $(".downloadDoc").bind('click', function () {
        var url = $("#fileDownloadUrl").val();
        var extension = $("#fileExtension").val();
        console.log(globalVars.consts.AbsoluteUri + url,"log")
        window.location.href = globalVars.consts.AbsoluteUri + url;
        //window.open(, "_blank");
        /*if (extension == "pdf") {
            window.open("../" + url, "_blank");
        } else {
            location.href = "../" + url;
        }*/
    });
    $(".openDoc").bind('click', function () {
        var url = $("#fileViewUrl").val();
        var extension = $("#fileExtension").val();
        window.open(globalVars.consts.AbsoluteUri + url, "_blank");
    });
    $("#add-to-favorites-document").bind('click', function (e) {
        if ($("#add-to-favorites-document").attr("data-user-authenticated").toLowerCase() == "true") {
            if ($("#add-to-favorites-document").hasClass("added")) {
                var id = $(this).attr("data-favorite-id");
                $.ajax({
                    url: globalVars.consts.AbsoluteUri + "/api/favorites/remove_favorite?favoriteId=" + id,
                    dataType: "json",
                    type: "POST",
                    success: function (result) {
                        if (!!result && result.IsSuccessful) {
                            $("#add-to-favorites-document").attr("data-favorite-id", "");
                            $("#add-to-favorites-document").removeClass("added");
                            $(e.currentTarget).closest("button").tooltipster('content', globalVars.consts.AddToFavorites);
                            $("#request-send .favorite").show();
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
                            $("#add-to-favorites-document").attr("data-favorite-id", result.favoriteId);
                            $("#add-to-favorites-document").addClass("added");
                            $(e.currentTarget).closest("button").tooltipster('content', globalVars.consts.RemoveFroFavorites);
                            $("#request-send .favorite").hide();
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
                else if ($(this).hasClass("organization"))
                    url = "add_organization?organizationId=";
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
            else if ($(this).hasClass("organization"))
                $("#currentUrl").val($("#organizationUrl").val().replace("organization_value_id", id));
            $.magnificPopup.open({
                items: {
                    src: "#to-liked-dialog"
                },
                type: 'inline'
            });
        }
    });

    $("#buy_document").bind('click', function () {
        var id = $("#buy_document").attr("data-id");

        var returnUrl = globalVars.consts.AbsoluteUri + '/document/' + id + '/buy';
        window.location.href = globalVars.consts.AbsoluteUri + '/document/' + id + "/create_payment?description=test&returnUrl=" + returnUrl;

        /*var favoriteId = $("#buy_document").attr("data-favorite-id");
        $.ajax({
            url: "/api/document/check_buy/" + id + "?favoriteId=" + favoriteId,
            dataType: "json",
            type: "POST",
            success: function (result) {
                console.log(result, "buy");
                if (!!result) {
                    if (result.IsSuccessful) {
                        window.location.href = '/document/' + id + "/buy";
                    } else {
                        $("#buy-error .text").text(result.error);
                        $.magnificPopup.open({
                            items: {
                                src: "#buy-error"
                            },
                            type: 'inline'
                        });
                    }
                }
            }
        });*/
    });

    $("#send-request").bind('click', function (e) {
        $.magnificPopup.open({
                        items: {
                            src: "#request-send-popup"
                        },
                        type: 'inline'
                    });
    });

    $("#request-send-popup-button").bind('click', function (e) {
    var id = $("#send-request").attr("data-id");
        $.ajax({
            url: globalVars.consts.AbsoluteUri + "/api/document/send_request/" + id,
            dataType: "json",
            type: "POST",
            success: function (result) {
                if (!!result && result.success) {
                    $("#request-send-popup").magnificPopup("close");
                    $("#add-to-favorites-document").attr("data-favorite-id", result.favoriteId);
                    $("#add-to-favorites-document").addClass("added");
                    $("#add-to-favorites-document").tooltipster('content', globalVars.consts.RemoveFroFavorites);
                    $(".request").hide();
                    $(".request.sended").show();
                    
                }
            }
        });
    });
});