var myMap,
    neighbors = [],
    neighborsObjects = [],
    minZoom = 0,
    maxZoom = 0;
$(document).ready(function() {
	if ($('#map').length) {
		ymaps.ready(init);
        var placemarks = [];

	    // getCenterOfPolygon(coords)

	    function init() {
	        var settings = {
	            center: [55.74954, 37.621587],
	            zoom: 3,
	            controls: [],
	            behaviors: ['drag'],
	        };

            if (coords.length > 0) {
                var center = getCenterOfPolygonByMap(coords).Center;
	            var min = center[1];
	            $.each(coords, function (k, v) {
	                $.each(v, function (k1, v1) {
	                    if (v1[1] < min)
	                        min = v1[1];
	                });
                });
	            settings.center = [center[0], min];
	            settings.zoom = getZoomOfMap(coords);
	        }
           
	        myMap = new ymaps.Map("map", settings, {
                    minZoom: 3
                });
	        addControlsToMap(myMap);

	        minZoom = myMap.getZoom();
	        maxZoom = minZoom - 2;

	        myMap.events.add('boundschange', function (e) {
	            var newZoom = e.get('newZoom'),
                      oldZoom = e.get('oldZoom');
	            if (newZoom != oldZoom) {
	                updateNeighbors($("#show-neighbors").prop("checked"), newZoom);
	            }
	        });

	        //myMap.addControl(new YMaps.ScaleLine());
	        //myMap.controls.add('smallZoomControl', { top: 70, right: 5 });
	        // var coords = [[55.75, 37.50],[55.75, 37.71],[55.70, 37.70], [55.68, 37.66],[55.73, 37.58]];
            if (!!coords.isPolygon) {
                var myPolygon = new ymaps.GeoObject({
                    geometry: {
                        type: "Polygon",
                        coordinates: coords
                    },
                    options: {
                        zIndex: 100,
                    }
                });
                myMap.geoObjects.add(myPolygon);
            } else {
                $.each(coords, function (k, v) {
                    var myPolygon = new ymaps.GeoObject({
                        geometry: {
                            type: "Polygon",
                            coordinates: [v]
                        },
                        options: {
                            zIndex: 100,
                        }
                    });
                    myMap.geoObjects.add(myPolygon);

                });
            }

            if (coords.length > 0) {
                var number = 1;
                $.each(coords, function (k, v) {
                    for (var i = 0; i < v.length; i++) {
                        myPlacemark = new ymaps.Placemark(
                          v[i],
                          {
                              hintContent: $("#coord_" + (i + 1)).text()
                          }, {
                              //preset: "islands#blueCircleDotIcon",
                              iconLayout: 'default#image',
                              // Своё изображение иконки метки.
                              iconImageHref: location.origin + '/img/placemark_blue.png',
                              // Размеры метки.
                              iconImageSize: [13, 12],
                              iconImageOffset: [-6, -6],
                              zIndex: 1
                          }
                        );
                        myPlacemark.events.add('mouseenter', function (e) {
                            $.each(placemarks, function (k, v) {
                                if (v == e.get('target')) {
                                    $(".panel-with-coords ul li[data-id='" + (k + 1) + "']").addClass("hover");
                                    $(".panel-with-coords").stop(true, true).animate({
                                        scrollTop:
                                            $(".panel-with-coords").scrollTop()
                                            + $(".panel-with-coords ul li[data-id='" + (k + 1)+ "']").position().top + 'px'
                                    }, 'fast');
                                }
                            });
                            
                        });
                        myPlacemark.events.add('mouseleave', function (e) {
                            $.each(placemarks, function (k, v) {
                                if (v == e.get('target')) {
                                    $(".panel-with-coords ul li[data-id='" + (k + 1) + "']").removeClass("hover");
                                }
                            });

                        });
                        placemarks.push(myPlacemark);
                        myMap.geoObjects.add(myPlacemark);
                        number++;
                    }
                });
	        }

			var accessor = myMap.copyrights.add('&copy; RosComputing');
        }

        $(".panel-with-coords ul li").on('mouseover', function () {
            var index = $(this).attr("data-id") - 1;
            if (!!placemarks[index]) {
                placemarks[index].options.set('iconImageHref', location.origin + '/img/placemark_red.png');
                placemarks[index].options.set('zIndex', 2);
            }
        });
        $(".panel-with-coords ul li").on('mouseout', function () {
            var index = $(this).attr("data-id") - 1;
            if (!!placemarks[index]) {
                placemarks[index].options.set('iconImageHref', location.origin + '/img/placemark_blue.png');
                placemarks[index].options.set('zIndex', 1);
            }
        });

        $("#show-neighbors").change(function () {
            updateNeighbors($(this).prop("checked"), myMap.getZoom());
        });
	}
});

