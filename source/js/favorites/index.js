var favoritesVM = {
    searchTimer: null,
    items: [],
    checkedStocks: false,
    currentTab: 0,
    total: 0,

    getVisibleMineralsAndStocksFilter: function () {
        var currentTab = this.get('currentTab');
        return (currentTab != favoritesVars.consts.Tabs.Organization && currentTab != favoritesVars.consts.Tabs.Documents);
    },
    getVisibleSubsurfaces: function (data) {
        var currentTab = this.get('currentTab');
        return (currentTab == favoritesVars.consts.Tabs.All || currentTab == data.Type);
    },
    getVisibleDocuments: function () {
        var currentTab = this.get('currentTab');
        return (currentTab == favoritesVars.consts.Tabs.All || currentTab == favoritesVars.consts.Tabs.Documents);
    },
    getVisibleAuction: function () {
        var currentTab = this.get('currentTab');
        return (currentTab == favoritesVars.consts.Tabs.All || currentTab == favoritesVars.consts.Tabs.Auctions);
    },
    getVisibleLicense: function () {
        var currentTab = this.get('currentTab');
        return (currentTab == favoritesVars.consts.Tabs.All || currentTab == favoritesVars.consts.Tabs.Licenses);
    },
    getVisibleOrganization: function () {
        var currentTab = this.get('currentTab');
        return (currentTab == favoritesVars.consts.Tabs.All || currentTab == favoritesVars.consts.Tabs.Organization);
    },
    getVisibleSubsurfaceMinerals: function (data) {
        return this.get('checkedStocks') && this.getVisibleSubsurfaces(data);
    },

    init: function () {
        var that = this;

        $(".favorites-menu > ul > li > a").bind('click', function () {
            $(".favorites-menu > ul > li").removeClass('active');
            $(this).closest("li").addClass('active');
            that.set('currentTab', $(".favorites-menu > ul > li").index($(this).closest("li")));
            that.set('total', $(".items > .item:visible").length);
            that.updateSmailer();
            return false;
        });

        this.updateSmailer();
        this.getItems();
    },

    getItems: function () {
        var that = this;

        var data = {
            text: $("#searchText").val(),
            minerals: [],
            sd: $("#sortable").hasClass("desc") ? favoritesVars.consts.Sort.Asc : favoritesVars.consts.Sort.Desc
        };

        $.each($(".mineral_group_value:checked"), function (k, v) {
            data.minerals.push($(v).attr("value"));
        });

        $.ajax({
            url: globalVars.consts.AbsoluteUri + "/api/favorites/search",
            dataType: "json",
            data: data,
            type: "POST",
            success: function (result) {
                // console.log(result);
                if (!!result && result.IsSuccessful) {
                    var items = [];
                    $.each(result.Data.Items, function (k, v) {
                        if (!!v.Subsurface) {
                            result.Data.Items[k].Type = favoritesVars.consts.Tabs.Subsurfaces;
                            if (v.Subsurface.Status.Name == "Объявлены торги")
                                result.Data.Items[k].Type = favoritesVars.consts.Tabs.Auctions;
                            else if (v.Subsurface.Status.Name == "Распределенный фонд")
                                result.Data.Items[k].Type = favoritesVars.consts.Tabs.Licenses;
                            else if (!!v.Subsurface.Planing)
                                result.Data.Items[k].Type = favoritesVars.consts.Tabs.Subsurfaces;
                            else if (v.Subsurface.Status.Name == "Планируется предоставление в пользование"
                                || v.Subsurface.Status.Name == "Нераспределенный фонд")
                                result.Data.Items[k].Type = favoritesVars.consts.Tabs.Subsurfaces;

                            var subjects = [];
                            $.each(v.Subsurface.SubjectRF, function (k1, v1) {
                                subjects.push(v1.Name);
                            });
                            result.Data.Items[k].Subsurface.Subjects = subjects.join(", ");
                            var minerals = [];
                            $.each(v.Subsurface.Minerals, function (k1, v1) {
                                minerals.push(v1.Name);
                            });
                            result.Data.Items[k].Subsurface.MineralsStr = minerals.join(", ");
                            if (!!v.Subsurface.Licenses && v.Subsurface.Licenses.length > 0) {
                                var fined = false;
                                $.each(v.Subsurface.Licenses, function (k1, v1) {
                                    if (!fined && v1.Status == "Действующая") {
                                        result.Data.Items[k].Subsurface.Licenses[0] = v1;
                                        fined = true;
                                    }
                                });
                            }
                            items.push(result.Data.Items[k]);
                        } else if (!!v.Document && typeof (v.Document.Name) != 'undefined' && !!v.Document.Name) {
                            result.Data.Items[k].Type = favoritesVars.consts.Tabs.Documents;
                            items.push(result.Data.Items[k]);
                        } else if (!!v.Organization && typeof (v.Organization.Name) != 'undefined' && !!v.Organization.Name) {
                            result.Data.Items[k].Type = favoritesVars.consts.Tabs.Organization;
                            items.push(result.Data.Items[k]);
                        } 
                    });
                    that.set('items', items);
                    that.set('total', $(".items > .item:visible").length);
                    $('.tooltip').tooltipster({
                        theme: 'tooltipster-borderless',
                        side: 'left'
                    });
                }
            }
        });
    },
    getSearchPlaceholder: function () {
        var currentTab = this.get('currentTab');
        var result = "Поиск";
        switch (currentTab) {
            case favoritesVars.consts.Tabs.Subsurfaces:
                result = "Название участка недр, синонимы названия";
                break;
            case favoritesVars.consts.Tabs.Licenses:
                result = "Номер лицензии, название недропользователя";
                break;
            case favoritesVars.consts.Tabs.Auctions:
                result = "Наименование участка недр, номер извещения, дата публикации, статус";
                break;
            case favoritesVars.consts.Tabs.PlannedLicensing:
                result = "Название участка недр, синонимы названия";
                break;
            case favoritesVars.consts.Tabs.Organization:
                result = "Наименование";
                break;
            case favoritesVars.consts.Tabs.Documents:
                result = "Наименование документа";
                break;
            default:
                break;
        }
        return result;
    },
    searchOnKeyUp: function (e) {
        var that = this;
        clearTimeout(that.searchTimer);
        if (!!e && e.keyCode == 13) {
            that.getItems();
        } else {
            that.searchTimer = setTimeout(function () {
                that.getItems();
            }, 500);
        }
    },
    openMineralsPopup: function (e) {
        var that = this;
        $(e.target).blur();

        var el = $('#minerals-list');

        if (!el.length)
            return false;

        var openPopup = function () {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline',
                callbacks: {
                    close: function () {
                        $(e.target).closest('a').text(($.map(el.find('input[type="checkbox"]:checked'), function (item) { return $(item).find('+label').text().trim() })).join(', ') || 'Полезные ископаемые');
                        $(e.target).closest('a').removeClass('opened');
                        that.getItems();
                    }
                }
            });
        };

        $(e.target).closest('a').addClass('opened');

        // WAIT ANIMATION AND SHOW
        setTimeout(function () {
            openPopup();
        }, 800);
        return false;
    },
    sortOnClick: function (e) {
        $(e.target).blur();
        $(e.target).closest('a').toggleClass('desc');
        this.getItems();
        return false;
    },
    updateSmailer: function () {
        var el = $(".favorites-menu > ul > li.active");
        if (el.length) {
            var left = $(el).closest('li').position().left;
            var w = $(el).closest('li').width();
            $('.favorites-menu .smailer').show();
            $('.favorites-menu .smailer').css('left', left);
            $('.favorites-menu .smailer').css('width', w);
        }
    },
    removeFromFavorites: function (e) {
        if (!!e && !!e.data) {
            var that = this;
            var id = e.data.Id;
            $.ajax({
                url: globalVars.consts.AbsoluteUri + "/api/favorites/remove_favorite?favoriteId=" + id,
                dataType: "json",
                type: "POST",
                success: function (result) {
                    // console.log(id);
                    if (!!result && result.IsSuccessful) {
                        var items = that.get('items');
                        var newItems = [];
                        $.each(items, function (k, v) {
                            if (id == v.Id) {
                                v.Removed = true;
                            }
                            newItems.push(v);
                        });
                        that.set('items', newItems);
                        $('.tooltip').tooltipster({
                            theme: 'tooltipster-borderless',
                            side: 'left'
                        });
                    }
                }
            });
        }
        return false;
    },
    returnToFavorites: function (e) {
        if (!!e && !!e.data) {
            var that = this;
            var action = "";
            var id = e.data.Id;
            switch (e.data.Type) {
                case favoritesVars.consts.Tabs.Subsurfaces:
                case favoritesVars.consts.Tabs.Licenses:
                case favoritesVars.consts.Tabs.Auctions:
                case favoritesVars.consts.Tabs.PlannedLicensing:
                    action = "add_subsurface?subsurfaceId=" + e.data.Subsurface.Id;
                    break;
                case favoritesVars.consts.Tabs.Documents:
                    action = "add_document?documentId=" + e.data.Document.Id;
                    break;
                case favoritesVars.consts.Tabs.Organization:
                    action = "add_organization?orgId=" + e.data.Organization.Id;
                    break;
                default:
                    break;
            }
            $.ajax({
                url: globalVars.consts.AbsoluteUri + "/api/favorites/" + action,
                dataType: "json",
                type: "POST",
                success: function (result) {
                    // console.log(result);
                    if (!!result && result.IsSuccessful) {
                        var items = that.get('items');
                        var newItems = [];
                        $.each(items, function (k, v) {
                            if (id == v.Id) {
                                v.Id = result.favoriteId;
                                v.CreateDT = Date.now();
                                v.Removed = false;
                            }
                            newItems.push(v);
                        });
                        that.set('items', newItems);
                        $('.tooltip').tooltipster({
                            theme: 'tooltipster-borderless',
                            side: 'left'
                        });
                    }
                }
            });
        }
    },
}

$(document).ready(function () {
    window.favoritesVM = kendo.observable(favoritesVM);
    kendo.bind($("#favorites"), window.favoritesVM);

    window.favoritesVM.init();
});