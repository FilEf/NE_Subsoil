var searchMap;
var clusterers;
var regions;
var objectManager;
var searchVM = {
    //options
    useObjectManager: true,

    //fields
    structuredAreas: [],
    selectedFiltersCount: 0, //Total filters selected
    surfaces: [],//subsurface Objects
    surfacesTotal: 0, //subsurface total result
    selectedGroupMinerals: null,
    selectedGroupName: "",
    selectedGroupId: 0,
    selectedMineralsCount: 0,
    surfacesTotalCount: 0,
    //selectedValue
    selectedDensityStatuses: [],
    selectedSubsurfaceStatuses: [],
    selectedSubsurfaceCategories: [],
    selectedSubsurfaceFormation: null,
    selectedSujects: [],
    selectedMinerals: [],
    selectedGroupSubjects: null,
    selectedSubjectName: "",
    selectedSubjectId: 0,
    selectedSubjectsCount: 0,
    subsurfaceShowByZoom: 6.9,
    customZoom: false,
    clickDiagram: false,
    showSubsurfaces: false,
    showSubsurfacesZoom: 0,
    subsurfaceIds: [],
    subsurfaceIdsFull: [],
    mapMode: true,
    countPerPage: 10,
    surfacesTotalCountForList: 0,
    subsurfacesShowedForList: 0,
    surfacesForList: [],
    visibleMineralsInList: false,
    searchButtonDisabled: false,
    // ajax
    searchAjax: null,
    searchAggAjax: null,
    visibleLoadMore: false,

    //Initizlization
    init: function () {
        var that = this;
        $(".auction-statuses[data-id='0'], .mineral-category[data-id='0']").addClass("active");

        $("#login_button").click(function () {
            var url = $("#returnUrl_input_login").val();
            window.location.href = url;
        });

        $("#reg_button").click(function () {
            var url = $("#returnUrl_input_reg").val();
            window.location.href = url;
        });

        $("#pick-subsurface-text").bind("keyup", function () {
            $("#pick-subsurface-button").prop("disabled", !$(this).val())
        });

        $("#pick-subsurface-button").click(function () {
            $.ajax({
                url: globalVars.consts.AbsoluteUri + "/api/subsurface/send_request",
                dataType: "json",
                data: {
                    text: $("#pick-subsurface-text").val()
                },
                type: "POST",
                success: function (result) {
                    if (result && result.result) {
                        $('#pick-subsurface').magnificPopup('close');
                        $.magnificPopup.open({
                            items: {
                                src: "#pick-subsurface-result"
                            },
                            type: 'inline'
                        });
                    }
                }
            });
        });

        if ($('#search-map').length) {
            function init() {
                searchMap = new ymaps.Map(
                    "search-map",
                    {
                        center: [65.76, 75.64],
                        zoom: 3,
                        controls: [],
                        type: 'yandex#map'
                    },
                    {
                        minZoom: 3,
                        avoidFractionalZoom: false
                    }
                );
                objectManager = new ymaps.ObjectManager({
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 100,
                    zoomMargin: 50,
                    // Макет метки кластера pieChart.
                    clusterIconLayout: "default#pieChart"
                });
                objectManager.clusters.options.set({
                    zoomMargin: 10
                });
                searchMap.geoObjects.add(objectManager);

                //
                // Изменение границ видимой области карты:
                // https://tech.yandex.ru/maps/doc/jsapi/1.x/ref/reference/map-docpage/#event-BoundsChange
                //
                searchMap.events.add('boundschange', function (e) {
                    if (that.get('clickDiagram')) {
                        return false;
                    }

                    var newZoom = e.get('newZoom');
                    var oldZoom = e.get('oldZoom');

                    if (newZoom != oldZoom && newZoom < that.get('showSubsurfacesZoom')) {
                        that.set('showSubsurfacesZoom', 0);
                        that.set('showSubsurfaces', false);
                    }
                    if (newZoom != oldZoom || newZoom >= that.get('subsurfaceShowByZoom') && that.get('customZoom')) {
                        that.updateMapByZoom(newZoom < oldZoom);
                    } else if (newZoom >= that.get('subsurfaceShowByZoom')) {
                        var subsurfaceIds = that.get('subsurfaceIdsFull');
                        var filterVisiblesubSurface = [];
                        $.each(subsurfaceIds, function (k, v) {
                            if (that.getVisiblePlacemark(v.Coord)) {
                                filterVisiblesubSurface.push(v.Id);
                            }
                        });
                        that.set('subsurfaceIds', filterVisiblesubSurface);
                        that.getSubSurfacesByIds();
                    }

                    that.set('customZoom', false);
                });

                var accessor = searchMap.copyrights.add('&copy; RosComputing');
                addControlsToMap(searchMap);

                var regionsResponse = function (result) {
                    var regionsArray = result.geoObjects;

                    regionsArray.each(function (reg) {
                        var getColor = function (id) {
                            var color = "#FFF6EE00"
                            var colors = ["#FFFF80", "#62D2C5", "#FC8B8B", "#AA6CA6", "#37CE04", "#C7CB8F", "#01BEE7", "#FECE2C", ""];
                            $.each(searchVars.consts.Districts, function (k, v) {
                                $.each(v.Regions, function (k1, v1) {
                                    if (v1.OsmId == id)
                                        color = colors[v.Id - 1];
                                });
                            });
                            return color;
                        };
                        var getDistrictName = function (id) {
                            var result = "";
                            $.each(searchVars.consts.Districts, function (k, v) {
                                $.each(v.Regions, function (k1, v1) {
                                    if (v1.OsmId == id)
                                        result = v.Name;
                                });
                            });
                            return result;
                        };
                        /*$.each(searchVars.consts.Districts, function (k, v) {
                            if (v.Id == 110) {
                                $.each(v.Regions, function (index, item) {
                                    if (item.OsmId == reg.properties.get('osmId')) {
                                        var c = getCenterOfPolygonByMap(reg.geometry.getCoordinates());
                                        searchVars.consts.Districts[k].Regions[index].Center = c.Center;
                                        searchVars.consts.Districts[k].Regions[index].Rectangle = c.Rectangle;
                                    }
                                });
                            }
                        });*/
                        // Меняем цвет на красный
                        //reg.options.set('fillColor', getColor(reg.properties.get('osmId'))); 
                        reg.properties.set('district', getDistrictName(reg.properties.get('osmId')));
                        reg.options.set('fillColor', '#F4F4F4');
                        reg.options.set('strokeColor', '#FF0F0E');
                        reg.options.set('opacity', '0.3');

                        reg.events.add('mouseenter', function (e) {
                            //console.log();

                            if (searchMap.getZoom() < that.get('subsurfaceShowByZoom') || that.get('showSubsurfaces')) {
                                e.get('target').options.set('opacity', '1');
                                e.get('target').properties.set('hintContent', e.get('target').properties.get('name'));

                                var osmId = e.get('target').properties.get('osmId');
                                var subsurfaces = false;
                                $.each(searchVars.consts.Districts, function (k, v) {
                                    var thisDistrict = false;
                                    $.each(v.Regions, function (k1, v1) {
                                        if (v1.OsmId == osmId) {
                                            thisDistrict = true;
                                            subsurfaces = searchMap.getZoom() >= v1.DropToSubsurfaceZoom;
                                        }
                                    });
                                    if (!subsurfaces) {
                                        if (thisDistrict && searchMap.getZoom() < v.DropToRegionsZoom) {
                                            $.each(v.Regions, function (k1, v1) {
                                                regionsArray.each(function (reg) {
                                                    if (reg.properties.get('osmId') == v1.OsmId) {
                                                        reg.options.set('opacity', '1');
                                                        reg.properties.set('hintContent', reg.properties.get('district'));
                                                    }
                                                });
                                            });
                                        }
                                    } else {
                                        e.get('target').options.set('opacity', '0.3');
                                    }
                                });
                            }
                        });
                        reg.events.add('mouseleave', function (e) {
                            regionsArray.each(function (reg) {
                                reg.options.set('opacity', '0.3');
                            });
                        });
                        reg.events.add('click', function (e) {
                             console.log(e.get('target').properties.get('osmId'), e.get('coords'), "pos");
                            var osmId = e.get('target').properties.get('osmId');
                            var zoom = searchMap.getZoom();
                            var newZoom = 3;
                            var center = [];
                            var updateZoomAndCenter = true;

                            that.set('customZoom', true);
                            $.each(searchVars.consts.Districts, function (k, v) {
                                $.each(v.Regions, function (k1, v1) {
                                    //that.get('selectedSujects')
                                    if (v1.OsmId == osmId) {
                                        if (zoom < v.DropToRegionsZoom) {
                                            newZoom = v.DropToRegionsZoom;
                                            center = $.extend({}, v.Center);
                                            $(".subject").prop("checked", false);
                                            $("#subject-" + v.Id).click();
                                            that.get('selectedSujects');
                                        } else {
                                            that.set('showSubsurfaces', true);
                                            center = $.extend({}, v1.Center);
                                            $(".subject").prop("checked", false);
                                            $("#subject-" + v.Id + "-" + v1.Id).click();
                                            if (!!v1.DropToSubsurfaceZoom)
                                                newZoom = v1.DropToSubsurfaceZoom;
                                            else
                                                newZoom = that.get('subsurfaceShowByZoom');
                                            that.set('showSubsurfacesZoom', newZoom);
                                        }
                                        var subjects = [];
                                        $.each($(".subject"), function () {
                                            if ($(this).prop("checked")) {
                                                subjects.push(parseInt($(this).val()));
                                            }
                                        });
                                        that.set('selectedSujects', subjects);
                                        if (!$(".result-container").hasClass("hide")) {
                                            center[1] = center[1] - (5 / newZoom);
                                        }
                                        if (zoom > newZoom)
                                            updateZoomAndCenter = false;
                                    }
                                });
                            });
                            // console.log(updateZoomAndCenter, "updateZoomAndCenter")
                            if (updateZoomAndCenter) {
                                searchMap.setCenter(center);
                                searchMap.setZoom(newZoom, { duration: 1500 });
                                that.updateSelectedFiltersCount();
                                $("#subjects-list-link").text(($.map($("#subjects-list").find('input[type="checkbox"]:checked'), function (item) { return $(item).find('+label').text().trim() })).join(', ') || $("#subjects-list-link").attr("data-placeholder"));
                                that.getSurfaces();
                            }
                        });
                        //reg.options.set('strokeColor', '#E07A78');
                    });
                    //console.log(JSON.stringify(searchVars.consts.Districts));
                    searchMap.geoObjects.add(regionsArray);
                    regions = regionsArray;
                    //that.set('regions', regionsArray);
                };
                regions = [];
                ymaps.regions.load('RU', {
                    lang: 'ru',
                    quality: 3
                }).then(regionsResponse, function () {
                    alert('No response');
                });

                if (!!searchVars.consts.KazShow)
                    ymaps.regions.load('KZ', {
                        lang: 'ru',
                        quality: 3
                    }).then(regionsResponse, function () {
                        alert('No response');
                    });

                $.ajax({
                    url: globalVars.consts.AbsoluteUri + "/search_fake",
                    dataType: "json",
                    type: "POST",
                    traditional: true,
                    contentType: 'application/json; charset=utf-8',
                    success: function (result) {
                        that.updateSubsurfaces(result, false, null, true);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });

                that.getAllSubSurfacesAgg();
                that.getSubsurfacesForList(false, true);
            }
            ymaps.ready(init);
        }
        //this.getSurfaces();
        /*$('.data-merged-popup').parent().on('mouseleave', function (e) {
            if ($(e.target).closest('.item').find('.opened').length) {
                $(e.target).closest('.item').find('a').text(
                    ($.map($(e.target).closest('.item').find('input[type="checkbox"]:checked'), function (item) {
                        return $(item).find('+label').text().trim()
                    })).join(', ') || $(e.target).attr("data-placeholder"));

                $(e.target).closest('.item').find('.opened').removeClass('opened');
            }
            var dStatuses = [], aStatuses = [], mCategories = [];
            $.each($(".density-statuses"), function () {
                if ($(this).prop("checked")) {
                    dStatuses.push($(this).val());
                }
            });
            $.each($(".auction-statuses"), function () {
                if ($(this).hasClass("active") && $(this).data("id") != "0") {
                    aStatuses.push($(this).data("id"));
                }
            });
            $.each($(".mineral-category"), function () {
                if ($(this).hasClass("active") && $(this).data("id") != "0") {
                    mCategories.push($(this).data("id"));
                }
            });
            
            if (!that.comparison(that.get('selectedDensityStatuses'), dStatuses)
                || !that.comparison(that.get('selectedSubsurfaceStatuses'), aStatuses)
                || !that.comparison(that.get('selectedSubsurfaceCategories'), mCategories)) {
                that.updateSelectedFiltersCount();
                that.getSurfaces();
                that.getSubsurfacesForList();
            }
            that.set('selectedDensityStatuses', dStatuses);
            that.set('selectedSubsurfaceStatuses', aStatuses);
            that.set('selectedSubsurfaceCategories', mCategories);
        });*/
        //minerals
        /*if (!!mineralsJson) {
            this.set('allMinerals', JSON.parse(mineralsJson));
            this.updateMinerals();
        }
        //subjects
        if (!!subjectsJson) {
            this.set('allSubjects', JSON.parse(subjectsJson));
            this.updateAllSubjects();
        }*/
    },
    searchOnClick: function () {
        this.getSurfaces();
    },
    selectFormationType: function (e) {
        var that = this;
        $(".popup-with-checks button.selected").removeClass("selected");
        $(e.target).closest("li").find("button").addClass("selected");
        $(e.target).closest('.item').find('a').text($(e.target).closest("button").text())

        var id = $(e.target).closest("li").attr("data-id");
        if (id != that.get('selectedSubsurfaceFormation')) {
            that.set('selectedSubsurfaceFormation', id);
            that.updateSelectedFiltersCount();
            //that.getSurfaces(false, true);
            //that.getSubsurfacesForList();
            if (id == "")
                $(e.target).closest('.item').find('a').text("Вид участка");
        }

        $(e.target).closest('.item').find('.opened').removeClass('opened');
    },
    //Search
    getSurfaces: function (concat, loadList) {
        var that = this;

        var data = {
            subjects: [],
            minerals: [],
            dStatuses: [],
            aStatuses: [],
            categories: [],
            formationType: this.get('selectedSubsurfaceFormation'),
            text: ""
        };
        $.each($(".subject_group_value"), function () {
            if ($(this).prop("checked")) {
                data.subjects.push(parseInt($(this).val()));
            }
        });
        $.each($(".mineral_group_value"), function () {
            if ($(this).prop("checked")) {
                data.minerals.push($(this).val());
            }
        });
        $.each($(".density-statuses"), function () {
            if ($(this).prop("checked")) {
                data.dStatuses.push($(this).val());
            }
        });
        $.each($(".auction-statuses"), function () {
            if ($(this).hasClass("active") && $(this).data("id") != "0") {
                data.aStatuses.push($(this).data("id"));
            }
        });
        $.each($(".mineral-category"), function () {
            if ($(this).hasClass("active") && $(this).data("id") != "0") {
                data.categories.push($(this).data("id"));
            }
        });
        if ($("#search-text") && !!$("#search-text").val())
            data.text = $("#search-text").val();

        data.fetch = 10;
        if (!!concat) {
            var totalSubsurfaces = this.get('surfacesTotalCount');
            var totalSubsurfacesShowed = this.get('surfacesTotal');
            data.fetch = ((totalSubsurfacesShowed + 10) > totalSubsurfaces) ? (totalSubsurfaces - totalSubsurfacesShowed) : 10;
        }
        data.offset = totalSubsurfacesShowed;

        if (!that.get('useObjectManager') || (searchMap.getZoom() < that.get('subsurfaceShowByZoom') && !that.get('showSubsurfaces'))) {
            that.set('searchButtonDisabled', true);

            if (that.searchAjax)
                that.searchAjax.abort();

            var watch = moment(new Date());
            that.searchAjax = $.ajax({
                url: globalVars.consts.AbsoluteUri + "/search",
                dataType: "json",
                type: "POST",
                traditional: true,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                success: function (result) {
                    // console.log(result, "stock search result");
                    that.searchAjax = null;
                    that.updateSubsurfaces(result, concat);
                    if (!!loadList)
                        that.updateSubsurfacesForList(result, concat);
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
        } else if (!!concat) {
            // console.log("concat");
            that.getSubSurfacesByIds(concat, loadList);
        }
        if (!concat)
            that.getAllSubSurfacesAgg();
    },
    getSubsurfacesForList: function (concat, fake) {
        var that = this;

        if (that.searchAjax)
            that.searchAjax.abort();

        var data = this.getSearchData();
        data.fetch = this.get('countPerPage');
        if (!!concat) {
            var totalSubsurfaces = this.get('surfacesTotalCountForList');
            var totalSubsurfacesShowed = this.get('subsurfacesShowedForList');
            data.fetch = ((totalSubsurfacesShowed + data.fetch) > totalSubsurfaces) ? (totalSubsurfaces - totalSubsurfacesShowed) : data.fetch;
        }
        data.offset = totalSubsurfacesShowed;

        that.searchAjax = $.ajax({
            url: globalVars.consts.AbsoluteUri + "/search",
            dataType: "json",
            type: "POST",
            traditional: true,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            success: function (result) {
                // console.log(result, "search result");
                that.searchAjax = null;
                that.updateSubsurfacesForList(result, concat, null, fake);
                that.updateTooltips();
            },
            error: function (error) {
                console.log(error);
            }
        });
    },
    getSearchData: function () {
        var data = {
            subjects: [],
            minerals: [],
            dStatuses: [],
            aStatuses: [],
            categories: [],
            formationType: this.get('selectedSubsurfaceFormation'),
            text: ""
        };
        $.each($(".subject_group_value"), function () {
            if ($(this).prop("checked")) {
                data.subjects.push(parseInt($(this).val()));
            }
        });
        $.each($(".mineral_group_value"), function () {
            if ($(this).prop("checked")) {
                data.minerals.push($(this).val());
            }
        });
        $.each($(".density-statuses"), function () {
            if ($(this).prop("checked")) {
                data.dStatuses.push($(this).val());
            }
        });

        $.each($(".auction-statuses"), function () {
            if ($(this).hasClass("active") && $(this).data("id") != "0") {
                data.aStatuses.push($(this).data("id"));
            }
        });
        $.each($(".mineral-category"), function () {
            if ($(this).hasClass("active") && $(this).data("id") != "0") {
                data.categories.push($(this).data("id"));
            }
        });
        if ($("#search-text") && !!$("#search-text").val())
            data.text = $("#search-text").val();

        return data;
    },
    getAllSubSurfaces: function () {
        var that = this;

        if (that.searchAjax)
            that.searchAjax.abort();

        var data = that.getSearchData();

        var bound = searchMap.getBounds();
        var visibleRegions = [];
        var bounds = [
            bound[0],
            [bound[0][0], bound[1][1]],
            bound[1],
            [bound[1][0], bound[0][1]]
        ];
        $.each(searchVars.consts.Districts, function (k, v) {
            $.each(v.Regions, function (index, region) {
                if ((bound[0][0] > region.Rectangle[2][0] || /* первый правее второго */
                    bound[1][0] < region.Rectangle[0][0] || /* первый левее второго */
                    bound[0][1] > region.Rectangle[2][1] || /* первый ниже второго */
                    bound[1][1] < region.Rectangle[0][1])) {

                } else {
                    if (visibleRegions.length == 0 || !visibleRegions.includes(region.Id))
                        visibleRegions.push(region.Id);
                }
            });
        });

        if (data.subjects.length == 0) {
            data.subjects = visibleRegions;
        }

        // console.log(data.subjects, "all");
        if (data.subjects.length > 0) {
            that.searchAjax = $.ajax({
                url: globalVars.consts.AbsoluteUri + "/search_all",
                dataType: "json",
                type: "POST",
                traditional: true,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                success: function (result) {
                    // console.log(result, "result");
                    that.searchAjax = null;
                    if (!!result.Items) {
                        if (!that.get('useObjectManager')) {
                            var myGeoObjects = [];
                            $.each(result.Items, function (k, v) {
                                if (!!v.RawCoordinate && v.RawCoordinate.Value != "" && !!v.RawCoordinate.Value) {
                                    var preset = that.getPreset(v.CategoryId);
                                    //var coords = updateGeoJson(v.RawCoordinate.Value);
                                    var coords = JSON.parse(v.RawCoordinate.Value);
                                    myPlacemark = new ymaps.Placemark(coords, {
                                        hintContent: v.Name
                                    }, {
                                        // Опции.
                                        preset: preset,
                                        iconLayout: 'default#image',
                                        // Своё изображение иконки метки.
                                        iconImageHref: 'img/placemark.png',
                                        // Размеры метки.
                                        iconImageSize: [26, 40],
                                        // Смещение левого верхнего угла иконки относительно
                                        // её "ножки" (точки привязки).
                                    });
                                    myPlacemark.events.add('click', function () {
                                        window.location.href = "/subsurface/" + v.Id + "/" + v.Source.Id;
                                    });
                                    //searchMap.geoObjects.add(myPlacemark);
                                    myGeoObjects.push(myPlacemark);
                                }
                            });
                            if (!!myGeoObjects.length) {
                                ymaps.modules.require(['PieChartClusterer'], function (PieChartClusterer) {
                                    clusterer = new PieChartClusterer({ margin: 10 });
                                    clusterer.add(myGeoObjects);
                                    clusterers.push(clusterer);
                                    searchMap.geoObjects.add(clusterer);
                                });
                            }
                        } else {
                            var placeMarksData = {
                                "type": "FeatureCollection",
                                "features": []
                            };
                            var subsurfaceIds = [];
                            $.each(result.Items, function (k, v) {
                                if (!!v.RawCoordinate && v.RawCoordinate.Value != "" && !!v.RawCoordinate.Value) {
                                    var preset = that.getPreset(v.CategoryId);
                                    var item = {
                                        "type": "Feature",
                                        "id": v.Id,
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": JSON.parse(v.RawCoordinate.Value)
                                        },
                                        "properties": {
                                            "hintContent": v.Name,
                                        },
                                        "options": {
                                            "preset": preset,
                                            /*iconLayout: 'default#image',
                                            iconImageHref: 'img/placemark.png',
                                            iconImageSize: [26, 40]*/
                                        }
                                    }
                                    subsurfaceIds.push({ Id: v.Id, Coord: JSON.parse(v.RawCoordinate.Value) });
                                    placeMarksData.features.push(item);
                                }
                            });
                            objectManager.add(placeMarksData);
                            var objectManagerOnClick = function (e) {
                                window.location.href = "/subsurface/" + e.get('objectId') + "/" + 1;
                            };
                            objectManager.objects.events.add(['click'], objectManagerOnClick);
                            var filterVisiblesubSurface = [];
                            $.each(subsurfaceIds, function (k, v) {
                                //var objectState = objectManager.getObjectState(v);
                                if (that.getVisiblePlacemark(v.Coord))
                                    filterVisiblesubSurface.push(v.Id);
                            });
                            that.set('subsurfaceIds', filterVisiblesubSurface);
                            that.set('subsurfaceIdsFull', subsurfaceIds);
                            that.getSubSurfacesByIds();
                        }
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    },
    getVisiblePlacemark: function (coordinates) {
        var bounds = searchMap.getBounds();
        //fix(rewrite)
        if (bounds[1][1] < 0)
            bounds[1][1] = 180;
        var zoom = searchMap.getZoom();
        var step = 0.14 / zoom;
        var result = (coordinates[0] >= (bounds[0][0] - step) && bounds[1][0] >= coordinates[0]
            && coordinates[1] >= bounds[0][1] && bounds[1][1] >= coordinates[1]);
        return result;
    },
    getSubSurfacesByIds: function (concat) {
        var that = this;
        var fetch = 10;
        var offset = 0;

        that.set('searchButtonDisabled', true);

        if (that.searchAjax)
            that.searchAjax.abort();

        if (concat) {
            var totalSubsurfaces = this.get('surfacesTotalCount');
            var totalSubsurfacesShowed = this.get('surfacesTotal');
            offset = totalSubsurfacesShowed;
            fetch = offset + 10;
        }

        var subsurfaceIds = that.get('subsurfaceIds');
        var ids = [];
        for (var i = offset; i < fetch && i < subsurfaceIds.length; i++) {
            ids.push(subsurfaceIds[i]);
        }

        // console.log(subsurfaceIds, ids, "ids");

        if (ids.length > 0) {
            var watch = moment(new Date());
            that.searchAjax = $.ajax({
                url: globalVars.consts.AbsoluteUri + "/search_by_ids",
                dataType: "json",
                type: "POST",
                traditional: true,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(ids),
                success: function (result) {
                    that.searchAjax = null;
                    that.updateSubsurfaces(result, concat, subsurfaceIds.length);
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
        } else {
            that.set('searchButtonDisabled', false);
            that.updateSubsurfaces({ Items: [], Total: 0 }, concat, subsurfaceIds.length);
        }
    },
    getAllSubSurfacesAgg: function () {
        var that = this;
        var data = that.getSearchData();

        var watch = moment(new Date());
        $.ajax({
            url: globalVars.consts.AbsoluteUri + "/search_agg",
            dataType: "json",
            type: "POST",
            data: JSON.stringify(data),
            traditional: true,
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                var areas = [];
                $.each(result.Items, function (k, v) {
                    if (!v.SubjectRFParentId && v.SubjectRFId != 9) { //Delete shleifs
                        areas.push(v);
                    }
                });

                var getDropZoomToRegions = function (id) {
                    var result = 5;
                    $.each(searchVars.consts.Districts, function (item, district) {
                        if (district.Id == id)
                            result = district.DropToRegionsZoom;
                    });
                    return result;
                };

                var getCenter = function (id) {
                    var result = [];
                    $.each(searchVars.consts.Districts, function (index, district) {
                        if (district.Id == id)
                            result = district.Center;
                    });
                    return result;
                };

                var getCenterRegion = function (id, regionId) {
                    var result = [];
                    $.each(searchVars.consts.Districts, function (index, district) {
                        if (district.Id == id)
                            $.each(district.Regions, function (index2, region) {
                                if (region.Id == regionId)
                                    result = region.Center;
                            });

                    });
                    return result;
                };

                var structuredAreas = [];
                $.each(areas, function (k, v) {
                    var added = false;
                    $.each(structuredAreas, function (k1, v1) {
                        if (v1.Id == v.SubjectRFId) {
                            structuredAreas[k1].Counts.push({ Count: v.Count, Category: v.SubsurfaceCategoryId });
                            added = true;
                        }
                    });
                    if (!added) {
                        structuredAreas.push({
                            Id: v.SubjectRFId,
                            Name: v.SubjectRFName,
                            Counts: [{
                                Count: v.Count,
                                Category: v.SubsurfaceCategoryId
                            }],
                            Regions: [],
                            DropToRegionsZoom: getDropZoomToRegions(v.SubjectRFId),
                            Center: getCenter(v.SubjectRFId)
                        });
                    }
                });

                $.each(structuredAreas, function (k, v) {
                    $.each(result.Items, function (k1, v1) {
                        if (v1.SubjectRFParentId == v.Id) {
                            var added = false;
                            $.each(v.Regions, function (k2, v2) {
                                if (v2.Id == v1.SubjectRFId) {
                                    structuredAreas[k].Regions[k2].Counts.push({ Count: v1.Count, Category: v1.SubsurfaceCategoryId });
                                    added = true;
                                }
                            });
                            if (!added) {
                                var item = {
                                    Id: v1.SubjectRFId,
                                    Name: v1.SubjectRFName,
                                    Counts: [{
                                        Count: v1.Count,
                                        Category: v1.SubsurfaceCategoryId
                                    }],
                                    Center: getCenterRegion(v.Id, v1.SubjectRFId)
                                };
                                /*var regions = that.get('regions');
                                $.each(regions, function (index, reg) {
                                    fined = true;
                                    if (item.Name.toLowerCase().includes(reg.Name.toLowerCase())) {
                                        item.OsmId = reg.Id;
                                        item.Center = reg.Center;
                                    }
                                });*/
                                structuredAreas[k].Regions.push(item);
                            }
                        }
                    });
                });
                //Delete shleifs
                /*if (structuredAreas.length == 9)
                    structuredAreas.splice(-1, 1);*/
                that.set('structuredAreas', structuredAreas);
                that.updateMapByZoom();

                var work = moment(moment(new Date).diff(watch)).toObject();
                console.log("Time draw work: " + work.seconds + "s " + work.milliseconds + "ms");
            },
            error: function (error) {
                console.log(error);
            }
        });
    },
    updateMapByZoom: function (zoomed) {
        var that = this;

        var structuredAreas = that.get('structuredAreas');
        var zoom = searchMap.getZoom();
        if (!!clusterers && clusterers.length > 0) {
            $.each(clusterers, function (k, v) {
                searchMap.geoObjects.remove(v);
            });
        }
        clusterers = [];
        objectManager.removeAll();
        if (zoom >= that.get('subsurfaceShowByZoom') || that.get('showSubsurfaces')) {
            that.getAllSubSurfaces();
        } else {
            $.each(structuredAreas, function (k, v) {
                if (zoom >= v.DropToRegionsZoom) {
                    //Draw regions
                    $.each(v.Regions, function (k1, v1) {
                        that.drawDiagram(v1, true);
                    });

                } else {
                    if (v.Regions.length == 1)
                        that.drawDiagram(v.Regions[0], (v.Id == 1 || v.Id == 5 || v.Id == 3 || v.Id == 4 || v.Id == 110));
                    else
                        that.drawDiagram(v, (v.Id == 1 || v.Id == 5 || v.Id == 3 || v.Id == 4 || v.Id == 110));
                    //Draw distric
                }
            });
            if(!!zoomed)
                that.getSurfaces(false, true);
        }
    },
    getPreset: function (category) {
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
    },
    drawDiagram: function (item, align) {
        var that = this;
        var myGeoObjects = [];
        var total = 0;
        var center = item.Center
        var fixedAdd = false;
        var counts = $.extend({}, item.Counts);;
        if (counts.length == 1) {
            fixedAdd = true;
            counts.push(counts[0]);
        }
        $.each(counts, function (k, v) {
            if (!fixedAdd || k == 0)
                total += v.Count;
            for (var i = 0; i < v.Count && i < 1; i++) {
                var preset = that.getPreset(v.Category);
                myPlacemark = new ymaps.Placemark(center, {}, {
                    // Опции.
                    preset: preset,
                    iconLayout: 'default#image',
                    // Своё изображение иконки метки.
                    iconImageHref: 'img/placemark.png',
                    // Размеры метки.
                    iconImageSize: [26, 40],
                    // Смещение левого верхнего угла иконки относительно
                    // её "ножки" (точки привязки).
                });
                //searchMap.geoObjects.add(myPlacemark);
                myGeoObjects.push(myPlacemark);
            }
        });
        if (!!myGeoObjects.length) {
            var html = (!!align ? '<canvas style="margin-left:-33px;margin-top:-33px;" id="chart_' + item.Id + '" width="66" height="66"></canvas>'
                : '<canvas id="chart_' + item.Id + '" width="66" height="66"></canvas>')
            var myIcon = ymaps.templateLayoutFactory.createClass(html,
                {
                    build: function () {
                        myIcon.superclass.build.call(this);
                        var drawingCanvas = document.getElementById('chart_' + item.Id);
                        if (drawingCanvas && drawingCanvas.getContext) {
                            var context = drawingCanvas.getContext('2d');
                            // рисуем окружность
                            context.fillStyle = "#ddd";
                            context.strokeStyle = "#ddd";
                            context.beginPath();
                            context.arc(33, 33, 25, 0, Math.PI * 2, true);
                            context.closePath();
                            context.fill();

                            if (item.Counts.length > 0) {
                                var color = ["#B3B3B3", "#793D0E", "#0E4779", "#1E98FF", "#B3B3B3", "#134B44", "#FFD800", "#CB4562", "#339CC3"];
                                var start = 0;
                                $.each(item.Counts, function (k, v) {
                                    // рисуем сектор окружности num%
                                    context.fillStyle = color[v.Category];
                                    context.beginPath();
                                    context.moveTo(33, 33);
                                    //координаты старта определяем так чтоб закрашенная область всегда была снизу
                                    var end = start + (Math.PI / 180) * (v.Count / total) * 360;
                                    context.arc(33, 33, 25, start, end, false);
                                    start = end;
                                    context.closePath();
                                    context.fill();
                                });
                            }

                            // закрашиваем внутреннюю окружность меньшего радиуса
                            context.fillStyle = "#F8F8F8";
                            context.beginPath();
                            context.arc(33, 33, 18, 0, Math.PI * 2, true);
                            context.closePath();
                            context.fill();

                            // пишем текст
                            context.fillStyle = "#000000";
                            context.font = "normal 13px Arial";
                            context.textAlign = "center";
                            context.textBaseline = 'middle';
                            var x = drawingCanvas.width / 2;
                            var y = drawingCanvas.height / 2;
                            context.fillText(total, x, y);
                        }
                    },
                    onChartClick: function () {
                    }
                });
            var clustererCustom = new ymaps.Clusterer({
                // Зададим произвольный макет метки кластера.
                clusterIconLayout: myIcon,
                clusterHintContent: "asdad",
                // Чтобы метка стала кликабельной, нужно переопределить ее активную область.
                clusterIconShape: {
                    type: 'Rectangle',
                    coordinates: [[0, 0], [20, 20]]
                }
            });
            clustererCustom.events.add('click', function (e) {
                that.set('clickDiagram', true);
                var customZoom = function () {
                    that.set('clickDiagram', false);
                    var center = null;
                    var zoom = searchMap.getZoom();
                    var newZoom = null;
                    that.set('customZoom', true);
                    $.each(searchVars.consts.Districts, function (k, v) {
                        $.each(v.Regions, function (k1, v1) {
                            if (v1.Id == item.Id) {
                                if (zoom < v.DropToRegionsZoom) {
                                    newZoom = v.DropToRegionsZoom;
                                    center = $.extend({}, v.Center);
                                    $(".subject").prop("checked", false);
                                    $("#subject-" + v.Id).click();
                                } else {
                                    that.set('showSubsurfaces', true);
                                    center = $.extend({}, v1.Center);
                                    $(".subject").prop("checked", false);
                                    $("#subject-" + v.Id + "-" + v1.Id).click();
                                    if (!!v1.DropToSubsurfaceZoom)
                                        newZoom = v1.DropToSubsurfaceZoom;
                                    else
                                        newZoom = that.get('subsurfaceShowByZoom');
                                    that.set('showSubsurfacesZoom', newZoom);
                                }
                            }
                        });
                    });
                    if (!!zoom && !!center) {
                        if (!$(".result-container").hasClass("hide")) {
                            center[1] = center[1] - (5 / newZoom);
                        }
                        searchMap.setCenter(center);
                        searchMap.setZoom(newZoom, { duration: 1500 });
                        that.updateSelectedFiltersCount();
                        $("#subjects-list-link").text(($.map($("#subjects-list").find('input[type="checkbox"]:checked'), function (item) { return $(item).find('+label').text().trim() })).join(', ') || $("#subjects-list-link").attr("data-placeholder"));
                        that.getSurfaces();
                    }
                };
                setTimeout(customZoom, 500);
            });
            clusterers.push(clustererCustom);
            clustererCustom.add(myGeoObjects);
            searchMap.geoObjects.add(clustererCustom);
        }
    },
    getDisrictCenter: function (id) {
        var result = [];
        $.each(searchVars.consts.Districts, function (k, v) {
            if (id == v.Id) {
                result = v.Center;
            }
        });
        return result;
    },
    drawDistrict: function () {
        var that = this;
        var structuredAreas = this.get('structuredAreas');

        var myGeoObjects = [];
        clusterers = [];
        $.each(structuredAreas, function (index, item) {
            var center = that.getDisrictCenter(item.Id);
            myGeoObjects = [];
            var total = 0;

        });
    },
    updateSubsurfaces: function (result, concat, total, fake) {
        var that = this;
        $.each(result.Items, function (k, v) {

            result.Items[k].minerals = "";
            if (!!v.Minerals) {
                var names = [];
                $.each(v.Minerals, function (k1, v1) {
                    names.push(v1.Name);
                });
                result.Items[k].minerals = names.join(', ');
            }
            if (!!v.SubjectRF) {
                var subjects = [];
                $.each(v.SubjectRF, function (k1, v1) {
                    subjects.push(v1.Name);
                });
                result.Items[k].SubjectRFStr = subjects.join(', ');
            }
            if (!!v.StockInfo && !!v.StockInfo.MainMineralStocks) {
                $.each(v.StockInfo.MainMineralStocks, function (k1, v1) {
                    result.Items[k].StockInfo.MainMineralStocks[k1].mainResource = null;
                    var hasPrognosses = (v.StockInfo.StockMineralResourcePrognoses != null && v.StockInfo.StockMineralResourcePrognoses.length > k1);
                    if (hasPrognosses) {
                        result.Items[k].StockInfo.MainMineralStocks[k1].mainResource = item.StockInfo.StockMineralResourcePrognoses[k1 + 1];
                    }
                });
            }
            if (!!v.Licenses && v.Licenses.length > 0) {
                var fined = false;
                $.each(v.Licenses, function (k1, v1) {
                    if (!fined && v1.Status == "Действующая") {
                        result.Items[k].Licenses[0] = v1;
                        fined = true;
                    }
                });
            }

            if (v.FutureUsabilities && v.FutureUsabilities.length > 0) {
                result.Items[k].FutureUsabilities[0].QuarterText = "";
                if (!!result.Items[k].FutureUsabilities[0].DeadLine)
                    result.Items[k].FutureUsabilities[0].QuarterText = getQuarterText(result.Items[k].FutureUsabilities[0].DeadLine, "КВ.", false);
            }
        });

        if (!!concat) {
            var surfaces = that.get('surfaces');
            $.each(result.Items, function (k, v) {
                surfaces.push(v);
            });
            that.set('surfaces', surfaces);
        } else {
            that.set('surfaces', result.Items);
        }

        that.updateTooltips();
        // console.log(result.Items, "result.Items");
        that.set('surfacesTotal', that.get('surfaces').length);
        that.set('surfacesTotalCount', (typeof (total) != "undefined" && total) ? total : result.Total);

        if (!fake)
            that.set('visibleLoadMore', true);
        //
        // NOTE!
        // При обновлении УН-ов по геолокации также обновляем УН-ы в разделе списка.
        //
        that.updateSubsurfacesForList(result, concat, (typeof (total) != "undefined" && total) ? total : result.Total);
    },

    updateSubsurfacesForList: function (result, concat, total, fake) {
        var that = this;
        $.each(result.Items, function (k, v) {
            result.Items[k].minerals = "";
            if (!!v.Minerals) {
                var names = [];
                $.each(v.Minerals, function (k1, v1) {
                    names.push(v1.Name);
                });
                result.Items[k].minerals = names.join(', ');
            }
            if (!!v.SubjectRF) {
                var subjects = [];
                $.each(v.SubjectRF, function (k1, v1) {
                    subjects.push(v1.Name);
                });
                result.Items[k].SubjectRFStr = subjects.join(', ');
            }
            if (!!v.StockInfo && !!v.StockInfo.MainMineralStocks) {
                $.each(v.StockInfo.MainMineralStocks, function (k1, v1) {
                    result.Items[k].StockInfo.MainMineralStocks[k1].mainResource = null;
                    var hasPrognosses = (v.StockInfo.StockMineralResourcePrognoses != null && v.StockInfo.StockMineralResourcePrognoses.length > k1);
                    if (hasPrognosses) {
                        result.Items[k].StockInfo.MainMineralStocks[k1].mainResource = item.StockInfo.StockMineralResourcePrognoses[k1 + 1];
                    }
                });
            }
            if (!!v.Licenses && v.Licenses.length > 0) {
                var fined = false;
                $.each(v.Licenses, function (k1, v1) {
                    if (!fined && v1.Status == "Действующая") {
                        result.Items[k].Licenses[0] = v1;
                        fined = true;
                    }
                });
            }

            if (v.FutureUsabilities && v.FutureUsabilities.length > 0) {
                result.Items[k].FutureUsabilities[0].QuarterText = "";
                if (!!result.Items[k].FutureUsabilities[0].DeadLine)
                    result.Items[k].FutureUsabilities[0].QuarterText = getQuarterText(result.Items[k].FutureUsabilities[0].DeadLine, "КВ.", false);
            }
        });

        if (!!concat) {
            var surfaces = that.get('surfacesForList');
            $.each(result.Items, function (k, v) {
                surfaces.push(v);
            });
            that.set('surfacesForList', surfaces);
        } else {
            that.set('surfacesForList', result.Items);
        }

        that.set('subsurfacesShowedForList', that.get('surfacesForList').length);
        that.set('surfacesTotalCountForList', (typeof (total) != "undefined" && total)? total : result.Total);
        if(fake)
            that.set('surfacesTotalCount', that.get('surfacesTotalCountForList'));
    },
    loadMore: function () {
        this.getSurfaces(true);
    },
    loadMoreForList: function () {
        this.getSubsurfacesForList(true);
    },
    //openPopup
    openPopup: function (e) {
        var that = this;
        $(e.target).blur();

        var el = $('#' + $(e.target).closest('a').attr('data-popup-id'));

        if (!el.length)
            return false;

        var openPopup = function () {
            $.magnificPopup.open({
                items: {
                    src: el
                },
                type: 'inline',
                callbacks: {
                    open: function () {
                        // $(e.target).closest('a').addClass('opened');
                        $(".mfp-content").height($(window).height());
                    },
                    close: function () {
                        // Перепиши это как хочешь)
                        $(e.target).closest('a').text(($.map(el.find('input[type="checkbox"]:checked'), function (item) { return $(item).find('+label').text().trim() })).join(', ') || $(e.target).closest('a').attr("data-placeholder"));
                        $(e.target).closest('a').removeClass('opened');

                        var subjects = [], minerals = [];
                        $.each($(".subject"), function () {
                            if ($(this).prop("checked")) {
                                subjects.push(parseInt($(this).val()));
                            }
                        });
                        $.each($(".mineral"), function () {
                            if ($(this).prop("checked")) {
                                minerals.push($(this).val());
                            }
                        });

                        // console.log();
                        if (!that.comparison(that.get('selectedSujects'), subjects) || !that.comparison(that.get('selectedMinerals'), minerals)) {
                            that.updateSelectedFiltersCount();
                            //that.getSurfaces(false, true);
                            //that.getSubsurfacesForList();
                        }
                        that.set('selectedSujects', subjects);
                        that.set('selectedMinerals', minerals);
                        if (subjects.length != 1)
                            that.set('showSubsurfaces', false);
                    }
                }
            });
        }

        $(e.target).closest('a').addClass('opened');

        // WAIT ANIMATION AND SHOW
        setTimeout(function () {
            openPopup();
        }, 800);
    },
    openMergedPopup: function (e) {
        //$(e.target).blur();

        var el = $(e.target).closest('a');

        $(e.target).closest('a').toggleClass('opened');
        return false;
    },
    fullInfoOnChanges: function (e) {
        $('.result-container').toggleClass('full');
        this.resizeMap();
    },
    hideResults: function () {
        if ($('.result-container').hasClass("hide")
            && $("#visible-storage").prop("checked")) {
            $('.result-container .results').css("height", "auto");
            $('.result-container').addClass("full");
        } else {
            //$('.result-container .results').css("height", $('.result-container .results').height() + "px");
            $('.result-container').removeClass("full");
        }
        $('.result-container').toggleClass('hide');

    },
    //Map Work
    resizeMap: function () {
        var mapTop = $('.result-container').position().top - $(window).scrollTop();
        mapTop = Math.max(mapTop, 0);
        $('.search-container .map').css('top', mapTop);
        $('.search-container .map > ymaps').height($('.search-container .map').outerHeight());

        if (searchMap) {
            searchMap.container.fitToViewport();
        }

        /*var h = $(window).outerHeight() - $('.search-container .filter').outerHeight() -
            $('.search-container .search-input').outerHeight();

        if ($('.search-container').hasClass('fixed') && $('.search-container').hasClass('compact')) {
            h = $(window).outerHeight();
        }

        $('#search-map').height(h);
        $('#search-map > ymaps').height(h);
        $('.result-container').css('min-height', h);
        $('.result-container').css('height', $('.result-container .results ').outerHeight());*/
    },
    //Change Subjects
    subjectChange: function (e) {
        var subjectGroupId = $(e.target).val();
        var selectedGroupIsAll = this.get("selectedSubjectId") == subjectGroupId;
        var subjects = this.get("subjects");

        $.each(subjects, function (k, v) {
            if (subjectGroupId == v.Id) {
                $.each(v.Child, function (k1, v1) {
                    if (!v1.Filtered) {
                        $("#subject-" + v1.ParentId + "-" + v1.Id).prop("checked", $(e.target).prop("checked"));
                        if (selectedGroupIsAll) {
                            $("#subject-" + v1.ParentId + "-" + v1.Id + "-all").prop("checked", $(e.target).prop("checked"));
                        }
                    }
                });
            }
        });

        //$(e.target).closest("li").find(".subject").prop("checked", $(e.target).prop("checked"));
        if (selectedGroupIsAll) {
            //$(".subject_all").prop("checked", $(e.target).prop("checked"));
            $("#" + $(e.target).attr("id") + "-all").prop("checked", $(e.target).prop("checked"));
        }
        this.updateSelectedSubjectsCount();
    },
    subjectChildChange: function (e) {
        var subjectGroupId = $(e.target).closest(".subject_group").find(".subject_group_header").first().val();
        var subjects = this.get("subjects");

        var allSelected = true;
        $.each(subjects, function (k, v) {
            if (subjectGroupId == v.Id) {
                $.each(v.Child, function (k1, v1) {
                    if (!v1.Filtered && !$("#subject-" + v1.ParentId + "-" + v1.Id).prop("checked")) {
                        allSelected = false;
                    }
                });
            }
        });

        $(e.target).closest(".subject_group").find(".subject_group_header").prop("checked", allSelected);
        $("#" + this.getIdForSubjectGroupAll()).prop("checked", allSelected);

        $("#" + $(e.target).attr("id") + "-all").prop("checked", $(e.target).prop("checked"));
        this.updateSelectedSubjectsCount();
    },
    mineralChange: function (e) {
        var mineralGroupId = $(e.target).val();
        var selectedGroupIsAll = this.get("selectedGroupId") == mineralGroupId;
        var minerals = this.get("minerals");

        $.each(minerals, function (k, v) {
            if (mineralGroupId == v.Id) {
                $.each(v.Minerals, function (k1, v1) {
                    if (!v1.Filtered) {
                        $("#mineral-" + v1.GroupId + "-" + v1.Id).prop("checked", $(e.target).prop("checked"));
                        if (selectedGroupIsAll) {
                            $("#mineral-" + v1.GroupId + "-" + v1.Id + "-all").prop("checked", $(e.target).prop("checked"));
                        }
                    }
                });
            }
        });

        //$(e.target).closest("li").find(".mineral_group_value").prop("checked", $(e.target).prop("checked"));
        if (selectedGroupIsAll) {
            //$(".mineral_all").prop("checked", $(e.target).prop("checked"));
            $("#" + $(e.target).attr("id") + "-all").prop("checked", $(e.target).prop("checked"));
        }
        this.updateSelectedMineralsCount();
    },
    mineralChildChange: function (e) {
        var mineralGroupId = $(e.target).closest(".mineral_group").find(".mineral_group_header").first().val();
        var minerals = this.get("minerals");

        var allSelected = true;
        $.each(minerals, function (k, v) {
            if (mineralGroupId == v.Id) {
                $.each(v.Minerals, function (k1, v1) {
                    if (!v1.Filtered && !$("#mineral-" + v1.GroupId + "-" + v1.Id).prop("checked")) {
                        allSelected = false;
                    }
                });
            }
        });

        $(e.target).closest(".mineral_group").find(".mineral_group_header").prop("checked", allSelected);
        $("#" + this.getIdForMineralGroupAll()).prop("checked", allSelected);

        $("#" + $(e.target).attr("id") + "-all").prop("checked", $(e.target).prop("checked"));
        this.updateSelectedMineralsCount();
    },
    gorizontalSelectOnClick: function (e) {
        if (e) {
            var update = true;
            if ($(e.target).data("id") == 0) {
                if ($(e.target).hasClass("active"))
                    update = false;
                $(e.target).closest("div").find("button").removeClass("active");
            }
            else
                $(e.target).closest("div").find("button[data-id='0']").removeClass("active");
            $(e.target).toggleClass("active");
            if (update) {
                this.updateSelectedFiltersCount();
                //this.getSurfaces(false, true);
                //this.getSubsurfacesForList();
            }
        }
    },
    okButtonClick: function () {
        $(".mineral, .subject, .formation-type, .auction-statuses, .mineral-category").prop('checked', false);
        $(".auction-statuses, .mineral-category").removeClass("active");
        $(".auction-statuses[data-id='0'], .mineral-category[data-id='0']").addClass("active");
        this.set('selectedSubsurfaceFormation', null);
        $(".formation-type").removeClass("selected");
        $("#search-text").val('');
        this.set('selectedFiltersCount', 0);
        $.each($('.filters .select-list .item > a'), function (k, v) {
            $(v).text($(v).attr("data-placeholder"));
        });
    },
    selectCountInPage: function (e) {
        if (e) {
            var countPerPage = this.get('countPerPage');
            var count = $(e.target).closest("li").data("id");
            if (count != countPerPage) {
                this.set('countPerPage', count);
                this.getSubsurfacesForList();
                $(e.target).closest("ul").find("button").removeClass("selected");
                $(e.target).find("button").addClass("selected");
                $(e.target).closest(".item").find("a").removeClass("opened");
            }
        }
    },
    searchTextKeyUp: function (e) {
        if (e.keyCode == 13) {
            this.getSurfaces(false, true);
            //this.getSubsurfacesForList();
        }
    },
    openFilters: function (e) {
        $(e.target).blur();
        $('.search-container').toggleClass('compact');
        this.resizeMap();
        return false;
    },
    updateInFavorites: function (e) {
        if (!!e && !!e.data) {
            var that = this;
            var id = e.data.Id;
            var auth = $(e.currentTarget).attr("data-user-authenticated").toLowerCase() == "true";
            that.updateFavoriteItem(id, e.data.FavoriteId, 'surfacesForList', auth);
        }
    },
    //Visible
    loadMoreForListVisible: function () {
        return this.get('subsurfacesShowedForList') < this.get('surfacesTotalCountForList');
    },
    getVisibleNotFined: function () {
        return this.get('surfacesTotal') == 0;
    },
    getVisibleShowStocks: function () {
        return this.get("surfacesTotal") != 0;
    },
    getVisibleMoreSubsurfaces: function () {
        return this.get('surfacesTotal') < this.get('surfacesTotalCount') && this.get('visibleLoadMore');
    },
    getVisibleMap: function () {
        return this.get('mapMode');
    },
    getVisibleList: function () {
        return !this.get('mapMode');
    },

    //Help Events and Update events
    setListMode: function () {
        this.set('mapMode', false);
    },
    setMapMode: function () {
        this.set('mapMode', true);
        $(window).scroll();
    },
    updateSelectedFiltersCount: function () {
        this.set('selectedFiltersCount', $(".mineral_group_value:checked").length + $(".subject_group_value:checked").length
            + $(".auction-statuses.active:not([data-id='0'])").length + $(".density-statuses:checked").length + $(".mineral-category.active:not([data-id='0'])").length
            + $(".formation-type.selected:not([data-id='0'])").length);
    },
    surfaceLinkOnClick: function (e) {
        window.open(globalVars.consts.AbsoluteUri + "/subsurface/" + e.data.Id + "/" + e.data.Source.Id, "_blank");
    },
    favoriteBtnClick: function (e) {
        var that = this;

        that.updateFavoriteItem(
            e.data.Id,
            e.data.FavoriteId,
            'surfaces',
            $(e.currentTarget).attr("data-user-authenticated").toLowerCase() == "true"
        );

        e.stopPropagation();
    },

    //helpers
    updateFavoriteItem: function (id, favoriteId, name, auth) {
        var that = this;
        var newItems = [];

        if (auth) {
            if (!favoriteId) {
                $.ajax({
                    url: globalVars.consts.AbsoluteUri + "/api/favorites/add_subsurface?subsurfaceId=" + id,
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
    comparison: function (arr1, arr2) {
        if (arr1.length != arr2.length) return false;
        var on = 0;
        for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr2.length; j++) {
                if (arr1[i] === arr2[j]) {
                    on++;
                    break;
                }
            }
        }
        return on == arr1.length ? true : false
    },
    pickSubsurfaceOnClick: function(e){
        var auth = $(e.currentTarget).attr("data-user-authenticated").toLowerCase() == "true";
        if (auth) {
            $("#pick-subsurface-text").val("");
            $("#pick-subsurface-button").prop("disabled", true);
            $.magnificPopup.open({
                items: {
                    src: "#pick-subsurface"
                },
                type: 'inline'
            });
        } else {
            $.magnificPopup.open({
                items: {
                    src: "#to-pick-subsurface"
                },
                type: 'inline'
            });
        }
    },

    // NOTE!
    // Каждый раз когда меняется HTML, необходимо обновлять тултипы.
    // Это происходит часто благодаря кендовским шаблонам.
    updateTooltips: function () {
        $('.tooltip').tooltipster({
            theme: 'tooltipster-borderless',
            side: 'left'
        });
    },

    //dataSources
    subsurfaceStatuses: [
        {
            Id: 0,
            Name: "Все участки"
        },
        {
            Id: 1,
            Name: "Объявлены торги"
        },
        {
            Id: 2,
            Name: "Перечни"
        },
        {
            Id: 3,
            Name: "Лицензии"
        },
        {
            Id: 4,
            Name: "Без лицензии"
        }
    ],
    mineralCategories: [
        {
            Id: 0,
            Name: "Все ПИ"
        },
        {
            Id: 1,
            Name: "ТПИ"
        },
        {
            Id: 2,
            Name: "УВС"
        },
        {
            Id: 3,
            Name: "Воды"
        },
        {
            Id: 4,
            Name: "ОПИ"
        }
    ],
    formationTypesDataSource: new kendo.data.DataSource({
        transport: {
            read: {
                url: globalVars.consts.AbsoluteUri + "/api/subsurface/geological_formation_types?withNull=true",
                dataType: "json",
                type: "GET"
            },
            parameterMap: function (data, operation) {
                return JSON.stringify(data);
            }
        },
        schema: {
            errors: function (response) {
                return response.Error;
            }
        },
        error: function (error) {
            console.log(error.responseJSON);
        },
    })
};

$(document).ready(function () {
    window.searchVM = kendo.observable(searchVM);
    kendo.bind($("#search"), window.searchVM);

    window.searchVM.init();
    $(window).trigger('resize');
});

$(window).on('scroll', function (e) {
    var scrTop = $(window).scrollTop();
    var filters = $(".search-container .filters").outerHeight() + $(".search-container .search-input").outerHeight() + $('header').outerHeight();
    // console.log(scrTop, filters, "scroll");
    if (scrTop >= filters) {
        /*if (!$('.search-container').hasClass('fixed'))
            $(document).scrollTop(filters);*/
        $('.search-container').css("padding-top", $(".search-container .filters").outerHeight() + $(".search-container .search-input").outerHeight() + "px")
        $('.search-container').addClass('fixed');
        $('.search-container').addClass('compact');
        window.searchVM.resizeMap();
    }
    else {
        $('.search-container').removeClass('fixed');
        $('.search-container').css("padding-top", "0");
        window.searchVM.resizeMap();
    }
});

$(window).on('resize', function (e) {
    window.searchVM.resizeMap();
});