function updateNeighbors(show, zoom) {
    if (zoom < maxZoom)
        zoom = maxZoom;
    if (zoom > minZoom)
        zoom = minZoom;
    removeNeighbors();
    if (!!show) {
        if (neighbors.filter(function (element) { return element.zoom == zoom }).length == 0) {
            var bounds = myMap.getBounds();
            $.ajax({
                url: globalVars.consts.AbsoluteUri + "/api/subsurface/get_neighbors",
                dataType: "json",
                data: {
                    uX: bounds[0][0],
                    uY: bounds[0][1],
                    lX: bounds[1][0],
                    lY: bounds[1][1],
                    currentId: $("#subsurface-id").val()
                },
                type: "POST",
                success: function (result) {
                    if (result && result.Items) {
                        $.each(result.Items, function (k, v) {
                            if (v.RawCoordinate && v.RawCoordinate.Value) {
                                result.Items[k].coords = updateGeoJson(v.RawCoordinate.Value);
                            }
                        });
                        neighbors.push({
                            zoom: zoom,
                            items: result.Items
                        });
                        drawNeighbors(zoom);
                    }
                }
            });
        } else {
            drawNeighbors(zoom);
        }
    } 
}

function drawNeighbors(zoom) {
    var filter = neighbors.filter(function (element) { return element.zoom == zoom });
    if (filter.length == 1) {
        var items = filter[0].items;
        $.each(items, function (index, item) {
            
            var coords = item.coords;
            if (!!coords) {
                var color = "#FFCA73";
                if (!!coords.isPolygon) {
                    var myPolygon = new ymaps.GeoObject({
                            // Описываем геометрию типа "Ломаная линия".
                            geometry: {
                                type: "Polygon",
                                coordinates: coords
                            },
                            options: {
                                zIndex: 50,
                            },
                            // Описываем данные геообъекта.
                            properties: {
                                hintContent: item.Name
                            }
                        }, {
                            opacity: 0.5,
                            fillColor: color
                        });
                    neighborsObjects.push(myPolygon);
                    myMap.geoObjects.add(myPolygon);
                    myPolygon.events.add('click', function () {
                        window.location.href = globalVars.consts.AbsoluteUri + '/subsurface/' + item.Id + "/1";
                    });
                } else {
                    $.each(coords, function (k, v) {
                            var myPolygon = new ymaps.GeoObject({
                                // Описываем геометрию типа "Ломаная линия".
                                geometry: {
                                    type: "Polygon",
                                    coordinates: [v]
                                },
                                options: {
                                    zIndex: 50,
                                },
                                // Описываем данные геообъекта.
                                properties: {
                                    hintContent: item.Name
                                }
                            }, {
                                opacity: 0.5,
                                fillColor: color
                            });
                            neighborsObjects.push(myPolygon);
                            myMap.geoObjects.add(myPolygon);
                            myPolygon.events.add('click', function (e) {
                                window.location.href = globalVars.consts.AbsoluteUri + '/subsurface/' + item.Id + "/1";
                            });
                    });
                }
            }
        })
    }
}

function removeNeighbors() {
    $.each(neighborsObjects, function (k, v) {
        myMap.geoObjects.remove(v);
    });
    neighborsObjects = [];
}