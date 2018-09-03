var editVM = {
    subsurface: {
        Id: 0,
        Subjects: [],
        MineralsList: [],
        ConcerningSubsurfaces: []
    },
    errors: [],
    //Visible
    getVisibleGeology: function () {
        return $(".menu-block .menu a[data-id='geology-subsurface']").hasClass("active");
    },
    getVisibleSolidMinerals: function () {
        var subsurface = this.get('subsurface');
        return (!!subsurface && subsurface.CategoryId == editVars.consts.SolidMinerals && this.getVisibleGeology());
    },
    getVisibleSolidMineralsOrNull: function () {
        var subsurface = this.get('subsurface');
        return (!!subsurface && (subsurface.CategoryId == null || subsurface.CategoryId == 0 || subsurface.CategoryId == editVars.consts.SolidMinerals) && this.getVisibleGeology());
    },
    getVisibleHydrocarbonMinerals: function () {
        var subsurface = this.get('subsurface');
        return (!!subsurface && subsurface.CategoryId == editVars.consts.HydrocarbonMinerals && this.getVisibleGeology());
    },
    getVisibleNotHydrocarbonMinerals: function () {
        var subsurface = this.get('subsurface');
        return (!!subsurface && subsurface.CategoryId != editVars.consts.HydrocarbonMinerals && this.getVisibleGeology());
    },
    getVisibleNotWaterMinerals: function () {
        var subsurface = this.get('subsurface');
        return (!!subsurface && subsurface.CategoryId != editVars.consts.WaterMinerals && this.getVisibleGeology());
    },
    getVisibleWaterMinerals: function () {
        var subsurface = this.get('subsurface');
        return (!!subsurface && subsurface.CategoryId == editVars.consts.WaterMinerals && this.getVisibleGeology());
    },
    //Helpers
    getFirstEconomicDistrictDevelopments: function () {
        var result = "";
        var subsurface = this.get('subsurface');
        if (!!subsurface && !!subsurface.EconomicDistrictDevelopments && subsurface.EconomicDistrictDevelopments.length > 0)
            result = subsurface.EconomicDistrictDevelopments[0].Degree;
        return result;
    },

    init: function () {
        var that = this;
        that.initCoordinates();
        var url = globalVars.consts.AbsoluteUri + "/api/subsurface/get_empty";
        if (subsurfaceId > 0) {
            url = globalVars.consts.AbsoluteUri + "/api/subsurface/get_subsurface/" + subsurfaceId;
        }

        var updateElement = function (formationId, update) {
            var result = null;
            if (formationId > 2) {
                $("#formation_quarter").closest(".k-widget").hide();
                $("#formation_year").closest(".k-widget").hide();
                $("#formation_day").closest(".k-widget").show();
                if (!!$("#formation_year").data("kendoDropDownList") && !!$("#formation_year").data("kendoDropDownList").value()
                    && !!$("#formation_quarter").data("kendoDropDownList") && !!$("#formation_quarter").data("kendoDropDownList").value()) {
                    result = new Date($("#formation_year").data("kendoDropDownList").value(), $("#formation_quarter").data("kendoDropDownList").value() * 3 - 1, 1);
                    if (!!update)
                        $("#formation_day").data("kendoDatePicker").value(result);
                } else if (!!update) {
                    $("#formation_day").data("kendoDatePicker").value(null);
                }
            } else {
                $("#formation_quarter").closest(".k-widget").show();
                $("#formation_year").closest(".k-widget").show();
                $("#formation_day").closest(".k-widget").hide();
                var quarter = null, year = null;
                if (!!$("#formation_day").data("kendoDatePicker").value()) {
                    result = $("#formation_day").data("kendoDatePicker").value();
                    quarter = moment(result).isValid() ? Math.ceil((moment(result).get('month') + 1) / 3) : null;
                    year = moment(result).isValid() ? moment(result).get('year') : null;
                }
                if (!!update) {
                    $("#formation_quarter").data("kendoDropDownList").value(quarter);
                    $("#formation_year").data("kendoDropDownList").value(year);
                }
            }
            return result;
        }

        $.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            success: function (result) {
                // console.log(result, 'result');
                if (!!result) {
                    result.Subjects = [];
                    if (!!result.SubjectRF) {
                        $.each(result.SubjectRF, function (k, v) {
                            result.Subjects.push({ Id: v.SubjectId, Name: v.Name });
                        });
                    }
                    result.MineralsList = [];
                    if (!!result.Minerals) {
                        $.each(result.Minerals, function (k, v) {
                            result.MineralsList.push({ Id: v.MineralId, Name: v.Name });
                        });
                    } else {
                        result.Minerals = [];
                    }

                    if (!!result.Square)
                        result.Square = parseFloat(result.Square.replace(",", "."));




                    that.set('subsurface', result);
                    //About
                    $("#subsurface-linked-places-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-points-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-docs-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-water-areas-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-planned-to-using-grid").data("kendoGrid").dataSource.read();
                    //Works
                    $("#subsurface-stages-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-developing-stages-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-studyings-grid").data("kendoGrid").dataSource.read();
                    //Geology
                    $("#subsurface-industrial-regions-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-industrial-mineral-bodies-2-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-industrial-mineral-bodies-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-main-minerals-stock-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-passing-minerals-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-ore-stock-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-oils-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-condensates-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-attenuated-gases-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-free-gases-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-condition-items-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-development-factors-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-raw-consumers-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-brines-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-solids-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-chemists-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-commons-stock-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-before-stock-grid").data("kendoGrid").dataSource.read();
                    $("#subsurface-after-stock-grid").data("kendoGrid").dataSource.read();

                    if (!!result.Coordinates)
                        that.setCoordinates(result.Coordinates);
                }
            }
        });

        //About Grids
        $("#subsurface-linked-places-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface.ConcerningSubsurfaces && subsurface.ConcerningSubsurfaces.length > 0) {
                            $.each(subsurface.ConcerningSubsurfaces, function (k, v) {
                                v.RelationId = v.RelationDirect + "_" + v.SubsurfaceRelationId;
                                items.push($.extend({}, v));
                            });
                        }
                        options.success(items);
                    },
                    parameterMap: function (data, operation) {
                        return JSON.stringify(data);
                    },
                },
                schema: {
                    model: {
                        id: "Id",
                        fields: {
                            Name: {
                                editable: false
                            },
                            SubsurfaceRelationId:
                            {
                                editable: true,
                                validation: { required: { message: "Поле 'Тип связи' является обязательным." } }
                            },
                            InformationId: {
                                defaultValue: 0
                            }
                        }
                    },
                    errors: function (response) {
                        return response.Error;
                    },
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
                                if (confirm("Вы действительно хотите удалить  '" + data.Name + "' ?")) {
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
                    field: "Name",
                    title: "Участок",
                },
                {
                    field: "SubsurfaceRelationName",
                    title: "Тип связи",
                    editor: function (container, options) {
                        var url = globalVars.consts.AbsoluteUri + "/api/subsurface/get_relations"
                        if (options.model["RelationDirect"] == 1) {
                            url = globalVars.consts.AbsoluteUri + "/api/subsurface/get_reverse_relations"
                        }
                        url = globalVars.consts.AbsoluteUri + "/api/subsurface/get_full_relations";
                        var dropDown = $('<input data-text-field="Text" data-value-field="Value" data-value-primitive="true"/>').appendTo(container).kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                transport: {
                                    read: {
                                        url: url,
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
                            }),
                            dataValueField: "Value",
                            dataTextField: "Text",
                            autobind: true,
                            change: function (e) {
                                options.model["SubsurfaceRelationId"] = dropDown.value();
                                options.model["SubsurfaceRelationName"] = dropDown.text();
                            },
                            dataBound: function () {
                                if (!options.model["SubsurfaceRelationId"]) {
                                    options.model["SubsurfaceRelationId"] = this.value();
                                    options.model["SubsurfaceRelationName"] = this.text();
                                } else {
                                    this.value(options.model["SubsurfaceRelationId"]);
                                }
                            }
                        }).data("kendoDropDownList");
                    }
                }
            ],
            toolbar: kendo.template($("#subsurface-linked-places-grid-toolbar").html()),
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-docs-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface.GeoDocs && subsurface.GeoDocs.length > 0) {
                            $.each(subsurface.GeoDocs, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
                    },
                    parameterMap: function (data, operation) {
                        return JSON.stringify(data);
                    },
                },
                schema: {
                    errors: function (response) {
                        return response.Error;
                    },
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
                                var grid = this;
                                if (confirm("Вы действительно хотите удалить  '" + data.Name + "' ?")) {
                                    var subsurface = that.get('subsurface');
                                    subsurface.GeoDocs = grid.dataSource.data().filter(function (i) {
                                        return i.GeoDocumentId != data.GeoDocumentId;
                                    });
                                    that.set('subsurface', subsurface);
                                    grid.dataSource.read();
                                }
                                return false;
                            },
                        }
                    ],
                    title: "",
                    width: 50
                },
                {
                    field: "Name",
                    title: "Документ",
                }
            ],
            toolbar: kendo.template($("#subsurface-docs-grid-toolbar").html()),
            resizable: false,
            //reorderable: true,
            pageable: false,
            sortable: false
        });
        $("#subsurface-points-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface.Points && subsurface.Points.length > 0) {
                            that.directionDropDataSource.fetch(function () {
                                $.each(subsurface.Points, function (k, v) {
                                    $.each(that.directionDropDataSource.data(), function (k1, v1) {
                                        if (v1.Value == v.Direction) {
                                            v.DirectionName = v1.Text;
                                        }
                                    });
                                    items.push(v);
                                });
                                options.success(items);
                            });
                        }
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
                            Name: {
                                editable: true
                            },
                            Type: {
                                editable: true
                            },
                            Direction: {
                                editable: true
                            },
                            Distance: {
                                type: "number",
                                defaultValue: null,
                                editable: true
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
                                if (confirm("Вы действительно хотите удалить " + data.Type + " '" + data.Name + "' ?")) {
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
                    field: "Name",
                    title: "Название",
                },
                {
                    field: "Type",
                    title: "Тип",
                },
                {
                    field: "Distance",
                    title: "Расстояние (км)",
                },
                {
                    field: "DirectionName",
                    title: "Направление",
                    editor: function (container, options) {
                        var dropDown = $('<input data-text-field="Text" data-value-field="Value" />').appendTo(container).kendoDropDownList({
                            dataSource: that.directionDropDataSource,
                            dataValueField: "Value",
                            dataTextField: "Text",
                            optionLabel: {
                                Text: "",
                                Value: null
                            },
                            autobind: true,
                            change: function (e) {
                                options.model["Direction"] = dropDown.value();
                                options.model["DirectionName"] = dropDown.text();
                            },
                            dataBound: function () {
                                if (!options.model["Direction"]) {
                                    options.model["Direction"] = this.value();
                                    options.model["DirectionName"] = this.text();
                                } else {
                                    this.value(options.model["Direction"]);
                                }
                            }
                        }).data("kendoDropDownList");
                    }
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false,
            change: function (e) {
            }
        });
        $("#subsurface-water-areas-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface.WaterAreas && subsurface.WaterAreas.length > 0) {
                            $.each(subsurface.WaterAreas, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Name: {
                                editable: true
                            },
                            Distance: {
                                type: "number",
                                editable: true,
                                defaultValue: null
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
                                if (confirm("Вы действительно хотите удалить '" + data.Name + "' ?")) {
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
                    field: "Name",
                    title: "Название",
                },
                {
                    field: "Distance",
                    title: "Расстояние (км)",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-planned-to-using-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                sort: { field: "PublishDate", dir: "desc" },
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface.FutureUsabilities && subsurface.FutureUsabilities.length > 0) {
                            var number = 1;
                            $.each(subsurface.FutureUsabilities, function (k, v) {
                                v.number = number++;
                                if (typeof (v.DocId) == 'undefined')
                                    v.DocId = null;
                                if (!v.DocId)
                                    if (!!v.GeoDocs && v.GeoDocs.length > 0)
                                        v.DocId = v.GeoDocs[0].GeoDocumentId;
                                items.push(v);
                            });
                        }
                        options.success(items);
                    },
                    create: function (options) {
                        var subsurface = $.extend({}, that.get('subsurface'));
                        if (!subsurface.FutureUsabilities) {
                            subsurface.FutureUsabilities = []
                        }
                        if (!options.data.number)
                            subsurface.FutureUsabilities.push(options.data);
                        else {
                            $.each(subsurface.FutureUsabilities, function (k, v) {
                                if (options.data.number == v.number)
                                    subsurface.FutureUsabilities[k] = options.data;
                            });
                        }
                        that.set('subsurface', subsurface);
                        $("#subsurface-planned-to-using-grid").data("kendoGrid").dataSource.read();
                        return false;
                    },
                    update: function (options) {
                        var subsurface = $.extend({}, that.get('subsurface'));
                        if (!subsurface.FutureUsabilities) {
                            subsurface.FutureUsabilities = []
                        }
                        if (!options.data.number)
                            subsurface.FutureUsabilities.push(options.data);
                        else {
                            $.each(subsurface.FutureUsabilities, function (k, v) {
                                if (options.data.number == v.number)
                                    subsurface.FutureUsabilities[k] = options.data;
                            });
                        }
                        that.set('subsurface', subsurface);
                        $("#subsurface-planned-to-using-grid").data("kendoGrid").dataSource.read();
                        return false;
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
                            Id: {
                                editable: false,
                                nullable: true,
                                defaultValue: 0
                            },
                            PublishDate: {
                                type: "date",
                                editable: true,
                                validation: { required: { message: "Заполните поле 'Дата публикации на официальном сайте'" } },
                            },
                            DeadLine: {
                                type: "date",
                                editable: true,
                                nullable: false,
                                validation: {
                                    required: true,
                                    customDeadLine: function (input) {
                                        if (input.attr("id") == "formation_day" && (($("#formation_type").data("kendoDropDownList").value() > 2 && !$("#formation_day").data("kendoDatePicker").value())
                                            || ($("#formation_type").data("kendoDropDownList").value() < 3 && (!$("#formation_quarter").data("kendoDropDownList").value() || !$("#formation_year").data("kendoDropDownList").value())))) {
                                            input.closest("div").append('<div class="validation k-widget k-tooltip k-tooltip-validation k-invalid-msg" style="margin: 0.5em; display: block;" data-for="DocumentNumber" role="alert"><span class="k-icon k-warning"> </span>Заполните поле \'Планируемые сроки предоставления\'<div class="k-callout k-callout-n"></div></div>');
                                            return false;
                                        }
                                        return true;
                                    }
                                }
                            },
                            DocumentNumber: {
                                type: "string",
                                editable: true,
                                validation: { required: { message: "Заполните поле 'Номер документа утверждения перечня'" } },
                            },
                            DocumentDate: {
                                type: "date",
                                editable: true,
                                defaultValue: null
                            }
                        }
                    }
                },
                // sort: { field: "Name", dir: "asc" },
                serverPaging: true,
                serverSorting: false,
                serverFiltering: true,
            }),
            // определяем колонки грида
            columns: [
                {
                    command: [
                        {
                            name: "edit",
                            text: { edit: '<i class="fa fa-pencil"></i>', update: 'Сохранить', cancel: 'Отмена' },
                            title: "Редактировать",
                        },
                        {
                            name: 'Delete',
                            text: '<i class="fa fa-trash-o"></i>',
                            click: function (e) {
                                var tr = $(e.target).closest("tr");
                                var data = this.dataItem(tr);
                                if (confirm("Вы действительно хотите удалить '" + data.DocumentNumber + "' ?")) {
                                    this.dataSource.remove(data);

                                    var subsurface = $.extend({}, that.get('subsurface'));
                                    subsurface.FutureUsabilities = $.merge([], this.dataSource.data());
                                    that.set('subsurface', subsurface);
                                    $("#subsurface-planned-to-using-grid").data("kendoGrid").dataSource.read();
                                }
                                return false;
                            },
                        }
                    ],
                    title: "",
                    width: 80
                },
                {
                    field: "PublishDate",
                    title: "Дата публикации на официальном сайте",
                    template: function (model) {
                        var result = "";
                        if (moment(model.PublishDate).isValid())
                            result = moment(model.PublishDate).format("DD.MM.YYYY");
                        return result;
                    },
                    editor: function (container, options) {
                        var now = new Date();
                        var datePickerYear = $('<input id="publish_date" />').appendTo(container).kendoDatePicker({
                            format: "dd.MM.yyyy",
                            dateInput: false,
                            value: moment(options.model["PublishDate"]).format("DD.MM.YYYY"),
                            change: function (e) {
                                options.model["PublishDate"] = e.sender.value();
                                if (!!$("#formation_day").data("kendoDatePicker")) {
                                    var publishDate = moment(e.sender.value());
                                    var max = moment(e.sender.value()).add(30, 'days');
                                    $("#formation_day").data("kendoDatePicker").min(publishDate.format("DD.MM.YYYY"));
                                    $("#formation_day").data("kendoDatePicker").max(max.format("DD.MM.YYYY"));
                                    var diff = publishDate.diff(moment($("#formation_day").data("kendoDatePicker").value()), 'days');
                                    if (diff > 0)
                                        $("#formation_day").data("kendoDatePicker").value(publishDate.format("DD.MM.YYYY"));
                                    else if (max.diff(moment($("#formation_day").data("kendoDatePicker").value()), 'days') < 0)
                                        $("#formation_day").data("kendoDatePicker").value(max.format("DD.MM.YYYY"));
                                }
                            }
                        }).data("kendoDatePicker");
                    }
                },
                {
                    field: "ApprovedOrganization",
                    title: "Орган, утвердивший перечень",
                    editor: function (container, options) {
                        var dropDown = $('<input data-text-field="Text" data-value-field="Value" data-value-primitive="true"/>').appendTo(container).kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                data: [{
                                    Value: 1,
                                    Text: "Минприроды РФ"
                                }, {
                                    Value: 2,
                                    Text: "Роснедра"
                                }],
                                schema: {
                                    errors: function (response) {
                                        return response.Error;
                                    }
                                },
                                error: function (error) {
                                    console.log(error.responseJSON);
                                },
                            }),
                            dataValueField: "Value",
                            dataTextField: "Text",
                            optionLabel: {
                                Text: "",
                                Value: null
                            },
                            autobind: true,
                            change: function (e) {
                                options.model["ApprovedOrganizationId"] = dropDown.value();
                                options.model["ApprovedOrganization"] = dropDown.text();
                            },
                            dataBound: function (e) {
                                if (!!options.model["ApprovedOrganization"]) {
                                    $.each(this.dataSource.data(), function (k, v) {
                                        if (v.Text == options.model["ApprovedOrganization"]) {
                                            options.model["ApprovedOrganizationId"] = v.Value;
                                            e.sender.value(v.Value);
                                        }
                                    });
                                } else {
                                    if (!options.model["ApprovedOrganizationId"]) {
                                        options.model["ApprovedOrganizationId"] = e.sender.value();
                                        options.model["ApprovedOrganization"] = e.sender.text();
                                    } else {
                                        e.sender.value(options.model["ApprovedOrganizationId"]);
                                    }
                                }
                            }
                        }).data("kendoDropDownList");
                    }
                },
                {
                    field: "ApprovedMember",
                    title: "Лицо, утвердившее перечень",
                },
                {
                    field: "DocumentNumber",
                    title: "Номер документа утверждения перечня",
                },
                {
                    field: "DocumentDate",
                    title: "Дата документа утверждения перечня",
                    template: function (model) {
                        if (!!model.DocumentDate)
                            return moment(model.DocumentDate).format("DD.MM.YYYY");
                        else
                            return "";
                    }
                },
                {
                    field: "Form",
                    title: "Форма предоставления участка недр в пользование",
                    editor: function (container, options) {
                        var dropDown = $('<input id="formation_type" data-text-field="Text" data-value-field="Value" data-value-primitive="true"/>').appendTo(container).kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                data: globalVars.datas.FormsData,
                                schema: {
                                    errors: function (response) {
                                        return response.Error;
                                    }
                                },
                                error: function (error) {
                                    console.log(error.responseJSON);
                                },
                            }),
                            dataValueField: "Value",
                            dataTextField: "Text",
                            autobind: true,
                            change: function (e) {
                                options.model["FormationId"] = dropDown.value();
                                options.model["Form"] = dropDown.text();
                                options.model["DeadLine"] = updateElement(options.model["FormationId"], true);
                            },
                            dataBound: function (e) {
                                if (!!options.model["Form"]) {
                                    $.each(e.sender.dataSource.data(), function (k, v) {
                                        if (v.Text == options.model["Form"]) {
                                            options.model["FormationId"] = v.Value;
                                            e.sender.value(v.Value);
                                        }
                                    });
                                } else if (!options.model["FormationId"]) {
                                    options.model["FormationId"] = e.sender.value();
                                    options.model["Form"] = e.sender.text();
                                } else {
                                    e.sender.value(options.model["FormationId"]);
                                }
                            }
                        }).data("kendoDropDownList");
                    }
                },
                {
                    field: "DeadLine",
                    title: "Планируемые сроки предоставления",
                    template: function (model) {
                        var result = "";
                        if (!!model.DeadLine) {
                            if (model.FormationId > 2) {
                                result = moment(model.DeadLine).format("DD.MM.YYYY");
                            } else {
                                switch (Math.ceil((moment(model.DeadLine).get('month') + 1) / 3)) {
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

                                result += " квартал" + moment(model.DeadLine).get('year') + " года";
                            }
                        }
                        return result;
                    },
                    editor: function (container, options) {
                        var now = moment(options.model["PublishDate"]).toDate();
                        var datePickerYear = $('<input id="formation_day" />').appendTo(container).kendoDatePicker({
                            min: now,
                            max: moment(now).add(30, 'days').toDate(),
                            format: "dd.MM.yyyy",
                            dateInput: false,
                            value: moment(options.model["DeadLine"]).format("DD.MM.YYYY"),
                            change: function (e) {
                                options.model["DeadLine"] = e.sender.value();
                            }
                        }).data("kendoDatePicker");

                        var quarter = moment(options.model["DeadLine"]).isValid() ? Math.ceil((moment(options.model["DeadLine"]).get('month') + 1) / 3) : null;
                        console.log(quarter, "quarter");
                        var dropDownQuarter = $('<input id="formation_quarter" data-text-field="Text" data-value-field="Value" data-value-primitive="true"/>').appendTo(container).kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                data: [{
                                    Value: 1,
                                    Text: "I квартал"
                                }, {
                                    Value: 2,
                                    Text: "II квартал"
                                }, {
                                    Value: 3,
                                    Text: "III квартал"
                                }, {
                                    Value: 4,
                                    Text: "IV квартал"
                                }],
                                schema: {
                                    errors: function (response) {
                                        return response.Error;
                                    }
                                },
                                error: function (error) {
                                    console.log(error.responseJSON);
                                },
                            }),
                            dataValueField: "Value",
                            dataTextField: "Text",
                            autobind: true,
                            optionLabel: {
                                Text: "",
                                Value: null
                            },
                            value: quarter,
                            change: function (e) {
                                if (!!e.sender.value() && !!$("#formation_year").data("kendoDropDownList").value())
                                    options.model["DeadLine"] = new Date($("#formation_year").data("kendoDropDownList").value(), e.sender.value() * 3 - 1, 1);
                                else
                                    options.model["DeadLine"] = null;
                            },
                            dataBound: function (e) {
                                //e.sender.value(quarter);
                            }
                        }).data("kendoDropDownList");
                        var years = [];
                        for (var i = 2002; i <= 2025; i++) {
                            years.push({
                                Value: i,
                                Text: i
                            });
                        };
                        var year = moment(options.model["DeadLine"]).isValid() ? moment(options.model["DeadLine"]).get('year') : null;
                        var dropDownYear = $('<input id="formation_year" data-text-field="Text" data-value-field="Value" data-value-primitive="true"/>').appendTo(container).kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                data: years,
                                schema: {
                                    errors: function (response) {
                                        return response.Error;
                                    }
                                },
                                error: function (error) {
                                    console.log(error.responseJSON);
                                },
                            }),
                            dataValueField: "Value",
                            dataTextField: "Text",
                            autobind: true,
                            optionLabel: {
                                Text: "",
                                Value: null
                            },
                            value: year,
                            change: function (e) {
                                if (!!e.sender.value() && !!e.sender.value() && !!$("#formation_quarter").data("kendoDropDownList").value())
                                    options.model["DeadLine"] = new Date(e.sender.value(), $("#formation_quarter").data("kendoDropDownList").value() * 3 - 1, 1);
                                else
                                    options.model["DeadLine"] = null;
                            },
                            dataBound: function (e) {
                                e.sender.value(moment(options.model["DeadLine"]).get('year'));
                                updateElement(options.model["FormationId"], false);
                            }
                        }).data("kendoDropDownList");
                    }
                },
                {
                    field: "Organization",
                    title: "Орган, осуществляющий предоставление участка недр в пользование",
                },
                {
                    field: "Mail",
                    title: "Письмо уполномоченного органа о наличии (отсутствии) ООПТ на участке недр (номер, дата)"
                },
                {
                    field: "UsingTypeName",
                    title: "Вид пользования недрами",
                    editor: function (container, options) {
                        var dropDown = $('<input data-text-field="ShotName" data-value-field="Value" data-value-primitive="true"/>').appendTo(container).kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                transport: {
                                    read: {
                                        url: globalVars.consts.AbsoluteUri + "/api/subsurface/using_types",
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
                            }),
                            dataValueField: "Value",
                            dataTextField: "ShotName",
                            autobind: true,
                            change: function (e) {
                                options.model["UsingTypeId"] = dropDown.value();
                                options.model["UsingTypeName"] = dropDown.text();
                            },
                            dataBound: function (e) {
                                if (!options.model["UsingTypeName"]) {
                                    options.model["UsingTypeId"] = e.sender.value();
                                    options.model["UsingTypeName"] = e.sender.text();
                                } else {
                                    e.sender.value(options.model["UsingTypeId"]);
                                }
                            }
                        }).data("kendoDropDownList");
                    }
                },
                {
                    field: "Id",
                    title: "id",
                    editable: false
                },
                {
                    field: "List",
                    title: "Перечень",
                    editor: function (container, options) {
                        if (!!options.model["GeoDocs"] && options.model["GeoDocs"].length > 0) {
                            options.model["DocId"] = options.model["GeoDocs"][0].GeoDocumentId;
                        }
                        $($("#planned-to-using-list-template").html()).appendTo(container);
                        setTimeout(function () {
                            var listVM = {
                                isError: false,
                                errorText: "",
                                selectedDocId: options.model["DocId"],
                                docId: options.model["DocId"],
                                getVisibleAddDoc: function () {
                                    return !this.get('selectedDocId');
                                },
                                addDoc: function () {
                                    var that = this;
                                    that.set('isError', false);
                                    var docId = that.get('docId');
                                    if (!!docId) {
                                        $.ajax({
                                            url: globalVars.consts.AbsoluteUri + "/api/subsurface/check_document/" + docId,
                                            dataType: "json",
                                            type: "GET",
                                            success: function (result) {
                                                if (!!result && result.Success) {
                                                    that.set('selectedDocId', that.get('docId'));
                                                    options.model["DocId"] = that.get('docId');
                                                } else {
                                                    that.set('isError', true);
                                                    that.set('errorText', "Документ не найден");
                                                }
                                            },
                                            error: function () {
                                                that.set('isError', true);
                                                that.set('errorText', "Документ не найден");
                                            }
                                        });
                                    } else {
                                        that.set('isError', true);
                                        that.set('errorText', "Введите id документа");
                                    }
                                },
                                removeDoc: function () {
                                    this.set('isError', false);
                                    this.set('docId', "");
                                    this.set('selectedDocId', null);
                                    options.model["DocId"] = null;
                                }
                            };
                            window.editListVM = kendo.observable(listVM);
                            kendo.bind($("#planned-to-using-list"), window.editListVM);
                        }, 1000);
                    }
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            editable: "popup",
            edit: function (e) {
                e.container.kendoWindow("title", "Планируется предоставление в пользование");
            },
            cancel: function () {
                this.cancelChanges();
            },
            pageable: false,
            sortable: true
        });

        //Works Grids
        $("#subsurface-stages-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.WorkInfo && !!subsurface.WorkInfo.Stages && subsurface.WorkInfo.Stages.length > 0) {
                            $.each(subsurface.WorkInfo.Stages, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Stage: {
                                editable: true
                            },
                            BeginYear: {
                                type: "number",
                                defaultValue: null,
                                editable: true,
                                validation: {
                                    required: false,
                                    beginYearValidation: function (input) {
                                        if (input.is("[name='BeginYear']") && !!input.data("kendoNumericTextBox") && !!input.data("kendoNumericTextBox").value()) {
                                            var val = input.data("kendoNumericTextBox").value();
                                            if (val < 1899)
                                                input.attr("data-beginYearValidation-msg", "Поле 'Год начала' не может быть меньше 1899 года");
                                            if (val > 2199)
                                                input.attr("data-beginYearValidation-msg", "Поле 'Год начала' не может быть больше 2199 года");
                                            return (val >= 1899 && val <= 2199);
                                        }

                                        return true;
                                    }
                                }
                            },
                            EndYear: {
                                type: "number",
                                defaultValue: null,
                                editable: true,
                                validation: {
                                    required: false,
                                    endYearValidation: function (input) {
                                        if (input.is("[name='EndYear']") && !!input.data("kendoNumericTextBox") && !!input.data("kendoNumericTextBox").value()) {
                                            var val = input.data("kendoNumericTextBox").value();
                                            if (val < 1899)
                                                input.attr("data-endYearValidation-msg", "Поле 'Год окончания' не может быть меньше 1899 года");
                                            if (val > 2199)
                                                input.attr("data-endYearValidation-msg", "Поле 'Год окончания' не может быть больше 2199 года");
                                            return (val >= 1899 && val <= 2199);
                                        }

                                        return true;
                                    }
                                }
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
                                if (confirm("Вы действительно хотите удалить '" + data.Stage + "' ?")) {
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
                    field: "Stage",
                    title: "Стадия работ, степень промышленного освоения",
                },
                {
                    field: "BeginYear",
                    title: "Год начала",
                    format: "{0:0000}"
                },
                {
                    field: "EndYear",
                    title: "Год окончания",
                    format: "{0:0000}"
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-developing-stages-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.WorkInfo && !!subsurface.WorkInfo.DevelopingStages && subsurface.WorkInfo.DevelopingStages.length > 0) {
                            $.each(subsurface.WorkInfo.DevelopingStages, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Name: {
                                editable: true
                            },
                            InventYear: {
                                type: "number",
                                defaultValue: null,
                                editable: true,
                                validation: {
                                    required: false,
                                    inventYearValidation: function (input) {
                                        if (input.is("[name='InventYear']") && !!input.data("kendoNumericTextBox") && !!input.data("kendoNumericTextBox").value()) {
                                            var val = input.data("kendoNumericTextBox").value();
                                            if (val < 1899)
                                                input.attr("data-inventYearValidation-msg", "Поле 'Год открытия' не может быть меньше 1899 года");
                                            if (val > new Date().getFullYear())
                                                input.attr("data-inventYearValidation-msg", "Поле 'Год открытия' не может быть больше " + new Date().getFullYear() + " года");
                                            return (val >= 1899 && val <= new Date().getFullYear());
                                        }

                                        return true;
                                    }
                                }
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
                                if (confirm("Вы действительно хотите удалить '" + data.Name + "' ?")) {
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
                    field: "Name",
                    title: "Индекс и (или) название пласта (горизонта, залежи)",
                },
                {
                    field: "InventYear",
                    title: "Год открытия",
                    format: "{0:0000}"
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-studyings-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.WorkInfo && !!subsurface.WorkInfo.Studyings && subsurface.WorkInfo.Studyings.length > 0) {
                            $.each(subsurface.WorkInfo.Studyings, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Stage: {
                                editable: true
                            },
                            BeginYear: {
                                type: "number",
                                defaultValue: null,
                                editable: true,
                                validation: {
                                    required: false,
                                    beginYearValidation: function (input) {
                                        if (input.is("[name='BeginYear']") && !!input.data("kendoNumericTextBox") && !!input.data("kendoNumericTextBox").value()) {
                                            var val = input.data("kendoNumericTextBox").value();
                                            if (val < 1899)
                                                input.attr("data-beginYearValidation-msg", "Поле 'Год начала' не может быть меньше 1899 года");
                                            if (val > 2199)
                                                input.attr("data-beginYearValidation-msg", "Поле 'Год начала' не может быть больше 2199 года");
                                            return (val >= 1899 && val <= 2199);
                                        }

                                        return true;
                                    }
                                }
                            },
                            EndYear: {
                                type: "number",
                                defaultValue: null,
                                editable: true,
                                validation: {
                                    required: false,
                                    endYearValidation: function (input) {
                                        if (input.is("[name='EndYear']") && !!input.data("kendoNumericTextBox") && !!input.data("kendoNumericTextBox").value()) {
                                            var val = input.data("kendoNumericTextBox").value();
                                            if (val < 1899)
                                                input.attr("data-endYearValidation-msg", "Поле 'Год окончания' не может быть меньше 1899 года");
                                            if (val > 2199)
                                                input.attr("data-endYearValidation-msg", "Поле 'Год окончания' не может быть больше 2199 года");
                                            return (val >= 1899 && val <= 2199);
                                        }

                                        return true;
                                    }
                                }
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
                                if (confirm("Вы действительно хотите удалить '" + data.Stage + "' ?")) {
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
                    field: "Stage",
                    title: "Этап",
                },
                {
                    field: "BeginYear",
                    title: "Год начала",
                    format: "{0:0000}"
                },
                {
                    field: "EndYear",
                    title: "Год окончания",
                    format: "{0:0000}"
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });

        //GeologyGrids
        $("#subsurface-industrial-regions-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.GeologyInfo && !!subsurface.GeologyInfo.IndustrialRegions && subsurface.GeologyInfo.IndustrialRegions.length > 0) {
                            $.each(subsurface.GeologyInfo.IndustrialRegions, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Id: {
                                defaultValue: 0
                            },
                            Name: {
                                editable: true
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
                                if (confirm("Вы действительно хотите удалить '" + data.Name + "' ?")) {
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
                    field: "Name",
                    title: "Название промышленного участка",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-industrial-mineral-bodies-2-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.GeologyInfo && !!subsurface.GeologyInfo.IndustrialMineralBodies2
                            && subsurface.GeologyInfo.IndustrialMineralBodies2.length > 0) {
                            $.each(subsurface.GeologyInfo.IndustrialMineralBodies2, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Id: {
                                defaultValue: 0
                            },
                            Name: {
                                editable: true,
                                validation: { required: { message: "Поле 'Название' является обязательным." } }
                            },
                            Amount: {
                                editable: true,
                                validation: { required: { message: "Поле 'Кол-во тел' является обязательным." } }
                            },
                            Shape: {
                                editable: true,
                                validation: { required: { message: "Поле 'Форма тела' является обязательным." } }
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
                                if (confirm("Вы действительно хотите удалить '" + data.Name + "' ?")) {
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
                    field: "Name",
                    title: "Название (обозначение) тела или группы тел",
                },
                {
                    field: "Amount",
                    title: "Кол-во тел",
                },
                {
                    field: "Shape",
                    title: "Форма тела",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-industrial-mineral-bodies-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.GeologyInfo && !!subsurface.GeologyInfo.IndustrialMineralBodies
                            && subsurface.GeologyInfo.IndustrialMineralBodies.length > 0) {
                            $.each(subsurface.GeologyInfo.IndustrialMineralBodies, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Id: {
                                defaultValue: 0
                            },
                            Name: {
                                editable: true,
                                validation: { required: { message: "Поле 'Название' является обязательным." } }
                            },
                            Amount: {
                                editable: true,
                                validation: { required: { message: "Поле 'Кол-во тел' является обязательным." } }
                            },
                            Shape: {
                                editable: true,
                                validation: { required: { message: "Поле 'Форма тела' является обязательным." } }
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
                                if (confirm("Вы действительно хотите удалить '" + data.Name + "' ?")) {
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
                    field: "Name",
                    title: "Название (обозначение) тела или группы тел",
                },
                {
                    field: "Amount",
                    title: "Кол-во тел",
                },
                {
                    field: "Shape",
                    title: "Форма тела",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-main-minerals-stock-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.StockInfo && !!subsurface.StockInfo.MainMineralStocks
                            && subsurface.StockInfo.MainMineralStocks.length > 0) {
                            $.each(subsurface.StockInfo.MainMineralStocks, function (k, v) {
                                items.push(v);
                                $.extend({}, v);
                            });
                        }
                        options.success(items);
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
                            MineralName: {
                                editable: false
                            },
                            UnitId: {
                                editable: true,
                            },
                            ABC1: {
                                //type: "number",
                                editable: true,
                            },
                            C2: {
                                //type: "number",
                                editable: true,
                            },
                            Zabalance: {
                                //type: "number",
                                editable: true
                            },
                            P1: {
                                //type: "number",
                                editable: true,
                            },
                            P2: {
                                //type: "number",
                                editable: true,
                            },
                            P3: {
                                //type: "number",
                                editable: true,
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
                                if (confirm("Вы действительно хотите удалить полезное ископаемое '" + data.MineralName + "' ?")) {
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
                    field: "MineralName",
                    title: "Вид полезного ископаемого",
                },
                {
                    field: "UnitName",
                    title: "Ед.измерения",
                    editor: function (container, options) {
                        var dropDown = $('<input data-text-field="Text" data-value-field="Value" data-value-primitive="true"/>').appendTo(container).kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                transport: {
                                    read: {
                                        url: globalVars.consts.AbsoluteUri + "/api/subsurface/get_units",
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
                            }),
                            dataValueField: "Value",
                            dataTextField: "Text",
                            autobind: true,
                            change: function (e) {
                                options.model["UnitId"] = dropDown.value();
                                options.model["UnitName"] = dropDown.text();
                            },
                            dataBound: function () {
                                if (!options.model["UnitId"]) {
                                    options.model["UnitId"] = this.value();
                                    options.model["UnitName"] = this.text();
                                } else {
                                    this.value(options.model["UnitId"]);
                                }
                            }
                        }).data("kendoDropDownList");
                    }
                },
                {
                    title: "Запасы по категории",
                    columns: [
                        {
                            field: "ABC1",
                            title: "А+В+С1",
                        },
                        {
                            field: "C2",
                            title: "С2",
                        },
                        {
                            field: "Zabalance",
                            title: "Забалансовые",
                        }
                    ]
                },
                {
                    title: "Прогнозные ресурсы по категории",
                    columns: [
                        {
                            field: "P1",
                            title: "P1",
                        },
                        {
                            field: "P2",
                            title: "P2",
                        },
                        {
                            field: "P3",
                            title: "P3",
                        }
                    ]
                }
            ],
            toolbar: kendo.template($("#subsurface-main-minerals-grid-toolbar").html()),
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-passing-minerals-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.StockInfo && !!subsurface.StockInfo.PassingMinerals
                            && subsurface.StockInfo.PassingMinerals.length > 0) {
                            $.each(subsurface.StockInfo.PassingMinerals, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            MineralName: {
                                editable: false
                            },
                            UnitId: {
                                editable: true
                            },
                            ABC1: {
                                //type: "number",
                                editable: true
                            },
                            C2: {
                                //type: "number",
                                editable: true,
                            },
                            Zabalance: {
                                //type: "number",
                                editable: true,
                            },
                            P1: {
                                //type: "number",
                                editable: true,
                            },
                            P2: {
                                //type: "number",
                                editable: true,
                            },
                            P3: {
                                //type: "number",
                                editable: true,
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
                                if (confirm("Вы действительно хотите удалить полезное ископаемое '" + data.MineralName + "' ?")) {
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
                    field: "MineralName",
                    title: "Вид полезного ископаемого",
                },
                {
                    field: "UnitName",
                    title: "Ед.измерения",
                    editor: function (container, options) {
                        var dropDown = $('<input data-text-field="Text" data-value-field="Value" data-value-primitive="true"/>').appendTo(container).kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                transport: {
                                    read: {
                                        url: globalVars.consts.AbsoluteUri + "/api/subsurface/get_units",
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
                            }),
                            dataValueField: "Value",
                            dataTextField: "Text",
                            autobind: true,
                            change: function (e) {
                                options.model["UnitId"] = dropDown.value();
                                options.model["UnitName"] = dropDown.text();
                            },
                            dataBound: function () {
                                if (!options.model["UnitId"]) {
                                    options.model["UnitId"] = this.value();
                                    options.model["UnitName"] = this.text();
                                } else {
                                    this.value(options.model["UnitId"]);
                                }
                            }
                        }).data("kendoDropDownList");
                    }
                },
                {
                    title: "Запасы по категории",
                    columns: [
                        {
                            field: "ABC1",
                            title: "А+В+С1",
                        },
                        {
                            field: "C2",
                            title: "С2",
                        },
                        {
                            field: "Zabalance",
                            title: "Забалансовые",
                        }
                    ]
                },
                {
                    title: "Прогнозные ресурсы по категории",
                    columns: [
                        {
                            field: "P1",
                            title: "P1",
                        },
                        {
                            field: "P2",
                            title: "P2",
                        },
                        {
                            field: "P3",
                            title: "P3",
                        }
                    ]
                }
            ],
            toolbar: kendo.template($("#subsurface-passing-minerals-grid-toolbar").html()),
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-ore-stock-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.StockInfo && !!subsurface.StockInfo.OreStocks
                            && subsurface.StockInfo.OreStocks.length > 0) {
                            $.each(subsurface.StockInfo.OreStocks, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Id: {
                                defaultValue: 0
                            },
                            MineralName: {
                                editable: true,
                                validation: { required: { message: "Поле 'Вид полезного ископаемого' является обязательным." } }
                            },
                            UnitId: {
                                editable: true
                            },
                            ABC1: {
                                //type: "number",
                                editable: true
                            },
                            C2: {
                                //type: "number",
                                editable: true
                            },
                            Zabalance: {
                                //type: "number",
                                editable: true
                            },
                            P1: {
                                //type: "number",
                                editable: true
                            },
                            P2: {
                                //type: "number",
                                editable: true
                            },
                            P3: {
                                //type: "number",
                                editable: true
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
                                if (confirm("Вы действительно хотите удалить полезное ископаемое '" + data.MineralName + "' ?")) {
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
                    field: "MineralName",
                    title: "Вид полезного ископаемого",
                },
                {
                    field: "UnitName",
                    title: "Ед.измерения",
                    editor: function (container, options) {
                        var dropDown = $('<input data-text-field="Text" data-value-field="Value" data-value-primitive="true"/>').appendTo(container).kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                transport: {
                                    read: {
                                        url: globalVars.consts.AbsoluteUri + "/api/subsurface/get_units",
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
                            }),
                            dataValueField: "Value",
                            dataTextField: "Text",
                            autobind: true,
                            change: function (e) {
                                options.model["UnitId"] = dropDown.value();
                                options.model["UnitName"] = dropDown.text();
                            },
                            dataBound: function () {
                                if (!options.model["UnitId"]) {
                                    options.model["UnitId"] = this.value();
                                    options.model["UnitName"] = this.text();
                                } else {
                                    this.value(options.model["UnitId"]);
                                }
                            }
                        }).data("kendoDropDownList");
                    }
                },
                {
                    title: "Запасы по категории",
                    columns: [
                        {
                            field: "ABC1",
                            title: "А+В+С1",
                        },
                        {
                            field: "C2",
                            title: "С2",
                        },
                        {
                            field: "Zabalance",
                            title: "Забалансовые",
                        }
                    ]
                },
                {
                    title: "Прогнозные ресурсы по категории",
                    columns: [
                        {
                            field: "P1",
                            title: "P1",
                        },
                        {
                            field: "P2",
                            title: "P2",
                        },
                        {
                            field: "P3",
                            title: "P3",
                        }
                    ]
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }], //kendo.template($("#subsurface-ore-stock-grid-toolbar").html()),
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-oils-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.StockDebitInfo && !!subsurface.StockDebitInfo.Oils
                            && subsurface.StockDebitInfo.Oils.length > 0) {
                            $.each(subsurface.StockDebitInfo.Oils, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Id: {
                                defaultValue: 0,
                            },
                            LayerName: {
                                editable: true
                            },
                            Debit: {
                                type: "number",
                                defaultValue: null,
                                editable: true
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
                                if (confirm("Вы действительно хотите удалить '" + data.LayerName + "' ?")) {
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
                    field: "LayerName",
                    title: "Индекс и (или) название пласта (горизонта, залежи)",
                },
                {
                    field: "Debit",
                    title: "Дебет, куб.м/сут",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-condensates-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.StockDebitInfo && !!subsurface.StockDebitInfo.Condensates
                            && subsurface.StockDebitInfo.Condensates.length > 0) {
                            $.each(subsurface.StockDebitInfo.Condensates, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Id: {
                                defaultValue: 0,
                            },
                            LayerName: {
                                editable: true
                            },
                            Debit: {
                                type: "number",
                                defaultValue: null,
                                editable: true
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
                                if (confirm("Вы действительно хотите удалить '" + data.LayerName + "' ?")) {
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
                    field: "LayerName",
                    title: "Индекс и (или) название пласта (горизонта, залежи)",
                },
                {
                    field: "Debit",
                    title: "Дебет, куб.м/сут",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-attenuated-gases-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.StockDebitInfo && !!subsurface.StockDebitInfo.AttenuatedGases
                            && subsurface.StockDebitInfo.AttenuatedGases.length > 0) {
                            $.each(subsurface.StockDebitInfo.AttenuatedGases, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Id: {
                                defaultValue: 0,
                            },
                            LayerName: {
                                editable: true
                            },
                            GasFactor: {
                                type: "number",
                                defaultValue: null,
                                editable: true
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
                                if (confirm("Вы действительно хотите удалить '" + data.LayerName + "' ?")) {
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
                    field: "LayerName",
                    title: "Индекс и (или) название пласта (горизонта, залежи)",
                },
                {
                    field: "GasFactor",
                    title: "Газовый фактор среднегодовой, куб.м/т.",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-free-gases-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.StockDebitInfo && !!subsurface.StockDebitInfo.FreeGases
                            && subsurface.StockDebitInfo.FreeGases.length > 0) {
                            $.each(subsurface.StockDebitInfo.FreeGases, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Id: {
                                defaultValue: 0,
                            },
                            LayerName: {
                                editable: true
                            },
                            GasType: {
                                editable: true
                            },
                            Debit: {
                                type: "number",
                                defaultValue: null,
                                editable: true
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
                                if (confirm("Вы действительно хотите удалить '" + data.LayerName + "' ?")) {
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
                    field: "LayerName",
                    title: "Индекс и (или) название пласта (горизонта, залежи)",
                },
                {
                    field: "GasType",
                    title: "Вид газа",
                },
                {
                    field: "Debit",
                    title: "Дебет, куб.м/сут",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-condition-items-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.ConditionInfo && !!subsurface.ConditionInfo.ConditionItems
                            && subsurface.ConditionInfo.ConditionItems.length > 0) {
                            $.each(subsurface.ConditionInfo.ConditionItems, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Id: {
                                defaultValue: 0
                            },
                            Index: {
                                editable: true
                            },
                            Minerals: {
                                editable: true
                            },
                            Unit: {
                                editable: true
                            },
                            Value: {
                                editable: true,
                                defaultValue: null,
                                type: "number"
                            },
                            Additional: {
                                editable: true
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
                                if (confirm("Вы действительно хотите удалить '" + data.Kind + "' ?")) {
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
                    field: "Index",
                    title: "Показатели кондиций",
                },
                {
                    field: "Minerals",
                    title: "Полезные ископаемые (примеси)",
                },
                {
                    field: "Unit",
                    title: "Единицы измерения",
                },
                {
                    field: "Value",
                    title: "Значение",
                },
                {
                    field: "Additional",
                    title: "Дополнительные данные",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-development-factors-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.ConditionInfo && !!subsurface.ConditionInfo.DevelopmentFactors
                            && subsurface.ConditionInfo.DevelopmentFactors.length > 0) {
                            $.each(subsurface.ConditionInfo.DevelopmentFactors, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Id: {
                                defaultValue: 0
                            },
                            Method: {
                                editable: true
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
                                if (confirm("Вы действительно хотите удалить '" + data.Method + "' ?")) {
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
                    field: "Method",
                    title: "Способ разработки",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-raw-consumers-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.ConditionInfo && !!subsurface.ConditionInfo.RawConsumers
                            && subsurface.ConditionInfo.RawConsumers.length > 0) {
                            $.each(subsurface.ConditionInfo.RawConsumers, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Id: {
                                defaultValue: 0
                            },
                            Consumer: {
                                editable: true
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
                                if (confirm("Вы действительно хотите удалить '" + data.Consumer + "' ?")) {
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
                    field: "Consumer",
                    title: "Потребитель",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-brines-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.HydroMineralInfo && !!subsurface.HydroMineralInfo.Brines
                            && subsurface.HydroMineralInfo.Brines.length > 0) {
                            $.each(subsurface.HydroMineralInfo.Brines, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Id: {
                                defaultValue: 0
                            },
                            Square: {
                                defaultValue: null,
                                type: "number",
                                editable: true
                            },
                            Volume: {
                                defaultValue: null,
                                type: "number",
                                editable: true
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
                                if (confirm("Вы действительно хотите удалить?")) {
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
                    field: "Square",
                    title: "Площадь, кв.м.",
                },
                {
                    field: "Volume",
                    title: "Объем, тыс.куб.м.",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-solids-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.HydroMineralInfo && !!subsurface.HydroMineralInfo.Solids
                            && subsurface.HydroMineralInfo.Solids.length > 0) {
                            $.each(subsurface.HydroMineralInfo.Solids, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Id: {
                                defaultValue: 0
                            },
                            Square: {
                                defaultValue: null,
                                type: "number",
                                editable: true
                            },
                            Length: {
                                defaultValue: null,
                                type: "number",
                                editable: true
                            },
                            Width: {
                                defaultValue: null,
                                type: "number",
                                editable: true
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
                                if (confirm("Вы действительно хотите удалить?")) {
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
                    field: "Length",
                    title: "Длина, м",
                },
                {
                    field: "Width",
                    title: "Ширина, м.",
                },
                {
                    field: "Square",
                    title: "Площадь, тыс.кв.м.",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-chemists-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.HydroMineralInfo && !!subsurface.HydroMineralInfo.Chemists
                            && subsurface.HydroMineralInfo.Chemists.length > 0) {
                            $.each(subsurface.HydroMineralInfo.Chemists, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            Id: {
                                defaultValue: 0
                            },
                            Type: {
                                editable: true
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
                                if (confirm("Вы действительно хотите удалить '" + data.Type + "'?")) {
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
                    field: "Type",
                    title: "Вид сырья",
                }
            ],
            toolbar: [{ name: "create", text: "Добавить" }],
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-commons-stock-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.StockInfo && !!subsurface.StockInfo.Commons
                            && subsurface.StockInfo.Commons.length > 0) {
                            $.each(subsurface.StockInfo.Commons, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            MineralName: {
                                editable: false
                            },
                            UnitId: {
                                editable: true
                            },
                            ABC1: {
                                //type: "number",
                                editable: true,
                            },
                            C2: {
                                //type: "number",
                                editable: true,
                            },
                            Zabalance: {
                                //type: "number",
                                editable: true,
                            },
                            P1: {
                                //type: "number",
                                editable: true,
                            },
                            P2: {
                                //type: "number",
                                editable: true,
                            },
                            P3: {
                                //type: "number",
                                editable: true,
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
                                if (confirm("Вы действительно хотите удалить '" + data.MineralName + "' ?")) {
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
                    field: "MineralName",
                    title: "Вид полезного ископаемого",
                },
                {
                    field: "UnitName",
                    title: "Ед.измерения",
                    editor: function (container, options) {
                        var dropDown = $('<input data-text-field="Text" data-value-field="Value" data-value-primitive="true"/>').appendTo(container).kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                transport: {
                                    read: {
                                        url: globalVars.consts.AbsoluteUri + "/api/subsurface/get_units",
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
                            }),
                            dataValueField: "Value",
                            dataTextField: "Text",
                            autobind: true,
                            change: function (e) {
                                options.model["UnitId"] = dropDown.value();
                                options.model["UnitName"] = dropDown.text();
                            },
                            dataBound: function () {
                                if (!options.model["UnitId"]) {
                                    options.model["UnitId"] = this.value();
                                    options.model["UnitName"] = this.text();
                                } else {
                                    this.value(options.model["UnitId"]);
                                }
                            }
                        }).data("kendoDropDownList");
                    }
                },
                {
                    title: "Запасы по категории",
                    columns: [
                        {
                            field: "ABC1",
                            title: "А+В+С1",
                        },
                        {
                            field: "C2",
                            title: "С2",
                        },
                        {
                            field: "Zabalance",
                            title: "Забалансовые",
                        }
                    ]
                },
                {
                    title: "Прогнозные ресурсы по категории",
                    columns: [
                        {
                            field: "P1",
                            title: "P1",
                        },
                        {
                            field: "P2",
                            title: "P2",
                        },
                        {
                            field: "P3",
                            title: "P3",
                        }
                    ]
                }
            ],
            toolbar: kendo.template($("#subsurface-commons-grid-toolbar").html()),
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-before-stock-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.StockInfo && !!subsurface.StockInfo.HydrocarbonMineralsBefore2016
                            && subsurface.StockInfo.HydrocarbonMineralsBefore2016.length > 0) {
                            $.each(subsurface.StockInfo.HydrocarbonMineralsBefore2016, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            MineralName: {
                                editable: false
                            },
                            UnitId: {
                                editable: true,
                            },
                            ABC1: {
                                //type: "number",
                                editable: true,
                            },
                            C2: {
                                //type: "number",
                                editable: true
                            },
                            C3: {
                                //type: "number",
                                editable: true,
                            },
                            D1L: {
                                //type: "number",
                                editable: true,
                            },
                            D1: {
                                //type: "number",
                                editable: true,
                            },
                            D2: {
                                //type: "number",
                                editable: true,

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
                                if (confirm("Вы действительно хотите удалить '" + data.MineralName + "' ?")) {
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
                    field: "MineralName",
                    title: "Вид полезного ископаемого",
                },
                {
                    field: "UnitName",
                    title: "Ед.измерения",
                    editor: function (container, options) {
                        var dropDown = $('<input data-text-field="Text" data-value-field="Value" data-value-primitive="true"/>').appendTo(container).kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                transport: {
                                    read: {
                                        url: globalVars.consts.AbsoluteUri + "/api/subsurface/get_units",
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
                            }),
                            dataValueField: "Value",
                            dataTextField: "Text",
                            autobind: true,
                            change: function (e) {
                                options.model["UnitId"] = dropDown.value();
                                options.model["UnitName"] = dropDown.text();
                            },
                            dataBound: function () {
                                if (!options.model["UnitId"]) {
                                    options.model["UnitId"] = this.value();
                                    options.model["UnitName"] = this.text();
                                } else {
                                    this.value(options.model["UnitId"]);
                                }
                            }
                        }).data("kendoDropDownList");
                    }
                },
                {
                    title: "Запасы по категории",
                    columns: [
                        {
                            field: "ABC1",
                            title: "А+В+С1",
                        },
                        {
                            field: "C2",
                            title: "С2",
                        },
                        {
                            field: "C3",
                            title: "C3",
                        }
                    ]
                },
                {
                    title: "Прогнозные ресурсы по категории",
                    columns: [
                        {
                            field: "D1L",
                            title: "Д1л",
                        },
                        {
                            field: "D1",
                            title: "Д1",
                        },
                        {
                            field: "D2",
                            title: "Д2",
                        }
                    ]
                }
            ],
            toolbar: kendo.template($("#subsurface-before-grid-toolbar").html()),
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });
        $("#subsurface-after-stock-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var subsurface = that.get('subsurface');
                        var items = [];
                        if (!!subsurface && !!subsurface.StockInfo && !!subsurface.StockInfo.HydrocarbonMineralsAfter2016
                            && subsurface.StockInfo.HydrocarbonMineralsAfter2016.length > 0) {
                            $.each(subsurface.StockInfo.HydrocarbonMineralsAfter2016, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
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
                            MineralName: {
                                editable: false
                            },
                            UnitId: {
                                editable: true,
                            },
                            AB1B2C1: {
                                //type: "number",
                                editable: true,
                            },
                            C2: {
                                //type: "number",
                                editable: true,
                            },
                            C3: {
                                //type: "number",
                                editable: true,
                            },
                            D0: {
                                //type: "number",
                                editable: true,
                            },
                            DL: {
                                //type: "number",
                                editable: true,
                            },
                            D1: {
                                //type: "number",
                                editable: true
                            },
                            D2: {
                                //type: "number",
                                editable: true
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
                                if (confirm("Вы действительно хотите удалить '" + data.MineralName + "' ?")) {
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
                    field: "MineralName",
                    title: "Вид полезного ископаемого",
                },
                {
                    field: "UnitName",
                    title: "Ед.измерения",
                    editor: function (container, options) {
                        var dropDown = $('<input data-text-field="Text" data-value-field="Value" data-value-primitive="true"/>').appendTo(container).kendoDropDownList({
                            dataSource: new kendo.data.DataSource({
                                transport: {
                                    read: {
                                        url: globalVars.consts.AbsoluteUri + "/api/subsurface/get_units",
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
                            }),
                            dataValueField: "Value",
                            dataTextField: "Text",
                            autobind: true,
                            change: function (e) {
                                options.model["UnitId"] = dropDown.value();
                                options.model["UnitName"] = dropDown.text();
                            },
                            dataBound: function () {
                                if (!options.model["UnitId"]) {
                                    options.model["UnitId"] = this.value();
                                    options.model["UnitName"] = this.text();
                                } else {
                                    this.value(options.model["UnitId"]);
                                }
                            }
                        }).data("kendoDropDownList");
                    }
                },
                {
                    title: "Запасы по категории",
                    columns: [
                        {
                            field: "AB1B2C1",
                            title: "А+В1+В2+С1",
                            width: 100
                        },
                        {
                            field: "C2",
                            title: "С2",
                        },
                        {
                            field: "C3",
                            title: "C3",
                        }
                    ]
                },
                {
                    title: "Прогнозные ресурсы по категории",
                    columns: [
                        {
                            field: "D0",
                            title: "Д0"
                        },
                        {
                            field: "DL",
                            title: "Дл",
                        },
                        {
                            field: "D1",
                            title: "Д1",
                        },
                        {
                            field: "D2",
                            title: "Д2",
                        }
                    ]
                }
            ],
            toolbar: kendo.template($("#subsurface-after-grid-toolbar").html()),
            resizable: false,
            //reorderable: true,
            editable: "incell",
            pageable: false,
            sortable: false
        });

        $("#subsurface-linked-add").bind('click', function () {
            that.addLinkToSubsurface();
        });
        $("#subsurface-doc-add").bind('click', function () {
            that.addDocToSubsurface();
        });
        $("#subsurface-main-minerals").bind('click', function () {
            window.mineralsVM.isOreStock = false;
            window.mineralsVM.checkChildElements = false;
            that.openMainMineralsPopup();
        });
        $("#subsurface-passing-minerals").bind('click', function () {
            window.mineralsVM.isOreStock = false;
            window.mineralsVM.checkChildElements = false;
            that.openPassingMineralsPopup();
        });
        $("#subsurface-ore-stock").bind('click', function () {
            window.mineralsVM.isOreStock = false;
            window.mineralsVM.checkChildElements = false;
            that.openOreStockPopup();
        });
        $("#subsurface-commons").bind('click', function () {
            window.mineralsVM.isOreStock = false;
            window.mineralsVM.checkChildElements = false;
            that.openCommonsPopup();
        });
        $("#subsurface-before").bind('click', function () {
            window.mineralsVM.isOreStock = false;
            window.mineralsVM.checkChildElements = false;
            that.openBeforePopup();
        });
        $("#subsurface-after").bind('click', function () {
            window.mineralsVM.isOreStock = false;
            window.mineralsVM.checkChildElements = false;
            that.openAfterPopup();
        });
    },
    saveSubsurface: function (e) {
        $(e.target).prop("disabled", true);
        var that = this;
        var data = $.extend({}, this.get('subsurface'));
        $("#edit-form .validation-error").removeClass("validation-error");
        var errors = [];
        var gridsErrors = [];
        this.set('errors', errors);

        if (!!data) {
            var valid = true;
            if (!data.Name) {
                valid = false;
                $("input[name='subsurface-name']").addClass("validation-error");
                errors.push("Поле 'Наименование' является обязательным.");
            }
            if (!data.Subjects || data.Subjects.length == 0) {
                valid = false;
                errors.push("Необходимо выбрать хотя бы один субъект.");
            }
            if (typeof (data.TypeId) == "undefined") {
                valid = false;
                $("select[name='subsurface-type']").closest("span").addClass("validation-error")
                errors.push("Поле 'Вид' является обязательным.");
            }
            if (!data.MineralsList || data.MineralsList.length == 0) {
                valid = false;
                errors.push("Необходимо выбрать хотя бы одно полезное ископаемое.");
            }
            if (typeof (data.FormationTypeId) == "undefined") {
                valid = false;
                $("select[name='subsurface-formation-type']").closest("span").addClass("validation-error");
                errors.push("Поле 'Вид геологического образования' является обязательным.");
            }


            var points = $("#subsurface-points-grid").data("kendoGrid").dataSource.data();
            data.Points = [];
            $.each(points, function (k, v) {
                if (!!v.Name || !!v.Type || !!v.Direction || !!v.Distance) {
                    if (!v.Id)
                        v.Id = 0;
                    if (!v.Direction)
                        v.Direction = null;
                    data.Points.push(v);
                }
            });

            var waterAreas = $("#subsurface-water-areas-grid").data("kendoGrid").dataSource.data();
            data.WaterAreas = [];
            $.each(waterAreas, function (k, v) {
                if (!!v.Name || !!v.Distance) {
                    if (!v.Id)
                        v.Id = 0;
                    data.WaterAreas.push(v);
                }
            });

            if (!data.WorkInfo)
                data.WorkInfo = {};
            data.WorkInfo.Stages = [];
            data.WorkInfo.Studyings = [];
            data.WorkInfo.DevelopingStages = [];
            var stages = $("#subsurface-stages-grid").data("kendoGrid").dataSource.data();
            $.each(stages, function (k, v) {
                if (!!v.Stage || !!v.BeginYear || !!v.EndYear) {
                    if (!v.Id)
                        v.Id = 0;
                    data.WorkInfo.Stages.push(v);
                }

            });
            var developingStages = $("#subsurface-developing-stages-grid").data("kendoGrid").dataSource.data();
            $.each(developingStages, function (k, v) {
                if (!!v.Name || !!v.InventYear) {
                    if (!v.Id)
                        v.Id = 0;
                    data.WorkInfo.DevelopingStages.push(v);
                }
            });
            var studyings = $("#subsurface-studyings-grid").data("kendoGrid").dataSource.data();
            $.each(studyings, function (k, v) {
                if (!!v.Stage || !!v.BeginYear || !!v.EndYear) {
                    if (!v.Id)
                        v.Id = 0;
                    data.WorkInfo.Studyings.push(v);
                }
            });

            if (!data.GeologyInfo)
                data.GeologyInfo = {};
            data.GeologyInfo.IndustrialRegions = [];
            data.GeologyInfo.IndustrialMineralBodies2 = [];
            data.GeologyInfo.IndustrialMineralBodies = [];
            var industrialRegions = $("#subsurface-industrial-regions-grid").data("kendoGrid").dataSource.data();
            $.each(industrialRegions, function (k, v) {
                if (!!v.Name)
                    data.GeologyInfo.IndustrialRegions.push(v);
            });
            var industrialMineralBodies2 = $("#subsurface-industrial-mineral-bodies-2-grid").data("kendoGrid").dataSource.data();
            var industrialMineralBodies2Valid = true;
            $.each(industrialMineralBodies2, function (k, v) {
                if (!!v.Name && !!v.Amount && !!v.Shape)
                    data.GeologyInfo.IndustrialMineralBodies2.push(v);
                else
                    industrialMineralBodies2Valid = false;
            });
            if (!industrialMineralBodies2Valid) {
                //valid = false;
                gridsErrors.push("'Промышленные тела полезных ископаемых'");
                $.each($("#subsurface-industrial-mineral-bodies-2-grid .k-grid-content tbody tr td input"), function (k, v) {

                });
            }
            var industrialMineralBodies = $("#subsurface-industrial-mineral-bodies-grid").data("kendoGrid").dataSource.data();
            $.each(industrialMineralBodies, function (k, v) {
                if (!!v.Name && !!v.Amount && !!v.Shape)
                    data.GeologyInfo.IndustrialMineralBodies.push(v);
            });

            if (!data.StockDebitInfo)
                data.StockDebitInfo = {};
            data.StockDebitInfo.Oils = [];
            data.StockDebitInfo.Condensates = [];
            data.StockDebitInfo.AttenuatedGases = [];
            data.StockDebitInfo.FreeGases = [];
            var oils = $("#subsurface-oils-grid").data("kendoGrid").dataSource.data();
            $.each(oils, function (k, v) {
                if (!!v.LayerName || !!v.Debit)
                    data.StockDebitInfo.Oils.push(v);
            });
            var condensates = $("#subsurface-condensates-grid").data("kendoGrid").dataSource.data();
            $.each(condensates, function (k, v) {
                if (!!v.LayerName || !!v.Debit)
                    data.StockDebitInfo.Condensates.push(v);
            });
            var attenuatedGases = $("#subsurface-attenuated-gases-grid").data("kendoGrid").dataSource.data();
            $.each(attenuatedGases, function (k, v) {
                if (!!v.LayerName || !!v.GasFactor)
                    data.StockDebitInfo.AttenuatedGases.push(v);
            });
            var freeGases = $("#subsurface-free-gases-grid").data("kendoGrid").dataSource.data();
            $.each(freeGases, function (k, v) {
                if (!!v.LayerName || !!v.GasType || !!v.Debit)
                    data.StockDebitInfo.FreeGases.push(v);
            });

            if (!data.ConditionInfo)
                data.ConditionInfo = {};
            data.ConditionInfo.ConditionItems = [];
            data.ConditionInfo.DevelopmentFactors = [];
            data.ConditionInfo.RawConsumers = [];
            var conditionItems = $("#subsurface-condition-items-grid").data("kendoGrid").dataSource.data();
            $.each(conditionItems, function (k, v) {
                if (!!v.Index || !!v.Minerals || !!v.Unit || !!v.Value || !!v.Additional)
                    data.ConditionInfo.ConditionItems.push(v);
            });
            var developmentFactors = $("#subsurface-development-factors-grid").data("kendoGrid").dataSource.data();
            $.each(developmentFactors, function (k, v) {
                if (!!v.Method)
                    data.ConditionInfo.DevelopmentFactors.push(v);
            });
            var rawConsumers = $("#subsurface-raw-consumers-grid").data("kendoGrid").dataSource.data();
            $.each(rawConsumers, function (k, v) {
                if (!!v.Consumer)
                    data.ConditionInfo.RawConsumers.push(v);
            });

            if (!data.HydroMineralInfo)
                data.HydroMineralInfo = {};
            data.HydroMineralInfo.Brines = [];
            data.HydroMineralInfo.Solids = [];
            data.HydroMineralInfo.Chemists = [];
            var brines = $("#subsurface-brines-grid").data("kendoGrid").dataSource.data();
            $.each(brines, function (k, v) {
                if (!!v.Square || !!v.Volume)
                    data.HydroMineralInfo.Brines.push(v);
            });
            var solids = $("#subsurface-solids-grid").data("kendoGrid").dataSource.data();
            $.each(solids, function (k, v) {
                if (!!v.Square || !!v.Length || !!v.Width)
                    data.HydroMineralInfo.Solids.push(v);
            });
            var chemists = $("#subsurface-chemists-grid").data("kendoGrid").dataSource.data();
            $.each(chemists, function (k, v) {
                if (!!v.Type)
                    data.HydroMineralInfo.Chemists.push(v);
            });

            if (!data.StockInfo)
                data.StockInfo = {};
            data.StockInfo.Commons = [];
            data.StockInfo.MainMineralStocks = [];
            data.StockInfo.PassingMinerals = [];
            data.StockInfo.OreStocks = [];
            data.StockInfo.HydrocarbonMineralsBefore2016 = [];
            data.StockInfo.HydrocarbonMineralsAfter2016 = [];
            var commons = $("#subsurface-commons-stock-grid").data("kendoGrid").dataSource.data();
            $.each(commons, function (k, v) {
                if (!!v.MineralId)
                    data.StockInfo.Commons.push(v);
            });
            var mainMineralStocks = $("#subsurface-main-minerals-stock-grid").data("kendoGrid").dataSource.data();
            $.each(mainMineralStocks, function (k, v) {
                if (!!v.MineralId)
                    data.StockInfo.MainMineralStocks.push(v);
            });
            var passingMinerals = $("#subsurface-passing-minerals-grid").data("kendoGrid").dataSource.data();
            $.each(passingMinerals, function (k, v) {
                if (!!v.MineralId)
                    data.StockInfo.PassingMinerals.push(v);
            });
            var oreStocks = $("#subsurface-ore-stock-grid").data("kendoGrid").dataSource.data();
            $.each(oreStocks, function (k, v) {
                if (!!v.MineralName)
                    data.StockInfo.OreStocks.push(v);
            });
            var before = $("#subsurface-before-stock-grid").data("kendoGrid").dataSource.data();
            $.each(before, function (k, v) {
                if (!!v.MineralId)
                    data.StockInfo.HydrocarbonMineralsBefore2016.push(v);
            });
            var after = $("#subsurface-after-stock-grid").data("kendoGrid").dataSource.data();
            $.each(after, function (k, v) {
                if (!!v.MineralId)
                    data.StockInfo.HydrocarbonMineralsAfter2016.push(v);
            });

            var subjects = [];
            $.each(data.Subjects, function (k, v) {
                var item = {
                    Id: 0,
                    SubjectId: v.Id,
                    Name: v.Name
                };
                if (!!data.SubjectRF)
                    $.each(data.SubjectRF, function (k1, v1) {
                        if (v1.SubjectId == v.Id)
                            item.Id = v1.Id;
                    });
                subjects.push(item);
            });
            data.SubjectRF = subjects;

            var minerals = [];
            $.each(data.MineralsList, function (k, v) {
                var item = {
                    Id: 0,
                    MineralId: v.Id,
                    Name: v.Name
                };
                $.each(data.Minerals, function (k1, v1) {
                    if (v1.MineralId == v.Id)
                        item.Id = v1.Id;
                });
                minerals.push(item);
            });
            data.Minerals = minerals;

            var concerningSubsurfaces = [];
            $.each($("#subsurface-linked-places-grid").data("kendoGrid").dataSource.data(), function (k, v) {
                if (!!v.SubsurfaceRelationId) {
                    var item = $.extend({}, v);
                    /*var split = v.RelationId.split('_');
                    item.RelationDirect = parseInt(split[0]);
                    item.SubsurfaceRelationId = parseInt(split[1]);*/
                    $.each(data.ConcerningSubsurfaces, function (k1, v1) {
                        if (v1.SubsurfaceId == v.Id) {
                            item.Id = v1.Id;
                            item.Status = v1.Status;
                            item.SubjectRF = v1.SubjectRF;
                        }
                    });
                    concerningSubsurfaces.push(item);
                }
            });
            data.ConcerningSubsurfaces = concerningSubsurfaces;

            if (!data.EconomicDistrictDevelopments)
                data.EconomicDistrictDevelopments = [];
            if (!!$("#subsurface-degree") && $("#subsurface-degree").val()) {
                if (data.EconomicDistrictDevelopments.length == 0) {
                    data.EconomicDistrictDevelopments.push({
                        Id: 0,
                        Degree: $("#subsurface-degree").val()
                    });
                } else {
                    data.EconomicDistrictDevelopments[0].Degree = $("#subsurface-degree").val();
                }
            } else {
                data.EconomicDistrictDevelopments = [];
            }

            var futureUsabilities = [];
            $.each($("#subsurface-planned-to-using-grid").data("kendoGrid").dataSource.data(), function (k, v) {
                if (!v.Id)
                    v.Id = 0;
                if (!v.ApprovedOrganization)
                    v.ApprovedOrganization = null;
                if (!v.Form)
                    v.Form = null;
                if (!!v.PublishDate) {
                    v.PublishDate = moment(v.PublishDate).format("YYYY-MM-DDT12:00:00");
                }
                if (!!v.DocumentDate) {
                    v.DocumentDate = moment(v.DocumentDate).format("YYYY-MM-DDT12:00:00");
                }
                if (!!v.DeadLine) {
                    v.DeadLine = moment(v.DeadLine).format("YYYY-MM-DDT12:00:00");
                }
                if (!!v.DocId) {
                    var added = false;
                    if (!!v.GeoDocs && v.GeoDocs.length > 0) {
                        added = v.GeoDocs[0].GeoDocumentId == v.DocId;
                    }

                    if (!added) {
                        v.GeoDocs = [];
                        v.GeoDocs.push({
                            Id: 0,
                            FutureUsabilityId: v.Id,
                            GeoDocumentId: v.DocId
                        });
                    }
                } else {
                    v.GeoDocs = [];
                }
                if (!!v.DocumentNumber) {
                    futureUsabilities.push($.extend({}, v));
                }
            });
            data.FutureUsabilities = futureUsabilities;

            data.Coordinates = this.getCoordinates();

            if (!data.Planing)
                data.Planing = null;

            console.log(data, "save");

            if (valid) {
                $.ajax({
                    url: globalVars.consts.AbsoluteUri + "/api/subsurface/update",
                    dataType: "json",
                    data: { m: JSON.stringify(data) },
                    type: "POST",
                    success: function (result) {
                        $(e.target).prop("disabled", false);
                        if (result.IsSuccessful) {
                            window.location.href = globalVars.consts.AbsoluteUri + '/subsurface/' + result.Id + '/1';
                        }
                        else {
                            that.set('errors', ['В процессе сохранения возникла ошибка. Повторите попытку позже.']);
                            $("html, body").animate({ scrollTop: 0 }, "slow");
                        }
                    }
                });
            } else {
                $(e.target).prop("disabled", false);
                this.set('errors', errors);
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        } else {
            $(e.target).prop("disabled", false);
        }
    },
    //Events
    openMainMineralsPopup: function () {
        var that = this;

        var el = $('#minerals-list');

        if (!el.length)
            return false;

        $.magnificPopup.open({
            items: {
                src: el
            },
            type: 'inline',
            callbacks: {
                open: function () {
                    $(".mfp-content").height($(window).height());
                    var minerals = $("#subsurface-main-minerals-stock-grid").data("kendoGrid").dataSource.data();
                    $(".mineral").prop("checked", false);
                    var total = 0;
                    if (!!minerals && minerals.length > 0) {
                        $.each(minerals, function (k, v) {
                            $.each($(".mineral"), function (k1, v1) {
                                if ($(v1).attr("value") == v.MineralId) {
                                    $(v1).prop("checked", true);
                                    total++;
                                }
                            });
                        });
                    }
                    $(".selected-count .count i").text(total);
                },
                close: function () {
                    var dataSource = $("#subsurface-main-minerals-stock-grid").data("kendoGrid").dataSource;
                    var data = dataSource.data();
                    var newItems = [];
                    $.each(data, function (k, v) {
                        if ($(".mineral[value='" + v.MineralId + "']").prop("checked"))
                            newItems.push(v);
                    });

                    $.each($(".mineral_group_value:not('.mineral_group_header'):checked"), function (k, v) {
                        var added = false;
                        $.each(data, function (k1, v1) {
                            if ($(v).attr("value") == v1.MineralId) {
                                added = true;
                            }
                        });
                        if (!added) {
                            newItems.splice(0, 0, {
                                Id: 0,
                                MineralId: $(v).attr("value"),
                                MineralName: $(v).next().text()
                            });
                        }
                    });
                    dataSource.data(newItems);
                }
            }
        });
        return false;
    },
    openPassingMineralsPopup: function () {
        var that = this;

        var el = $('#minerals-list');

        if (!el.length)
            return false;

        $.magnificPopup.open({
            items: {
                src: el
            },
            type: 'inline',
            callbacks: {
                open: function () {
                    $(".mfp-content").height($(window).height());
                    var minerals = $("#subsurface-passing-minerals-grid").data("kendoGrid").dataSource.data();
                    $(".mineral").prop("checked", false);
                    var total = 0;
                    if (!!minerals && minerals.length > 0) {
                        $.each(minerals, function (k, v) {
                            $.each($(".mineral"), function (k1, v1) {
                                if ($(v1).attr("value") == v.MineralId) {
                                    $(v1).prop("checked", true);
                                    total++;
                                }
                            });
                        });
                    }
                    $(".selected-count .count i").text(total);
                },
                close: function () {
                    var dataSource = $("#subsurface-passing-minerals-grid").data("kendoGrid").dataSource;
                    var data = dataSource.data();
                    var newItems = [];
                    $.each(data, function (k, v) {
                        if ($(".mineral[value='" + v.MineralId + "']").prop("checked"))
                            newItems.push(v);
                    });

                    $.each($(".mineral_group_value:not('.mineral_group_header'):checked"), function (k, v) {
                        var added = false;
                        $.each(data, function (k1, v1) {
                            if ($(v).attr("value") == v1.MineralId) {
                                added = true;
                            }
                        });
                        if (!added) {
                            newItems.splice(0, 0, {
                                Id: 0,
                                MineralId: $(v).attr("value"),
                                MineralName: $(v).next().text()
                            });
                        }
                    });
                    dataSource.data(newItems);
                }
            }
        });
        return false;
    },
    openOreStockPopup: function () {
        var that = this;

        var el = $('#minerals-list');

        if (!el.length)
            return false;

        $.magnificPopup.open({
            items: {
                src: el
            },
            type: 'inline',
            callbacks: {
                open: function () {
                    $(".mfp-content").height($(window).height());
                    var minerals = $("#subsurface-ore-stock-grid").data("kendoGrid").dataSource.data();
                    $(".mineral").prop("checked", false);
                    var total = 0;
                    if (!!minerals && minerals.length > 0) {
                        $.each(minerals, function (k, v) {
                            $.each($(".mineral"), function (k1, v1) {
                                if ($(v1).attr("value") == v.MineralId) {
                                    $(v1).prop("checked", true);
                                    total++;
                                }
                            });
                        });
                    }
                    window.mineralsVM.isOreStock = true;
                    $(".selected-count .count i").text(total);
                },
                close: function () {
                    var dataSource = $("#subsurface-ore-stock-grid").data("kendoGrid").dataSource;
                    var data = dataSource.data();
                    var newItems = [];
                    $.each(data, function (k, v) {
                        if ($(".mineral[value='" + v.MineralId + "']").prop("checked"))
                            newItems.push(v);
                    });

                    $.each($(".mineral_group_value:not('.mineral_group_header'):checked"), function (k, v) {
                        var added = false;
                        $.each(data, function (k1, v1) {
                            if ($(v).attr("value") == v1.MineralId) {
                                added = true;
                            }
                        });
                        if (!added) {
                            newItems.splice(0, 0, {
                                Id: 0,
                                MineralId: $(v).attr("value"),
                                MineralName: $(v).next().text()
                            });
                        }
                    });
                    dataSource.data(newItems);
                }
            }
        });
        return false;
    },
    openCommonsPopup: function () {
        var that = this;

        var el = $('#minerals-list');

        if (!el.length)
            return false;

        $.magnificPopup.open({
            items: {
                src: el
            },
            type: 'inline',
            callbacks: {
                open: function () {
                    $(".mfp-content").height($(window).height());
                    var minerals = $("#subsurface-commons-stock-grid").data("kendoGrid").dataSource.data();
                    $(".mineral").prop("checked", false);
                    var total = 0;
                    if (!!minerals && minerals.length > 0) {
                        $.each(minerals, function (k, v) {
                            $.each($(".mineral"), function (k1, v1) {
                                if ($(v1).attr("value") == v.MineralId) {
                                    $(v1).prop("checked", true);
                                    total++;
                                }
                            });
                        });
                    }
                    $(".selected-count .count i").text(total);
                },
                close: function () {
                    var dataSource = $("#subsurface-commons-stock-grid").data("kendoGrid").dataSource;
                    var data = dataSource.data();
                    var newItems = [];
                    $.each(data, function (k, v) {
                        if ($(".mineral_group_value[value='" + v.MineralId + "']").prop("checked"))
                            newItems.push(v);
                    });

                    $.each($(".mineral:not('.mineral_group_header'):checked"), function (k, v) {
                        var added = false;
                        $.each(data, function (k1, v1) {
                            if ($(v).attr("value") == v1.MineralId) {
                                added = true;
                            }
                        });
                        if (!added) {
                            newItems.splice(0, 0, {
                                Id: 0,
                                MineralId: $(v).attr("value"),
                                MineralName: $(v).next().text()
                            });
                        }
                    });
                    dataSource.data(newItems);
                }
            }
        });
        return false;
    },
    openBeforePopup: function () {
        var that = this;

        var el = $('#minerals-list');

        if (!el.length)
            return false;

        $.magnificPopup.open({
            items: {
                src: el
            },
            type: 'inline',
            callbacks: {
                open: function () {
                    $(".mfp-content").height($(window).height());
                    var minerals = $("#subsurface-before-stock-grid").data("kendoGrid").dataSource.data();
                    $(".mineral").prop("checked", false);
                    var total = 0;
                    if (!!minerals && minerals.length > 0) {
                        $.each(minerals, function (k, v) {
                            $.each($(".mineral"), function (k1, v1) {
                                if ($(v1).attr("value") == v.MineralId) {
                                    $(v1).prop("checked", true);
                                    total++;
                                }
                            });
                        });
                    }
                    $(".selected-count .count i").text(total);
                },
                close: function () {
                    var dataSource = $("#subsurface-before-stock-grid").data("kendoGrid").dataSource;
                    var data = dataSource.data();
                    var newItems = [];
                    $.each(data, function (k, v) {
                        if ($(".mineral[value='" + v.MineralId + "']").prop("checked"))
                            newItems.push(v);
                    });

                    $.each($(".mineral_group_value:not('.mineral_group_header'):checked"), function (k, v) {
                        var added = false;
                        $.each(data, function (k1, v1) {
                            if ($(v).attr("value") == v1.MineralId) {
                                added = true;
                            }
                        });
                        if (!added) {
                            newItems.splice(0, 0, {
                                Id: 0,
                                MineralId: $(v).attr("value"),
                                MineralName: $(v).next().text()
                            });
                        }
                    });
                    dataSource.data(newItems);
                }
            }
        });
        return false;
    },
    openAfterPopup: function () {
        var that = this;

        var el = $('#minerals-list');

        if (!el.length)
            return false;

        $.magnificPopup.open({
            items: {
                src: el
            },
            type: 'inline',
            callbacks: {
                open: function () {
                    $(".mfp-content").height($(window).height());
                    var minerals = $("#subsurface-after-stock-grid").data("kendoGrid").dataSource.data();
                    $(".mineral").prop("checked", false);
                    var total = 0;
                    if (!!minerals && minerals.length > 0) {
                        $.each(minerals, function (k, v) {
                            $.each($(".mineral"), function (k1, v1) {
                                if ($(v1).attr("value") == v.MineralId) {
                                    $(v1).prop("checked", true);
                                    total++;
                                }
                            });
                        });
                    }
                    $(".selected-count .count i").text(total);
                },
                close: function () {
                    var dataSource = $("#subsurface-after-stock-grid").data("kendoGrid").dataSource;
                    var data = dataSource.data();
                    var newItems = [];
                    $.each(data, function (k, v) {
                        if ($(".mineral[value='" + v.MineralId + "']").prop("checked"))
                            newItems.push(v);
                    });

                    $.each($(".mineral_group_value:not('.mineral_group_header'):checked"), function (k, v) {
                        var added = false;
                        $.each(data, function (k1, v1) {
                            if ($(v).attr("value") == v1.MineralId) {
                                added = true;
                            }
                        });
                        if (!added) {
                            newItems.splice(0, 0, {
                                Id: 0,
                                MineralId: $(v).attr("value"),
                                MineralName: $(v).next().text()
                            });
                        }
                    });
                    dataSource.data(newItems);
                }
            }
        });
        return false;
    },
    removeThisSubject: function (e) {
        if (e.data) {
            var subsurface = $.extend({}, this.get('subsurface'));
            if (!!subsurface && !!subsurface.Subjects) {
                subsurface.Subjects = subsurface.Subjects.filter(function (i) {
                    return i.Id != e.data.Id;
                });
                this.set('subsurface', subsurface)
            }
        }
    },
    removeThisMineral: function (e) {
        if (e.data) {
            var subsurface = $.extend({}, this.get('subsurface'));
            if (!!subsurface && !!subsurface.MineralsList) {
                subsurface.MineralsList = subsurface.MineralsList.filter(function (i) {
                    return i.Id != e.data.Id;
                });
                this.set('subsurface', subsurface)
            }
        }
    },
    openMineralsPopup: function (e) {
        var that = this;
        $(e.target).blur();

        var el = $('#' + $(e.target).closest('a').attr('data-popup-id'));

        if (!el.length)
            return false;

        window.mineralsVM.checkChildElements = false;
        $.magnificPopup.open({
            items: {
                src: el
            },
            type: 'inline',
            callbacks: {
                open: function () {
                    $(".mfp-content").height($(window).height());
                    var subsurface = that.get('subsurface');
                    $(".mineral").prop("checked", false);
                    if (!!subsurface.MineralsList && subsurface.MineralsList.length > 0) {
                        $.each(subsurface.MineralsList, function (k, v) {
                            $.each($(".mineral_group_value"), function (k1, v1) {
                                if ($(v1).attr("value") == v.Id)
                                    $(v1).prop("checked", true);
                            });
                        });
                    }
                },
                close: function () {
                    var subsurface = $.extend({}, that.get('subsurface'));;
                    subsurface.MineralsList = [];
                    $.each($(".mineral_group_value"), function (k, v) {
                        if ($(v).prop("checked"))
                            subsurface.MineralsList.push({ Id: $(v).attr("value"), Name: $(v).next().text() });
                    });
                    that.set('subsurface', subsurface);
                }
            }
        });
        return false;
    },
    openSubjectsPopup: function (e) {
        var that = this;
        $(e.target).blur();

        var el = $('#' + $(e.target).closest('a').attr('data-popup-id'));

        if (!el.length)
            return false;

        $.magnificPopup.open({
            items: {
                src: el
            },
            type: 'inline',
            callbacks: {
                open: function () {
                    $(".mfp-content").height($(window).height());
                    var subsurface = that.get('subsurface');
                    $(".subject").prop("checked", false);
                    if (!!subsurface.Subjects && subsurface.Subjects.length > 0) {
                        $.each(subsurface.Subjects, function (k, v) {
                            $.each($(".subject"), function (k1, v1) {
                                if ($(v1).attr("value") == v.Id)
                                    $(v1).prop("checked", true);
                            });
                        });
                    }
                },
                close: function () {
                    var subsurface = $.extend({}, that.get('subsurface'));;
                    subsurface.Subjects = [];
                    $.each($(".subject_group_value:checked"), function (k, v) {
                        subsurface.Subjects.push({ Id: $(v).attr("value"), Name: $(v).next().text() });
                    });
                    that.set('subsurface', subsurface);
                }
            }
        });
        return false;
    },
    addLinkToSubsurface: function () {
        var that = this;
        $("#subsurface-linked-add-fail").hide();
        var concerningSubsurfaces = $("#subsurface-linked-places-grid").data("kendoGrid").dataSource.data();
        var id = $("#subsurface-linked-id").val();
        if (!!concerningSubsurfaces && !!id) {
            var added = false;
            if (id == this.get('subsurface').Id) {
                $("#subsurface-linked-add-fail").text("Редактируемый участок невозможно добавить в связанные");
                $("#subsurface-linked-add-fail").show();
                return false;
            }
            if (!!concerningSubsurfaces) {
                $.each(concerningSubsurfaces, function (k, v) {
                    if (v.SubsurfaceId == id) {
                        added = true;
                    }
                })
            }
            if (!added) {
                $.ajax({
                    url: globalVars.consts.AbsoluteUri + "/api/subsurface/check_subsurface/" + id,
                    dataType: "json",
                    type: "GET",
                    success: function (result) {
                        if (!!result && result.Success) {
                            concerningSubsurfaces.splice(0, 0, result);
                            $("#subsurface-linked-id").val("");
                            $("#subsurface-linked-places-grid").data("kendoGrid").dataSource.data(concerningSubsurfaces);
                        } else {
                            $("#subsurface-linked-add-fail").text("Участок с таким Id не найден");
                            $("#subsurface-linked-add-fail").show();
                        }
                    },
                    error: function (error) {
                        $("#subsurface-linked-add-fail").text("Такого УН не существует");
                        $("#subsurface-linked-add-fail").show();
                        console.error(error);
                    }
                });
            } else {
                $("#subsurface-linked-add-fail").text("Участок с таким Id был добавлен ранее");
                $("#subsurface-linked-add-fail").show();
            }
        }
    },
    addDocToSubsurface: function () {
        var that = this;
        $("#subsurface-doc-add-fail").hide();
        var subsurface = $.extend({}, this.get('subsurface'));
        var id = $("#subsurface-doc-id").val();
        if (!!subsurface && !!id) {
            var added = false;
            if (!!subsurface.GeoDocs) {
                $.each(subsurface.GeoDocs, function (k, v) {
                    if (v.GeoDocumentId == id) {
                        added = true;
                    }
                })
            } else {
                subsurface.GeoDocs = [];
            }
            if (!added) {
                $.ajax({
                    url: globalVars.consts.AbsoluteUri + "/api/subsurface/check_document/" + id,
                    dataType: "json",
                    type: "GET",
                    success: function (result) {
                        if (!!result && result.Success) {
                            subsurface.GeoDocs.splice(0, 0, {
                                Id: 0,
                                GeoDocumentId: result.Id,
                                Name: result.Name
                            });
                            $("#subsurface-doc-id").val("");
                            that.set('subsurface', subsurface);
                            $("#subsurface-docs-grid").data("kendoGrid").dataSource.read();
                        } else {
                            $("#subsurface-doc-add-fail").text("Файл с таким Id не найден");
                            $("#subsurface-doc-add-fail").show();
                        }
                    },
                    error: function (error) {
                        $("#subsurface-doc-add-fail").text("Такого документа не существует");
                        $("#subsurface-doc-add-fail").show();
                        console.error(error);
                    }
                });
            } else {
                $("#subsurface-doc-add-fail").text("Файл с таким Id был добавлен ранее");
                $("#subsurface-doc-add-fail").show();
            }
        }
    },
    subsurfaceCategoryOnChange: function () {
        if (this.getVisibleSolidMinerals())
            $(".solid-minerals").show();
        else
            $(".solid-minerals").hide();
        if (this.getVisibleHydrocarbonMinerals())
            $(".hydrocarbon-minerals").show();
        else
            $(".hydrocarbon-minerals").hide();
        if (this.getVisibleWaterMinerals())
            $(".water-minerals").show();
        else
            $(".water-minerals").hide();
        if (this.getVisibleNotWaterMinerals())
            $(".not-water-minerals").show();
        else
            $(".not-water-minerals").hide();
        if (this.getVisibleSolidMineralsOrNull())
            $(".solid-minerals-or-null").show();
        else
            $(".solid-minerals-or-null").hide();
        if (this.getVisibleNotHydrocarbonMinerals())
            $(".not-hydrocarbon-minerals").show();
        else
            $(".not-hydrocarbon-minerals").hide();
    },
    //DataSources
    geologicalFormationTypeDropDataSource: new kendo.data.DataSource({
        transport: {
            read: {
                url: globalVars.consts.AbsoluteUri + "/api/subsurface/geological_formation_types",
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
        }
    }),
    subsurcafeFormationTypeDropDataSource: new kendo.data.DataSource({
        transport: {
            read: {
                url: globalVars.consts.AbsoluteUri + "/api/subsurface/geological_subsurface_types",
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
        }
    }),
    densityStatusesDropDataSource: new kendo.data.DataSource({
        transport: {
            read: {
                url: globalVars.consts.AbsoluteUri + "/api/subsurface/density_statuses",
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
        }
    }),
    categoriesDropDataSource: new kendo.data.DataSource({
        transport: {
            read: {
                url: globalVars.consts.AbsoluteUri + "/api/subsurface/categories",
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
        }
    }),
    directionDropDataSource: new kendo.data.DataSource({
        transport: {
            read: {
                url: globalVars.consts.AbsoluteUri + "/api/subsurface/get_directions",
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
    kendo.culture("ru-RU");
    $.extend(editVM, coordinatesVM);

    window.editVM = kendo.observable(editVM);
    kendo.bind($("#edit-form"), window.editVM);

    window.editVM.init();
});