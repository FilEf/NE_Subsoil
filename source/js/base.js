// Получаем центр полигона
// var coords = [[55.75, 37.50],[55.75, 37.71],[55.70, 37.70], [55.68, 37.66],[55.73, 37.58]];
function getQuarterText(date, qText, addYear) {
    var result = "";
    if(!moment(date).isValid())
        return result;
    
    var quarter = Math.ceil(moment(date).get('month') / 3);
    switch (quarter) {
        case 1:
            result += "I";
            break;
        case 2:
            result += "II";
            break;
        case 3:
            result += "III";
            break;
        case 4:
            result += "IV";
            break;
        default: break;
    }

    result += " " + (qText ? qText : "квартал") + " " + moment(date).get('year') + (!!addYear ? " года" : "");
    if(!!addYear)
        result += " года";

    return result;
}

function updateGeoJson(geoJson) {
    var result = [];
    var coordsJson = JSON.parse(geoJson.replace(new RegExp("&quot;", 'g'), '"').replace(new RegExp("&#39;", 'g'), '\''));
    var c = 1;
    for (var i = 0; i < coordsJson.length; i++) {
        var item = coordsJson[i];
        for (key in item) {
            if (key.indexOf("DDMMSS") > -1) {
                delete item[key];
            }
        }
        var count_unnamed = item.count_unnamed;
        if (!!item.coords)
            result.push(item.coords);
        else if (!!item.count_unnamed) {
            var count_unnamed = item.count_unnamed;
            if (count_unnamed > 0) {
                var newItem = [];
                for (var j = 0; j <= count_unnamed; j++) {
                    if (!!item[j]) {
                        var it = [];
                        for (var c = 0; c < item[j].length; c++) {
                            if (!!item[j][c])
                                it.push(item[j][c]);
                        }
                        newItem.push(it);
                    }
                }
                if (newItem.length > 0) {
                    if (newItem.length == 1)
                        result.push(newItem[0]);
                    else {
                        result.isPolygon = true;
                        $.each(newItem, function (k, v) {
                            if(Array.isArray(v))
                                result.push(v);
                        });
                    }

                }
            }
        } else {
            var items = [];
            $.each(item, function (k, v) {
                if (Array.isArray(v))
                    result.push(v);
            });
            result.isPolygon = true;
        }
    }
    return result;
}

function getCenterOfPolygon(polygon) {
    var X = 0;
    var Y = 0;
    var Z = 0;
    $.each(polygon, function (index, items) {
        $.each(items, function (k, item) {
            lat = item[0] * Math.PI / 180;
            lon = item[1] * Math.PI / 180;

            X += Math.cos(lat) * Math.cos(lon)
            Y += Math.cos(lat) * Math.sin(lon)
            Z += Math.sin(lat)
        });
    });

    Lon = Math.atan2(Y, X)
    Hyp = Math.sqrt(X * X + Y * Y)
    Lat = Math.atan2(Z, Hyp)
    Lat = Lat * 180 / Math.PI
    Lon = Lon * 180 / Math.PI

    return [Lat, Lon];
}

function getCenterOfPolygonByMap(polygon) {
    var maxX = 0;
    var maxY = 0;
    var minX = 360;
    var minY = 360;

    $.each(polygon, function (index, items) {
        $.each(items, function (k, item) {
            if (maxX < item[0])
                maxX = item[0];
            if (maxY < item[1])
                maxY = item[1];
            if (minX > item[0])
                minX = item[0];
            if (minY > item[1])
                minY = item[1];
            /*lat = item[0] * Math.PI / 180;
            lon = item[1] * Math.PI / 180;

            X += Math.cos(lat) * Math.cos(lon)
            Y += Math.cos(lat) * Math.sin(lon)
            Z += Math.sin(lat)*/
        });
    });

    var X = minX + ((maxX - minX) / 2);
    var Y = minY + ((maxY - minY) / 2);
    /*Lon = Math.atan2(Y, X)
    Hyp = Math.sqrt(X * X + Y * Y)
    Lat = Math.atan2(Z, Hyp)
    Lat = Lat * 180 / Math.PI
    Lon = Lon * 180 / Math.PI*/

    return {
        Center: [X, Y],
        Rectangle: [
            [minX, minY],
            [minX, maxY],
            [maxX, maxY],
            [maxX, minY],
        ]
    };
}

function getZoomOfMap(coords) {
    var zoom = 14;

    var max = 0;
    $.each(coords, function (k, v) {
        $.each(v, function (k1, v1) {
            $.each(v, function (k2, v2) {
                var distance = ymaps.coordSystem.geo.getDistance(v2, v1);
                if (distance > max)
                    max = distance;
            });
        });
    });
    if (max > 250 && max < 600)
        zoom = 13;
    else if (max < 5000)
        zoom = 12;
    else if (max < 10000)
        zoom = 11;
    else if (max < 25000)
        zoom = 10;
    else if (max < 50000)
        zoom = 9;
    else if (max < 100000)
        zoom = 8;
    else if (max < 250000)
        zoom = 7;
    else if (max < 500000)
        zoom = 6;
    else if (max < 1000000)
        zoom = 5;
    else if (max < 3000000)
        zoom = 4;
    else
        zoom = 3;

    return zoom;
}

function addControlsToMap(map) {
    var rulerControl = new ymaps.control.RulerControl({
        options: {
            layout: 'round#rulerLayout',
            float: 'none',
            position: {
                top: '20px',
                right: '10px'
            }
        }
    });
    map.controls.add(rulerControl);

    var zoomControl = new ymaps.control.ZoomControl({
        options: {
            layout: 'round#zoomLayout',
            float: 'none',
            position: {
                top: '83px',
                right: '10px'
            }
        }
    });
    map.controls.add(zoomControl);

    var typeSelector = new ymaps.control.TypeSelector({
        options: {
            layout: 'round#listBoxLayout',
            itemLayout: 'round#listBoxItemLayout',
            itemSelectableLayout: 'round#listBoxItemSelectableLayout',
            float: 'none',
            position: {
                top: '186px',
                right: '10px'
            }
        }
    });
    map.controls.add(typeSelector);
}

$(document).ready(function () {
    // TOOLTIP EXAMPLE
    if ($('.simple-html-tooltip').length) {
        $('.simple-html-tooltip').tooltipster({
            trigger: 'hover',
            onlyOne: true,
            touchDevices: true,
            maxWidth: $(window).width() / 2,
            repositionOnScroll: true,
            touchDevices: true,
            contentAsHTML: true,
            interactive: true,
            position: "right",

            functionInit: function (instance, helper) {
                var content = $('#' + $(helper.origin).attr('tooltip-content-id')).html();
                instance.content(content);
            },
        });
    }

    $.ajaxSetup({
        statusCode: {
            401: function (err) {
                window.location.href = "/Account/Login";
            },
            403: function (err) {
                window.location.href = "/Error/Forbidden";
            }
        }
    });

    /*$(".add-to-liked").click(function (e) {
        $(e.target).blur();
        $(e.target).closest('button').toggleClass('added');
        return false;
    });*/
});

