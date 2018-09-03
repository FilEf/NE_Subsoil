$(document).ready(function () {

    $("#selectType").bind('click', function () {
        $("#events_list").fadeToggle("fast");
    });

    $("#events_list button").bind('click', function () {
        var id = $(this).attr("data-id");
        if (!id)
            $(".history-list-item").show();
        else {
            $(".history-list-item").hide();
            $(".history-list-item.item-" + id).show();
        }
        $("#events_list button").removeClass("selected");
        $(this).addClass("selected");
        $("#events_list").fadeToggle("fast");
        $("#selectType").text($(this).text());
    });
})