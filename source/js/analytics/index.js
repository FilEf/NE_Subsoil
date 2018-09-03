$(document).ready(function () {
    $(".menu__item .button").bind('click', function (e) {
        window.location.href = $(e.target).closest("button").find("a").attr("href");
        return false;
    });

    $("#request-send").bind('click', function (e) {
        var auth = $(e.currentTarget).attr("data-user-authenticated").toLowerCase() == "true";
        if (auth) {
            $("#request-send-text").val("");
            $("#request-send-button").prop("disabled", true);
            magnificOpen(1);
        } else {
            magnificOpen(3);
        }
    });

    $("#request-send-text").bind("keyup", function () {
        $("#request-send-button").prop("disabled", !$(this).val())
    });

    $("#request-send-button").click(function () {
        $.ajax({
            url: globalVars.consts.AbsoluteUri + "/api/subsurface/send_request",
            dataType: "json",
            data: {
                text: $("#request-send-text").val()
            },
            type: "POST",
            success: function (result) {
                if (result && result.result) {
                    $('#pick-subsurface').magnificPopup('close');
                    magnificOpen(2);
                }
            }
        });
    });
});

function modalOpen(number) {
    if (window.screen.width > 768) {
        $("#modals" + number).show();
    }
}

function modalClose(number) {
    if (window.screen.width > 768) {
        $("#modals" + number).hide();
    }
}

function magnificOpen(number) {
    $.magnificPopup.open({
        items: {
            src: "#modals" + number
        },
        type: 'inline'
    });
}