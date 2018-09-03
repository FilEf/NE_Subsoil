var mineralsVM = {
    minerals: [],
    selectedMineral: {},

    getVisibleClass: function () {
        return this.get('mineralsTypeSelected') == 0;
    },
    getIsMetasomaticInfo: function () {
        return this.get('mineralsTypeSelected') == 1;
    },
    getIsMetamorphicInfo: function () {
        return this.get('mineralsTypeSelected') == 2;
    },

    init: function () {
        var that = this;

        $('.minerals .left').on('click', function (e) {
            $(e.target).blur();

            $('.minerals .first-visible').removeClass('first-visible');
            $('.minerals .last-visible').removeClass('last-visible');

            var left = $('.minerals ul').scrollLeft() - 795;
            left = Math.max(left, 0);

            $('.minerals ul').stop().animate({ scrollLeft: left }, '500', 'swing', function () {
                that.findLastVisible();
            });
        });
        $('.minerals .right').on('click', function (e) {
            $(e.target).blur();
            if (!$('.minerals .last-visible').length)
                return false;

            var pos = $('.minerals ul').scrollLeft() + 795;

            $('.minerals .first-visible').removeClass('first-visible');
            $('.minerals .last-visible').removeClass('last-visible');

            $('.minerals ul').stop().animate({ scrollLeft: pos }, '500', 'swing', function () {
                that.findLastVisible();
            });
        });

        this.clearFilters();

        $('.h3-with-select').on('mouseleave', function (e) {
            $(e.target).closest('.h3-with-select').removeClass('active');
        });

        // Filters
        $('.data-merged-popup').on('click', function (e) {
            $(e.target).blur();

            var el = $(e.target).closest('a');

            $(e.target).closest('a').toggleClass('opened');
        });

        $('.data-merged-popup').parent().on('mouseleave', function (e) {
            if ($(e.target).closest('.item').find('.opened').length) {
                $(e.target).closest('.item').find('a').text(
                    ($.map($(e.target).closest('.item').find('input[type="checkbox"]:checked'), function (item) {
                        return $(item).find('+label').text().trim()
                    })).join(', ') || $(e.target).attr("data-placeholder"));


                $(e.target).closest('.item').find('.opened').removeClass('opened');
            }
        });
    },
    getMinerals: function () {
        var data = {
            type: this.get('mineralsTypeSelected'),
            text: $('#mineralsSearchText').val()
        };
        var that = this;
        $.ajax({
            url: globalVars.consts.AbsoluteUri + "/minerals",
            dataType: "json",
            type: "POST",
            traditional: true,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            success: function (result) {
                that.updateMinerals(result);
            },
            error: function (error) {
                console.log(error);
            }
        });
    },
    findLastVisible: function() {
        $('.minerals li').removeClass('first-visible');
        $('.minerals .last-visible').removeClass('last-visible');

        var scrLeft = $('.minerals ul').scrollLeft();
        var w = $('.minerals ul').width() + 25;

        $.each($('.minerals ul li'), function (k, v) {
            var left = $(v).position().left;
            if (left < 25 && (left + $(v).width() > 0)) {
                $(v).addClass('first-visible');
            }
            if ((left < w + 25) && (left + $(v).width() > w)) {
                $(v).addClass('last-visible');
            }
        });
    },
    updateMinerals: function (result) {
        if (!!result.Items) {
            $.each(result.Items, function (k, v) {
                if (result.Type == 0) {
                    result.Items[k].Info = v.MagmaticInfo;
                    delete result.Items[k].MagmaticInfo
                } else if (result.Type == 1) {
                    result.Items[k].Info = v.MetasomaticInfo;
                    delete result.Items[k].MetasomaticInfo
                } else if (result.Type == 2) {
                    result.Items[k].Info = v.MetamorphicInfo;
                    delete result.Items[k].MetamorphicInfo
                }
                result.Items[k].Info.Sample = globalVars.consts.AbsoluteUri + result.Items[k].Info.Sample;
                result.Items[k].Info.Sample100 = globalVars.consts.AbsoluteUri + result.Items[k].Info.Sample100;
            });

            // console.log(result, "result");
            this.set('minerals', result.Items);
            if (result.Items.length > 0)
                this.set('selectedMineral', result.Items[0]);
            else
                this.set('selectedMineral', {});
            this.set('total', result.Items.length);

            $('.image-popup-link').magnificPopup({
                type: 'image'
            });

            this.findLastVisible();
        } else {
            this.set('minerals', []);
            this.set('selectedMineral', {});
            this.set('total', 0);
        }
    },
    getThisMineral: function (e) {
        this.set('selectedMineral', e.data);
        $('.image-popup-link').magnificPopup({
            type: 'image'
        });
    },
    setShlift: function (e) {
        $(e.target).blur();
        url = $(e.target).closest('button').attr('data-image');
        $('.mineral-detail .image-preview > a').css('background-image', 'url(' + url + ')');
        $('.mineral-detail .image-preview > a').attr('href', url);

        $('.mineral-detail .image-preview ul button.active').removeClass('active');
        $(e.target).closest('button').addClass('active');
    },

    //Filters Work
    mineralTypes: [],
    mineralsTypeSelected: 0,
    total: 0,

    clearFilters: function () {
        this.set('mineralTypes', mineralTypes);
        this.set('mineralsTypeSelected', mineralTypes[0].Id);
        $(".mineral-types button").removeClass("selected");
        $(".mineral-types button[data-id='" + mineralTypes[0].Id + "']").addClass("selected");

        this.getMinerals();
    },
    getSelectedMineralsTypeText: function () {
        var result = "";
        var type = this.get('mineralsTypeSelected');
        $.each(this.get('mineralTypes'), function (k, v) {
            if (v.Id == type)
                result = v.Text;
        });
        return result;
    },
    mineralTypeOnOpen: function (e) {
        $(e.target).blur();

        var el = $(e.target).closest('.h3-with-select');

        el.toggleClass('active');
    },
    mineralsSearchTextOnKeyUp: function () {
        this.getMinerals();
    },
    selectMinerlasType: function (e) {
        if (this.get('mineralsTypeSelected') != e.data.Id) {
            this.set('mineralsTypeSelected', e.data.Id);
            $(".mineral-types button").removeClass("selected");
            $(".mineral-types button[data-id='" + e.data.Id + "']").addClass("selected");
            $('.h3-with-select').removeClass("active");
            this.getMinerals();
        }
    }
};

$(document).ready(function () {
    window.mineralsVM = kendo.observable(mineralsVM);
    kendo.bind($("#minerals, #filters, #slider"), window.mineralsVM);

    window.mineralsVM.init();
});