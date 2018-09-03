var userVM = {
    blocked: false,
    editField: null,
    avatarUpload: false,

    //Visibled
    getVisibleAvatarRemove: function () {
        return this.get('avatarUpload');
    },
    getVisibleAboutPlaceholder: function () {
        return (!!$("#about") && !$("#about").val());
    },
    //Helpers
    fioFieldIsEditing: function () {
        return this.get('editField') === userVars.consts.EditableFields.FIO;
    },
    infoFieldIsEditing: function () {
        return this.get('editField') === userVars.consts.EditableFields.Info;
    },
    emailFieldIsEditing: function () {
        return this.get('editField') === userVars.consts.EditableFields.Email;
    },
    phoneFieldIsEditing: function () {
        return this.get('editField') === userVars.consts.EditableFields.Phone;
    },
    skypeFieldIsEditing: function () {
        return this.get('editField') === userVars.consts.EditableFields.Skype;
    },
    passwordFieldIsEditing: function () {
        return this.get('editField') === userVars.consts.EditableFields.Password;
    },

    init: function () {
        var that = this;
        this.set('avatarUpload', $("#avatar_set").val());
        $('.tooltip').tooltipster({
            theme: 'tooltipster-shadow',
            side: 'bottom'
        });
        $("#phone_number").kendoMaskedTextBox({
            mask: "+7(999) 000 00 00"
        });
        $("#phone_content").html($("#phone_number").val());
    },
    closeEditPopup: function (e) {
        this.set('blocked', false);
        this.set('editField', null);
    },
    closeSocialPopup: function () {
        $("#social-popup").hide();
        this.set('blocked', false);
    },
    avatarOnUpload: function (data) {
        if (!!data && !!data.response && data.response.isSuccess) {
            $("#avatar").attr("src", data.response.filename);
            this.set('avatarUpload', true)
            this.saveUser();
        }
    },
    removeAvatar: function () {
        if (this.get('avatarUpload')) {
            this.set('avatarUpload', false);
            $("#avatar").attr("src", $("#default_avatar").val());
            this.saveUser();
        }
        return false;
    },
    changePassword: function () {
        this.set('blocked', true);
        this.set('editField', userVars.consts.EditableFields.Password);
    },
    socialOnClick: function (e) {
        
        /*$(e.target).closest("button").toggleClass("disabled");
        try {
            if ($(e.target).closest("button").hasClass("disabled"))
                $(e.target).closest("button").tooltipster('content', 'Подключить аккаунт');
            else 
                $(e.target).closest("button").tooltipster('content', 'Отключить аккаунт');
        } catch (err) {
        }*/
        if (!$(e.target).closest("button").hasClass("disabled")) {
            //$("#social-form").attr("action", "/Common/User/DiassociateAccount");
            $("#disable-button").attr("value", $(e.target).closest("button").attr("value"));
            $("#profile-button").attr("data-link", $(e.target).closest("button").attr("data-link"));
            $("#social-popup").css("left", $(e.target).position().left - 180 + "px");
            $("#social-popup").show();
            this.set('blocked', true);
            return false;
        }
        //return false;
    },
    disableAccount: function () {
        if (!confirm("Вы уверены, что хотите отключить привязку к аккаунту?")) {
            return false;
        }
    },
    goToProfile: function (e) {
        window.open($(e.target).closest("button").attr("data-link"), "_blank");
        $("#social-popup").hide();
        return false;
    },
    socialDisableOnClick: function () {
        return false;
    },
    editFioField: function () {
        this.set('blocked', true);
        this.set('editField', userVars.consts.EditableFields.FIO);
    },
    editInfoField: function () {
        this.set('blocked', true);
        this.set('editField', userVars.consts.EditableFields.Info);
    },
    editEmailField: function (e) {
        this.set('blocked', true);
        this.set('editField', userVars.consts.EditableFields.Email);
        $(e.target).closest("span").find(".error").hide();
    },
    editPhoneField: function () {
        this.set('blocked', true);
        this.set('editField', userVars.consts.EditableFields.Phone);
    },
    editSkypeField: function () {
        this.set('blocked', true);
        this.set('editField', userVars.consts.EditableFields.Skype);
    },
    saveFIO: function (e) {
        if (!e)
            return false;

        $(".name-edit input").removeClass("validation-error");

        var valid = true;
        if (!$("#surname").val()) {
            valid = false;
            $("#surname").addClass("validation-error");
        }
        if (!$("#name").val()) {
            valid = false;
            $("#name").addClass("validation-error");
        }

        if (valid) {
            $(e.target).closest('.name-info').find('.surname').text($("#surname").val());
            $(e.target).closest('.name-info').find('.middlename').text($("#middlename").val());
            $(e.target).closest('.name-info').find('.name').text($("#name").val());

            this.saveUser();
        }
    },
    saveInfo: function (e) {
        if (!e)
            return false;

        $(e.target).closest('.about').find('.content').html($(e.target).prev().val().replace(/\n/g, '<br/>') + '<span class="placeholder" id="about-placeholder" data-bind="visible: getVisibleAboutPlaceholder">О себе...</span>');

        if (this.getVisibleAboutPlaceholder())
            $("#about-placeholder").show();
        else
            $("#about-placeholder").hide();

        this.saveUser();
    },
    saveEmail: function (e) {
        if (!e)
            return false;

        var regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (regex.test($(e.target).prev().val())) {
            $(e.target).closest(".contacts-edit").find(".error").hide();
            $(e.target).closest('span').find('.content').html($(e.target).prev().val());

            this.saveUser();
        } else {
            $(e.target).closest(".contacts-edit").find(".error").show();
        }
    },
    savePhone: function (e) {
        if (!e)
            return false;

        $(e.target).closest('span').find('.content').html($(e.target).prev().val());

        this.saveUser();
    },
    saveSkype: function (e) {
        if (!e)
            return false;

        $(e.target).closest('span').find('.content').html($(e.target).prev().val());

        this.saveUser();
    },
    saveUser: function () {
        var that = this;
        var data = {
            Surname: $("#surname").val(),
            Name: $("#name").val(),
            MiddleName: $("#middlename").val(),
            Phone: $("#phone_number").data("kendoMaskedTextBox").raw(),
            Skype: $("#skype").val(),
            About: $("#about").val(),
            Photo: this.get("avatarUpload") ? $("#avatar").attr("src") : null
        };
        $.ajax({
            url: "/api/user/update",
            dataType: "json",
            data: data,
            type: "POST",
            success: function (result) {
                that.set('blocked', false);
                that.set('editField', null);
            }
        });
    },
    savePassword: function () {
        var that = this;
        var form = $('#change-passsword');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var data = {
            __RequestVerificationToken: token, 
            CurrentPassword: $("#current-password").val(),
            NewPassword: $("#new-password").val(),
            ConfirmNewPassword: $("#confirm-password").val()
        };
        $.ajax({
            url: "/api/user/update_password",
            dataType: "json",
            data: data,
            type: "POST",
            success: function (result) {
                if (result.IsSuccess) {
                    that.set('blocked', false);
                    that.set('editField', null);
                } else if (!!result.Errors && !!result.Errors.length > 0) {
                    $("#error-text").html(result.Errors.join("<br/>"));
                }
                
            }
        });
    },
    closeMessage: function () {
        $(".message").hide();
    }
}

$(document).ready(function () {
    kendo.culture("ru-RU");
    window.userVM = kendo.observable(userVM);
    kendo.bind($("#user-form"), window.userVM);

    window.userVM.init();
});