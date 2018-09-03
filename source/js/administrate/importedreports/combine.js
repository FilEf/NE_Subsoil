$(document).ready(function () {
    $("#first-subsurface, #second-subsurface").bind('keydown', function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl/cmd+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+C
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+X
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    $("#combine-button").bind('click', function () {
        var valid = true;
        $("#errors").hide();
        $("#first-subsurface, #second-subsurface").removeClass("validation-error");
        if(!$("#first-subsurface").val()) {
            valid = false;
            $("#first-subsurface").addClass("validation-error");
        }
        if (!$("#second-subsurface").val()) {
            valid = false;
            $("#second-subsurface").addClass("validation-error");
        }
        if (valid) {
            $.ajax({
                url: globalVars.consts.AbsoluteUri + "/Common/Subsurface/BindSubsurfaces",
                dataType: "json",
                data: {
                    mainSubsurfaceId: $("#first-subsurface").val(),
                    delSubsurfaceId: $("#second-subsurface").val()
                },
                type: "POST",
                success: function (result) {
                    console.log(result);
                    if (result.IsSuccessful) {
                        $("#errors span").removeClass("red").addClass("green");
                        $("#errors span").text("");
                        $("#errors").show();
                    } else {
                        $("#errors span").removeClass("green").addClass("red");
                        $("#errors span").text(result.Message);
                        $("#errors").show();
                    }
                },
                error: function (error, textStatus) {
                    $("#errors span").removeClass("green").addClass("red");
                    $("#errors span").text("В процессе объединения возникла ошибка. Обратитесь к администратору.");
                    $("#errors").show();
                }
            });
        }
    });
});