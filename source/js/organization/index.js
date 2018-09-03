var organizationVM = {
    using: organizationVars.enums.InUse,
    subsurfaceInUse: [],
    subsurfaceNotUse: [],
    inUseTotal: 0,
    notUseTotal: 0,
    inUseLoaded: 0,
    notUseLoaded: 0,
    fetch: 10,

    init: function () {
        var that = this;

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

        var findActiveMenuItem = function () {
            $.each($('.menu-block div ul li a'), function (k, el) {
                if ($(el).hasClass('active')) {
                    var left = $(el).closest('li').position().left + 11;
                    var w = $(el).closest('li').width();
                    $('.menu-block .smailer').show();
                    $('.menu-block .smailer').css('left', left);
                    $('.menu-block .smailer').css('width', w);
                }
            });
        }

        var lastMenuId = $('.menu-block ul').length

        $('.menu-block ul li a').bind('click', function (e) {
            that.set('using', $(e.target).parent().index())
            $('.menu-block ul li a').removeClass("active");
            $(e.target).addClass("active");
            findActiveMenuItem();
            return false;
        });

        $('.menu-block').bind('mouseleave', function (e) {
            findActiveMenuItem();
        });
        setTimeout(function () {
            findActiveMenuItem();
        }, 0);

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
                                $(e.currentTarget).closest("button").tooltipster('content', 'Добавить в избранное');
                            }
                        }
                    });
                } else {
                    var id = $(this).attr("data-id");
                    $.ajax({
                        url: globalVars.consts.AbsoluteUri + "/api/favorites/add_organization?orgId=" + id,
                        dataType: "json",
                        type: "POST",
                        success: function (result) {
                            if (!!result && result.IsSuccessful) {
                                $("#add-to-favorites").attr("data-favorite-id", result.favoriteId);
                                $("#add-to-favorites").addClass("added");
                                $(e.currentTarget).closest("button").tooltipster('content', 'Удалить из избранного');
                            }
                        }
                    });
                }
            } else {
                var id = $(this).attr("data-id");
                $("#currentUrl").val($("#organizationUrl").val().replace("organization_value_id", id));
                $.magnificPopup.open({
                    items: {
                        src: "#to-liked-dialog"
                    },
                    type: 'inline'
                });
            }
        });

        $.ajax({
            url: globalVars.consts.AbsoluteUri + "/api/organization/map/" + $("#organization_id").val() + "?inuse=true",
            dataType: "json",
            type: "POST",
            success: function (result) {
                var items = [];
                if (!!result && !!result.Items) {
                    $.each(result.Items, function (k, v) {
                        if (!!v.RawCoordinate && !!v.RawCoordinate.Value) {
                            items.push({
                                id: v.Id,
                                name: v.Name,
                                coord: JSON.parse(v.RawCoordinate.Value),
                                categoryId: v.CategoryId == null ? 1 : v.CategoryId
                            });
                        }
                    });
                    that.set('inUseTotal', result.Items.length);
                }
                that.initMap('mapInUse', items);
            }
        });

        $.ajax({
            url: globalVars.consts.AbsoluteUri + "/api/organization/map/" + $("#organization_id").val() + "?inuse=false",
            dataType: "json",
            type: "POST",
            success: function (result) {
                var items = [];
                if (!!result && !!result.Items) {
                    $.each(result.Items, function (k, v) {
                        if (!!v.RawCoordinate && !!v.RawCoordinate.Value)
                            items.push({
                                id: v.Id,
                                name: v.Name,
                                coord: JSON.parse(v.RawCoordinate.Value),
                                categoryId: v.CategoryId == null ? 1 : v.CategoryId
                            })
                    });
                    that.set('notUseTotal', result.Items.length);
                }
                that.initMap('mapNotUse', items);
            }
        });

        that.getSubsurfaces(true, false, 0);
        that.getSubsurfaces(false, false, 0);
    },
    initMap: function (id, items) {
        var getPreset = function (category) {
            var result = "";
            switch (category) {
                case 1:
                    result = "islands#brownDotIcon";
                    break;
                case 2:
                    result = "islands#nightDotIcon";
                    break;
                case 3:
                    result = "islands#blueDotIcon";
                    break;
                default:
                    result = "islands#grayDotIcon";
                    break;
            }
            return result;
        };
        if ($('#' + id).length) {
            ymaps.ready(init);
            var myMap;

            function init() {
                var settings = {
                    center: [55.74954, 37.621587],
                    zoom: 3,
                    controls: [],
                    behaviors: ['drag'],
                };

              
                var coords = [];
                $.each(items, function (k, v) {
                    var push = false;
                    $.each(v.coord[0], function (k1, v1) {
                        if (Array.isArray(v1) && !push) {
                            items[k].coord = v1[0];
                            coords.push(v1[0]);
                            push = true;
                        }
                    });
                });

                if (coords.length > 0) {
                    settings.center = getCenterOfPolygon([coords]);
                    settings.zoom = getZoomOfMap([coords]);
                }

                myMap = new ymaps.Map(id, settings, {
                    minZoom: 3
                });
                addControlsToMap(myMap);

                var accessor = myMap.copyrights.add('&copy; RosComputing');

                if (items.length > 0) {
                    $.each(items, function (k, v) {
                        myPlacemark = new ymaps.Placemark(
                            v.coord,
                            {
                                hintContent: v.name
                            }, {
                                preset: getPreset(v.categoryId),
                                //iconLayout: 'default#image',
                                // Своё изображение иконки метки.
                                //iconImageHref: location.origin + '/img/placemark_blue.png',
                                // Размеры метки.
                                //iconImageSize: [13, 12],
                                //iconImageOffset: [-6, -6],
                                zIndex: 1
                            }
                        );
                        myPlacemark.events.add('click', function () {
                            window.location.href = "/subsurface/" + v.id + "/1";
                        });
                        myMap.geoObjects.add(myPlacemark);
                    });
                }
            }
        }
    },
    getSubsurfaces: function (inuse, concat, offset) {
        var that = this;
        $.ajax({
            url: globalVars.consts.AbsoluteUri + "/api/organization/subsurfaces/" + $("#organization_id").val() + "?inuse=" + inuse + "&offset=" + offset + "&fetch=" + that.get('fetch'),
            dataType: "json",
            type: "POST",
            success: function (result) {
                var items = [];
                if (!!result && !!result.Items && result.Items.length > 0) {
                    $.each(result.Items, function (k, v) {
                        var subjects = [];
                        $.each(v.SubjectRF, function (k1, v1) {
                            subjects.push(v1.Name);
                        });
                        var minerals = [];
                        $.each(v.Minerals, function (k1, v1) {
                            minerals.push(v1.Name);
                        });
                        result.Items[k].Subjects = subjects.join(', ');
                        result.Items[k].Minerals = minerals.join(', ');
                        var fined = false;
                        $.each(v.Licenses, function (k1, v1) {
                            if (!fined && v1.Status == "Действующая") {
                                result.Items[k].Licenses[0] = v1;
                                fined = true;
                            }
                        });

                        if (v.FutureUsabilities && v.FutureUsabilities.length > 0) {
                            result.Items[k].FutureUsabilities[0].QuarterText = "";
                            if (!!result.Items[k].FutureUsabilities[0].DeadLine)
                                result.Items[k].FutureUsabilities[0].QuarterText = getQuarterText(result.Items[k].FutureUsabilities[0].DeadLine, "КВ.", true);
                        }
                    });
                    var items = [];
                    if (inuse) {
                        if (concat) {
                            items = that.get('subsurfaceInUse');
                        }
                        $.each(result.Items, function (k, v) {
                            items.push(v);
                        })
                        that.set('subsurfaceInUse', items);
                        that.set('inUseLoaded', items.length);
                    } else {
                        if (concat) {
                            items = that.get('subsurfaceNotUse');
                        }
                        $.each(result.Items, function (k, v) {
                            items.push(v);
                        })
                        that.set('subsurfaceNotUse', items);
                        that.set('notUseLoaded', items.length);
                    }

                    $(".subsurface-add-to-liked").unbind('click').bind('click', function (e) {
                        var that = this;
                        if ($(that).attr("data-user-authenticated").toLowerCase() == "true") {
                            if ($(that).hasClass("added")) {
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
                                var id = $(that).attr("data-id");
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
                    });

                    $('.items .tooltip').tooltipster({
                        theme: 'tooltipster-borderless',
                        side: 'left'
                    });
                }
            }
        });
    },
    getInUseMore: function () {
        this.getSubsurfaces(true, true, this.get('inUseLoaded'));
    },
    getNotUseMore: function () {
        this.getSubsurfaces(false, true, this.get('notUseLoaded'));
    },

    //visible
    getVisibleInUse: function () {
        return this.get('using') == organizationVars.enums.InUse;
    },
    getVisibleNotUse: function () {
        return this.get('using') == organizationVars.enums.NotUse;
    },
    getVisibleInUseMore: function () {
        return this.get('inUseTotal') > this.get('inUseLoaded');
    },
    getVisibleNotUseMore: function () {
        return this.get('notUseTotal') > this.get('notUseLoaded');
    },
    getVisibleInUseShowed: function () {
        return this.get('inUseLoaded') > 0;
    },
    getVisibleNotUseShowed: function () {
        return this.get('notUseLoaded') > 0;
    }
}

$(document).ready(function () {
    window.organizationVM = kendo.observable(organizationVM);
    kendo.bind($("#organization-form"), window.organizationVM);

    window.organizationVM.init();
});