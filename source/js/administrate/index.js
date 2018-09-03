var adminVM = {
    init: function () {

    },
    fileOnSelect: function () {
        $("#upload-error").hide();
    },
    fileOnUpload: function (e) {
        if (e && e.response && e.response.isSuccess) {
            $("#upload-dates").append("<p>" + moment().format("DD.MM.YYYY") + "</p>");
        } else {
            $("#upload-error").show();
        }
    }
}

$(document).ready(function () {
    window.adminVM = kendo.observable(adminVM);
    kendo.bind($("#admin-form"), window.adminVM);

    window.adminVM.init();
});