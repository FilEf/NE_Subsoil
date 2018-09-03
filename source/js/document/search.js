var searchVM = {
    docsTotalCount: 0,
    docsTotalShowed: 0,
    countPerPage: 10,
    searchButtonDisabled: false,
    searchAjax: null,
    docs: [],

    init: function () {
        var that = this;

        $("#login_button").click(function () {
            var url = $("#returnUrl_input_login").val();
            window.location.href = url;
        });

        $("#reg_button").click(function () {
            var url = $("#returnUrl_input_reg").val();
            window.location.href = url;
        });

        // fake items
        that.set('searchButtonDisabled', true);
        that.searchAjax = $.ajax({
            url: globalVars.consts.AbsoluteUri + "/document/search",
            dataType: "json",
            type: "POST",
            traditional: true,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                text: "",
                fetch: 10,
                offset: 0
            }),
            success: function (result) {
                that.searchAjax = null;
                that.updateDocs(result, false);
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
                that.set('searchButtonDisabled', false);
            }
        });
        /*that.searchAjax = $.ajax({
            url: globalVars.consts.AbsoluteUri + "/document/search_fake",
            dataType: "json",
            type: "POST",
            traditional: true,
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                that.searchAjax = null;
                that.updateDocs(result, false);
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
                that.set('searchButtonDisabled', false);
            }
        });*/
    },
    getDocs: function (concat) {
        var that = this;
        var isValid = true;

        var data = {
            text: ""
        };

        if ($("#search-text") && !!$("#search-text").val())
            data.text = $("#search-text").val();

        data.fetch = that.get('countPerPage');
        var docsTotalShowed = 0;
        if (!!concat) {
            var docsTotalCount = this.get('docsTotalCount');
            docsTotalShowed = this.get('docsTotalShowed');
            data.fetch = ((docsTotalShowed + that.get('countPerPage')) > docsTotalCount) ? (docsTotalCount - docsTotalShowed) : that.get('countPerPage');
        }
        data.offset = docsTotalShowed;

        if (isValid) {
            that.set('searchButtonDisabled', true);

            if (that.searchAjax)
                that.searchAjax.abort();

            var watch = moment(new Date());
            that.searchAjax = $.ajax({
                url: globalVars.consts.AbsoluteUri + "/document/search",
                dataType: "json",
                type: "POST",
                traditional: true,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                success: function (result) {
                    that.searchAjax = null;
                    that.updateDocs(result, concat);
                    var work = moment(moment(new Date).diff(watch)).toObject();
                    console.log("Time ajax work: " + work.seconds + "s " + work.milliseconds + "ms");
                },
                error: function (error) {
                    console.log(error);
                },
                complete: function () {
                    that.set('searchButtonDisabled', false);
                }
            });
        }
    },

    // visible
    loadMoreVisible: function () {
        return this.get('docsTotalShowed') < this.get('docsTotalCount');
    },

    // helpers
    updateDocs: function (result, concat) {
        console.log(result, "docs search result");
        var that = this;

        if (!!concat) {
            var docs = that.get('docs');
            $.each(result.Items, function (k, v) {
                docs.push(v);
            });
            that.set('docs', docs);
        } else {
            that.set('docs', result.Items);
        }

        that.updateTooltips();
        // console.log(result.Items, "result.Items");
        that.set('docsTotalShowed', that.get('docs').length);
        that.set('docsTotalCount', result.Total);
    },
    updateTooltips: function () {
        $('.tooltip').tooltipster({
            theme: 'tooltipster-borderless',
            side: 'left'
        });
    },
    updateFavoriteItem: function (id, favoriteId, name, auth) {
        var that = this;
        var newItems = [];

        if (auth) {
            if (!favoriteId) {
                $.ajax({
                    url: globalVars.consts.AbsoluteUri + "/api/favorites/add_document?documentId=" + id,
                    dataType: "json",
                    type: "POST",
                    success: function (result) {
                        if (!!result && result.IsSuccessful) {
                            var items = that.get(name);
                            $.each(items, function (k, v) {
                                if (id == v.Id) {
                                    v.FavoriteId = result.favoriteId;
                                }
                                newItems.push(v);
                            });
                            that.set(name, newItems);
                            that.updateTooltips();
                        }
                    }
                });
            } else {
                $.ajax({
                    url: globalVars.consts.AbsoluteUri + "/api/favorites/remove_favorite?favoriteId=" + favoriteId,
                    dataType: "json",
                    type: "POST",
                    success: function (result) {
                        if (!!result && result.IsSuccessful) {
                            var items = that.get(name);
                            $.each(items, function (k, v) {
                                if (id == v.Id) {
                                    v.FavoriteId = null;
                                }
                                newItems.push(v);
                            });
                            that.set(name, newItems);
                            that.updateTooltips();
                        }
                    }
                });
            }
        } else {
            $("#returnUrl_input_login").val($("#returnUrl_input_login").val().replace("subsurface_value_id", id));
            $("#returnUrl_input_reg").val($("#returnUrl_input_reg").val().replace("subsurface_value_id", id));
            $.magnificPopup.open({
                items: {
                    src: "#to-liked-dialog"
                },
                type: 'inline'
            });
        }

        return newItems;
    },

    // events
    loadMore: function () {
        this.getDocs(true);
    },
    searchTextKeyUp: function (e) {
        if (e.keyCode == 13) {
            this.getDocs(false);
        }
    },
    searchOnClick: function () {
        this.getDocs(false);
    },
    openMergedPopup: function (e) {
        var el = $(e.target).closest('a');

        $(e.target).closest('a').toggleClass('opened');
        return false;
    },
    selectCountInPage: function (e) {
        if (e) {
            var countPerPage = this.get('countPerPage');
            var count = $(e.target).closest("li").data("id");
            if (count != countPerPage) {
                this.set('countPerPage', count);
                this.getDocs(false);
                $(e.target).closest("ul").find("button").removeClass("selected");
                $(e.target).find("button").addClass("selected");
                $(e.target).closest(".item").find("a").removeClass("opened");
            }
        }
    },
    favoriteBtnClick: function (e) {
        var that = this;

        that.updateFavoriteItem(
            e.data.Id,
            e.data.FavoriteId,
            'docs',
            $(e.currentTarget).attr("data-user-authenticated").toLowerCase() == "true"
        );

        e.stopPropagation();
        return false;
    },
}

$(document).ready(function () {
    window.searchVM = kendo.observable(searchVM);
    kendo.bind($("#search"), window.searchVM);

    window.searchVM.init();
});