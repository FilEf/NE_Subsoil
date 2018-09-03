var coordinatesVM = {
    coordinates: [],
    currentPolygonId: 0,
    currentContourId: 0,
    polygonIds: [],
    contourIds: [],

    //Helpers
    getPolygonIsSelected: function (data) {
        return this.get('currentPolygonId') == data.Id && this.get('currentContourId') > 0;
    },
    getPolygonIsActive: function (data) {
        return this.get('currentPolygonId') == data.Id && this.get('currentContourId') == 0;
    },
    getContourIsActive: function(data){
        return this.get('currentContourId') == data.Id;
    },
    getVisibleCoordinatesTable: function(){
        return this.get('currentPolygonId') != 0 || this.get('currentContourId') != 0;
    },

    initCoordinates: function () {
        var that = this;
        $("#subsurface-coordinates-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        options.success([]);
                    },
                    parameterMap: function (data, operation) {
                        return JSON.stringify(data);
                    },
                },
                schema: {
                    errors: function (response) {
                        return response.Error;
                    },
                    model: {
                        id: "Id",
                        fields: {
                            NLDegree: {
                                type: "number",
                                defaultValue: null,
                                editable: true,
                                validation: { required: { message: "Поле 'Ш, гр.' является обязательным." } }
                            },
                            NLMinute: {
                                type: "number",
                                editable: true,
                                defaultValue: null,
                                validation: { required: { message: "Поле 'Ш, мин.' является обязательным." } }
                            },
                            NLSecond: {
                                type: "number",
                                editable: true,
                                defaultValue: null,
                                validation: { required: { message: "Поле 'Ш, сек.' является обязательным." } }
                            },
                            ELDegree: {
                                type: "number",
                                editable: true,
                                defaultValue: null,
                                validation: { required: { message: "Поле 'Д, гр.' является обязательным." } }
                            },
                            ELMinute: {
                                type: "number",
                                editable: true,
                                defaultValue: null,
                                validation: { required: { message: "Поле 'Д, мин.' является обязательным." } }
                            },
                            ELSecond: {
                                type: "number",
                                editable: true,
                                defaultValue: null,
                                validation: { required: { message: "Поле 'Д, сек.' является обязательным." } }
                            }
                        }
                    }
                },
                // sort: { field: "Name", dir: "asc" },
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
            }),
            // определяем колонки грида
            columns: [
                {
                    command: [
                            {
                                name: 'Delete',
                                text: '<i class="fa fa-trash-o"></i>',
                                click: function (e) {
                                    var tr = $(e.target).closest("tr");
                                    var data = this.dataItem(tr);
                                    if (confirm("Вы действительно хотите удалить координаты точки?")) {
                                        this.dataSource.remove(data);
                                    }
                                    return false;
                                },
                            }
                    ],
                    title: "",
                    width: 50
                },
                {
                    field: "NLDegree",
                    title: "Ш, гр.",
                },
                {
                    field: "NLMinute",
                    title: "Ш, мин.",
                },
                {
                    field: "NLSecond",
                    title: "Ш, сек.",
                },
                {
                    field: "ELDegree",
                    title: "Д, гр.",
                },
                {
                    field: "ELMinute",
                    title: "Д, мин.",
                },
                {
                    field: "ELSecond",
                    title: "Д, сек.",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
    },
    setCoordinates: function (coords) {
        var items = [];
        $.each(coords, function (k, v) {
            var item = {
                Id: k + 1,
                Polygons: []
            };
            $.each(v, function (k1, v1) {
                item.Polygons.push({
                    Id: k1,
                    Coords: v1
                });
            });
            items.push(item);
        });
        this.set('coordinates', items);
        this.updatePolygonAndContourIdsAndGrid();
    },
    getCoordinates: function(){
        var coordinates = this.get('coordinates');
        var result = [];
        $.each(coordinates, function (k, v) {
            var item = [];
            $.each(v.Polygons, function (k1, v1) {
                var items = [];
                $.each(v1.Coords, function (k2, v2) {
                    if (typeof (v2.NLDegree) != 'undefined' && typeof (v2.NLMinute) != 'undefined' && typeof (v2.NLSecond) != 'undefined'
                        && typeof (v2.ELDegree) != 'undefined' && typeof (v2.ELMinute) != 'undefined' && typeof (v2.ELSecond) != 'undefined') {
                        if(!v2.Id)
                            v2.Id = 0;
                        items.push(v2);
                     }
                });
                item.push(items);
            });
            result.push(item);
        });
        return result;
    },

    //Events
    updatePolygonAndContourIdsAndGrid: function () {
        var coordinates = this.get('coordinates');
        var newPolygonIds = [];
        var newContourIds = [];
        var currentPolygonId = this.get('currentPolygonId');
        var currentContourId = this.get('currentContourId');
        if (coordinates.length > 0) {
            if (currentPolygonId == 0) {
                currentPolygonId = coordinates[0].Id;
            }
        }
        var gridItems = [];
        $.each(coordinates, function (k, v) {
            newPolygonIds.push({
                Id: v.Id,
                Name: v.Id
            });
            
            if (currentPolygonId == v.Id) {
                $.each(v.Polygons, function (k1, v1) {
                    if (v1.Id != 0) {
                        newContourIds.push({
                            Id: v1.Id,
                            Name: v1.Id
                        })
                    }
                    if (currentContourId == v1.Id) {
                        gridItems = v1.Coords;
                    }

                });
            }
        });
        this.set('polygonIds', newPolygonIds);
        this.set('contourIds', newContourIds);
        this.set('currentPolygonId', currentPolygonId);
        this.set('currentContourId', currentContourId);
        $("#subsurface-coordinates-grid").data("kendoGrid").dataSource.data(gridItems);
    },
    addNewPolygon: function () {
        var coordinates = this.get('coordinates');
        var newItem = {
            Id: 1,
            Polygons: [
                {
                    Id: 0,
                    Coords: []
                }
            ]
        };
        if (coordinates.length) {
            newItem.Id = coordinates[coordinates.length - 1].Id + 1;
        }
        coordinates.push(newItem);
        this.set('coordinates', coordinates);
        this.set('currentPolygonId', newItem.Id);
        this.set('currentContourId', 0);
        this.updatePolygonAndContourIdsAndGrid();
        return false;
    },
    selectPolygon: function (e) {
        if (this.get('currentPolygonId') != e.data.Id || (this.get('currentContourId') != 0 && this.get('currentPolygonId') == e.data.Id)) {
            this.set('currentPolygonId', e.data.Id);
            this.set('currentContourId', 0);
            this.updatePolygonAndContourIdsAndGrid();
        }
    },
    removeThisPolygon: function (e) {
        var coordinates = this.get('coordinates');
        if (confirm("Вы действительно хотите удалить контур?")){
            coordinates = coordinates.filter(function (i) {
                return i.Id != e.data.Id;
            });
            if (this.get('currentPolygonId') == e.data.Id) {
                if (coordinates.length) {
                    this.set('currentPolygonId', coordinates[0].Id);
                } else {
                    this.set('currentPolygonId', 0);
                }
                this.set('currentContourId', 0);
            }
            this.set('coordinates', coordinates);
            this.updatePolygonAndContourIdsAndGrid();
        }
    },
    addNewContour: function () {
        var that = this;
        var coordinates = this.get('coordinates');
        var currentPolygonId = this.get('currentPolygonId');
        $.each(coordinates, function (k, v) {
            if (v.Id == currentPolygonId) {
                var newItem = {
                    Id: 1,
                    Coords: []
                };
                if (v.Polygons.length) {
                    newItem.Id = v.Polygons[v.Polygons.length - 1].Id + 1;
                }
                coordinates[k].Polygons.push(newItem);
                that.set('currentContourId', newItem.Id);
                that.updatePolygonAndContourIdsAndGrid();
            }
        });
        return false;
    },
    selectContour: function (e) {
        if (this.get('currentContourId') != e.data.Id) {
            this.set('currentContourId', e.data.Id);
            this.updatePolygonAndContourIdsAndGrid();
        }
    },
    removeThisContour: function (e) {
        var coordinates = this.get('coordinates');
        currentPolygonId = this.get('currentPolygonId');
        if (confirm("Вы действительно хотите удалить внутренний контур?")) {
            $.each(coordinates, function (k, v) {
                if (v.Id == currentPolygonId) {
                    coordinates[k].Polygons = coordinates[k].Polygons.filter(function (i) {
                        return i.Id != e.data.Id;
                    })
                }
            })
            if (this.get('currentContourId') == e.data.Id) {
                this.set('currentContourId', 0);
            }
            this.set('coordinates', coordinates);
            this.updatePolygonAndContourIdsAndGrid();
        }
    },
}